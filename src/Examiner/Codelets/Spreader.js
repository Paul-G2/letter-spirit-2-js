/**
 * @classdesc
 * This Examiner codelet spreads activation among wholes and roles. 
 * 
 */
 Codelets.Spreader = class extends Codelets.CodeletBase
 {
    static Name = 'spreader';
    static Text = 'Spreader';

    
    /**
     * @constructor
     * 
     * @param {Examiner} owner - The codelet's owner.
     * @param {Number} urgency - The urgency of the codelet.
     * @param {Number} generation - The generation that the codelet belongs to.
     */
    constructor(owner, urgency, generation) 
    { 
        super(Codelets.Spreader.Name, owner, urgency, generation);
    }


    /**
     * Runs the codelet.
     */
    run()
    {
        // Display codelet info
        const exmr = this.owner;
        this.titleText    = 'Activation-spreader codelet from generation ' + this.gen; 
        this.messageText1 = '';
        this.messageText2 = '';  
        exmr.app.reporter.trace(this.titleText);

        // Check whether all parts are sparked
        const randGen = exmr.randGen;
        const allPartsSparked = exmr.parts.every(p => exmr.bindings.some(b => b.part.hasSameJointsAs(p)));
        if (allPartsSparked && (randGen.rand() <= 1/3)) {
            this.doSomething(randGen.choice(exmr.parts));
        }

        // Calc updated role activations from their associated whole activations
        const roleActsBuffer = {};
        Object.values(Roles).forEach(role => {
            const oldAct = exmr.roleActivations[role.name];
            const associatedWholes = Object.keys(role.norms.contact); 
            const newAct = Params.LinkWeight * Math.max(-1, ...associatedWholes.map(w => exmr.wholeActivations[w])); 
            roleActsBuffer[role.name] = Math.min(100, Math.max(-100, newAct + Math.min(40, oldAct)));
        });

        // Calc updated whole activations from their associated role activations
        const wholeActsBuffer = {};
        Wholes.Names.forEach(wholeName => {
            const whole = Wholes[wholeName];
            const oldAct = exmr.wholeActivations[whole.name]; 
            const newAct = Params.LinkWeight * whole.roleSet.reduce((sum, r) => sum + exmr.roleActivations[r.name], 0) / whole.roleSet.length; 
            wholeActsBuffer[whole.name] = Math.min(100, Math.max(-100, newAct + Math.min(20, oldAct)));
        });

        // Transfer the buffered values to the workspace
        Object.keys(roleActsBuffer).forEach( r => exmr.roleActivations[r] = roleActsBuffer[r] ); 
        Object.keys(wholeActsBuffer).forEach( w => exmr.wholeActivations[w] = wholeActsBuffer[w] );
        
        exmr.rRoleCheckWholes();
    }


    /**
     * This function is called when we seem to be at a dead end. 
     * It randomly decides to break, glom or re-parse
     */
    doSomething(part) 
    {
        const exmr = this.owner;
        const choice = exmr.randGen.choice(['break', 'glom', 'smartparse']);
        switch (choice) {
            case 'break':
                this.messageText2 = "No roles activated, Breaker spun.";
                exmr.app.coderack.post(1, 'breaker', Params.HighUrgency, this.gen+1, [part]);
                break;
                
            case 'glom':
                this.messageText2 = "No roles activated, Glommer spun.";
                exmr.app.coderack.post(1, 'top-down-glommer', Params.HighUrgency, this.gen+1, [part]);
                break;
                
            default: 
                this.messageText2 = "No roles activated, Reparsing.";
                exmr.smartParser.run();
                break;
        }
    }
};
