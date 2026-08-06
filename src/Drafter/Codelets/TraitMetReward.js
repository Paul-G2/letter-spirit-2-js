/**
 * @classdesc
 * This Drafter codelet adds points to the quit-sugar score of each candidate based on whether or
 * not the role-filler that is being drafted matches that trait with the addition of the candidate.
 *  
 */
Codelets.TraitMetReward = class extends Codelets.CodeletBase
{
    static Name = 'trait-met-reward';
    static Text = 'Trait Met/Rewarder';

    
    /**
     * @constructor
     * 
     * @param {Drafter} owner - The owner of the codelet.
     * @param {Number} urgency - The urgency of the codelet.
     * @param {Number} generation - The generation that the codelet belongs to.
     * @param {Array} args - Arguments to pass to the codelet.
     */
    constructor(owner, urgency, generation, args) 
    { 
        super(Codelets.TraitMetReward.Name, owner, urgency, generation);
        this.draftDimension = args[0];

        this.punishVal = ["Left_Edge", "Right_Edge", "Floor", "Roof"].includes(this.draftDimension) ? 
            Params.DrafterPunishHard : Params.DrafterPunish;
    }


    /**
     * Runs the codelet.
     */
    run()
    {
        // Display codelet info
        const drafter = this.owner;
        this.titleText    = 'TraitMetReward codelet from generation ' + this.gen; 
        this.messageText1 = '';
        this.messageText2 = '';    
        drafter.app.reporter.trace(this.titleText);

        this.messageText1 = '(' + drafter.currentPoint + ') --> ';
        drafter.candidates.forEach(cand => {
            const score = 35*this.traitMetScore(this.draftDimension, [cand.qid, ...drafter.ownStuff]);
            drafter.addChoice(cand, score, 4);
            this.messageText1 += '(' + cand.pid + ')' + Math.round(score) + '  ';
        });

    }


    traitMetScore(dim, quanta) 
    {
        const drafter = this.owner;
        const label = Utils.DimensionLabel(dim, quanta);
        const stored = Utils.DimensionScore(label, drafter.roleTraits, this.punishVal);        
        return (stored === 0) ? -1 : stored;
    }
};

