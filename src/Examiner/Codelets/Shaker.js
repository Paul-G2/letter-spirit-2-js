/**
 * @classdesc
 * This Examiner codelet "shakes" the current grid letter, breaking it randomly into smaller parts.
 * 
 */
 Codelets.Shaker = class extends Codelets.CodeletBase
 {
    static Name = 'shaker';
    static Text = 'Shaker';


    /**
     * @constructor
     * 
     * @param {Examiner} owner - The codelet's owner.
     * @param {Number} urgency - The urgency of the codelet.
     * @param {Number} generation - The generation that the codelet belongs to.
     */
    constructor(owner, urgency, generation) 
    { 
        super(Codelets.Shaker.Name, owner, urgency, generation);
    }


    /**
     * Runs the codelet.
     */
    run()
    {
        // Display codelet info
        const exmr = this.owner;
        const app = exmr.app;
        this.titleText    = 'Shaker codelet from generation ' + this.gen;  
        this.messageText1 = '';
        this.messageText2 = '';    
        app.reporter.trace(this.titleText);

        // Initialize
        const targetNumParts = 1 + Math.round(exmr.inputGridLetter.numQuanta / Params.ShakePartSize);
        const targetNumJoints = Math.max(0, exmr.joints.length - targetNumParts);
        let dissolvedGlue = 0;

        // Probabilistically dissolve glue in the joints
        while (exmr.joints.length > targetNumJoints) {
            exmr.joints.forEach(joint => { 
                if (app.randGen.coinFlip(Params.SolventStrength)) {
                    const deltaGlue = Math.min(joint.glue, 1); 
                    joint.glue -= deltaGlue; 
                    dissolvedGlue += deltaGlue;
                }     
            });
            exmr.joints = exmr.joints.filter(joint => joint.glue > 0);
        }

        // Make parts from the connected sets of quanta
        const joints = exmr.joints.toSorted((j1, j2) => j2.qidA - j1.qidA || j2.qidB - j1.qidB);
        exmr.parts = Utils.MakePartsFromJoints(joints);
        
        // Add unbonded single quanta as "singlet" parts
        const orphans = exmr.inputGridLetter.quantaIds.filter(qid => !exmr.parts.some(part => part.hasQid(qid)));
        orphans.forEach( orphan => exmr.parts.push(new Part( [new Joint(orphan)] )) );

        // Set initial whine values on the parts
        exmr.parts.forEach(part => { part.addLabel(new Label('**whine', 20)); });
        
        // Begin recognizing
        app.coderack.post(Params.GestaltBatchSize, 'gestalt', Params.InitialGestaltCodeletUrgency, 1);
        app.coderack.post(2*exmr.parts.length, 'looker', Params.MediumUrgency, 3);
    }
   
};