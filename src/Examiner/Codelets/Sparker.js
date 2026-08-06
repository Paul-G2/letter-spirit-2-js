/**
 * @classdesc
 * This Examiner codelet activates roles that its part matches and then posts an activation-spreading codelet.
 * If no roles are activated, then the part is slated for breaking unless it has too few labels, 
 * in which case labeler codelets are spun.
 * 
 */
Codelets.Sparker = class extends Codelets.CodeletBase
{
    static Name = 'sparker';
    static Text = 'Sparker';

    
    /**
     * @constructor
     * 
     * @param {Examiner} owner - The codelet's owner.
     * @param {Number} urgency - The urgency of the codelet.
     * @param {Number} generation - The generation that the codelet belongs to.
     * @param {Array} args - Arguments to pass to the codelet.
     */
    constructor(owner, urgency, generation, args) 
    { 
        super(Codelets.Sparker.Name, owner, urgency, generation);
        this.part = args[0];
    }


    /**
     * Runs the codelet.
     */
    run()
    {
        const exmr = this.owner;
        const coderack = exmr.app.coderack;
        const randGen  = exmr.randGen;

        // Display codelet info        
        this.titleText    = 'Sparker codelet from generation ' + this.gen; 
        this.messageText1 = '';
        this.messageText2 = '';  
        exmr.app.reporter.trace(this.titleText);

        // Check whether the part is still around
        const part = exmr.getUpdatedPart(this.part);
        if (!part) {
            this.messageText1 = "Part is no longer around ... >>>fizzle<<<";
            return; 
        }
        else {
            this.messageText1 = `Activating roles using part ${part.qidString()}`;
            if (!Codelets.Sparker.ActivateRolesWithPart(part, exmr)) 
            {
                let enoughLabels = Params.LabelTotal;
                if (part.numTips() == 0) { enoughLabels -= 2; }
                if (coderack.numCodeletsRun >= Params.NumExamPhaseCodelets) { enoughLabels -= 1; }

                if (part.labels.length < enoughLabels) {
                    this.messageText2 = "No roles activated (too few labels), adding labelers.";
                    if (part.hasLabel('**whine')) {
                        part.removeLabel('**whine');
                        part.addLabel(new Label('quanta', Utils.Linearize(part.getQuantaIds(), randGen)) );
                    }
                    coderack.post(3, 'labeler', Params.MediumUrgency, this.gen+1, [part]);
                } 
                else {
                    this.doSomething(part);
                }
            } 
            else 
            {                
                if ((coderack.numCodeletsRun > 25000) && (randGen.nSidedDie(100) <= 30)) {
                    exmr.smartParser.run();
                } 
                else {
                    // Decide to break/glom or do nothing
                    const partRoleActivations = exmr.bindings.filter(b => b.part.hasSameJointsAs(part)).map(b => exmr.roleActivations[b.role.name]);
                    const prob = 55 - Math.max(0, ...partRoleActivations);
                    const roll = randGen.nSidedDie(100);
                    if ((prob >= 0) && (roll <= prob)) {
                        if (part.numQuanta() <= (randGen.nSidedDie(5) + 1)) {
                            this.messageText1 = "Spinning top-down glommer";
                            coderack.post(1, 'top-down-glommer', Params.HighUrgency + prob, this.gen+1, [part]);
                        } 
                        else {
                            this.messageText1 = "Spinning top-down breaker";
                            coderack.post(1, 'top-down-breaker', Params.HighUrgency + prob, this.gen+1, [part]);
                        }
                    } 
                    else {
                        this.messageText1 = "Spinning activation-spreader";
                        coderack.post(1, 'spreader', Params.HighUrgency, this.gen+1);
                    }
                }
            }
        }
    }

    
    /**
     * Updates the activations of the roles that the part potentially fills.
     */
    static ActivateRolesWithPart(part, exmr) 
    {
        exmr.unbindPart(part);
        const sparkedRoleInfos = exmr.sparkedRoleInfos(part);
        sparkedRoleInfos.forEach(sparkInfo => {
            exmr.bindings.push( {role:sparkInfo.role, part:part, flip:sparkInfo.flip} );
            exmr.roleActivations[sparkInfo.role.name] = sparkInfo.score;
        });

        return (sparkedRoleInfos.length > 0);
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
