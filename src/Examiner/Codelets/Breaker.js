/**
 * @classdesc
 * This Examiner codelet gets bound to a part with too many tips (more than two),
 * or to a part that does not activate any roles. It breaks the part 
 * into smaller parts.
 * 
 */
 Codelets.Breaker = class extends Codelets.CodeletBase
 {
    static Name = 'breaker';
    static Text = 'Breaker';

    
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
        super(Codelets.Breaker.Name, owner, urgency, generation);
        this.part = args[0];
    }


    /**
     * Runs the codelet.
     */
    run()
    {
        // Display codelet info
        const exmr = this.owner;
        this.titleText    = 'Breaker codelet from generation ' + this.gen; 
        this.messageText1 = '';
        this.messageText2 = '';    
        exmr.app.reporter.trace(this.titleText);
        
        // Check whether the part is still around
        if (!exmr.containsPart(this.part)) { 
            this.messageText1 = "Part is no longer around ... >>>fizzle<<<";
            return;
        }

        // Break the part
        this.messageText1 = "Breaking part " + this.part.qidString(); 
        let newParts = Codelets.Breaker.ReglueSortAndCrack(this.part.jointList, exmr);
        newParts.forEach(p => p.addLabel(new Label('**whine', 25)));

        Utils.Dampen(exmr);
        const otherParts = exmr.parts.filter(p => !p.hasSameJointsAs(this.part));
        exmr.parts = [...newParts, ...otherParts];
        exmr.app.coderack.post(newParts.length, 'looker', Params.MediumUrgency, this.gen+1);        
        this.messageText2 = "Workspace re-set and Lookers spun";
    }


    /**
     * Performs the actual breaking.
     * @private
     */
    static ReglueSortAndCrack(inputJointList, exmr)
    {
        const inputQids = [... new Set(inputJointList.flatMap(jt => jt.getQids()) )];

        // Helper function
        const breakFunc = function(jointList) {
            let parts = Utils.MakePartsFromJoints( jointList.map(jtg => jtg.joint) );
            inputQids.forEach(qid => { // Make any leftover quanta into singlet parts
                if (!parts.some(p => p.hasQid(qid))) { parts.push(new Part([new Joint(qid)])); } 
            });

            if (jointList.length == 0) { return parts; }
 
            // Lose joints that have no glue, and keep going until we have at least two parts
            if ((jointList[0].glue == 0) || (parts.length < 2))  { 
                return breakFunc(jointList.slice(1));
            } else { 
                return parts; 
            } 
        };

        
        // Get the non-singlet joints, sorted by glue
        let modJointList = inputJointList.filter(jt => !jt.isSinglet()).map(jt => { 
            const wkspJoint = exmr.getUpdatedJoint(jt);
            const glue = wkspJoint ? wkspJoint.glue : exmr.randGen.nSidedDie(100);
            return {joint:(wkspJoint || jt), glue:glue};
        });

        if (modJointList.length == 0) {
            return [new Part(inputJointList)];
        } else {
            const minGlueJoint = modJointList.reduce((prev, curr) => prev.glue < curr.glue ? prev : curr);
            return breakFunc( modJointList.filter(jt => jt != minGlueJoint));
        }
    }
};
