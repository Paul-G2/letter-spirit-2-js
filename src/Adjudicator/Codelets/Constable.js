/**
 * @classdesc
 * This Adjudicator codelet checks whether the input GridLetter obeys a given Rule (one that 
 * is significant for the Whole), and if so, adds it to the workspace.abstract_rules list.
 * 
 */
Codelets.Constable = class extends Codelets.CodeletBase
{
    static Name = 'constable';
    static Text = 'Constable';

    
    /**
     * @constructor
     * 
     * @param {Adjudicator} owner - The owner of the codelet.
     * @param {Number} urgency - The urgency of the codelet.
     * @param {Number} generation - The generation that the codelet belongs to.
     * @param {Array} args - Arguments to pass to the codelet.
     */
    constructor(owner, urgency, generation, args) 
    { 
        super(Codelets.Constable.Name, owner, urgency, generation);
        this.ruleType = args[0]; // One of Rules.RuleTypes ('ban_topedge', 'ban_topbox', 'ban_ascender', etc.)
    }


    /**
     * Runs the codelet.
     */
    run()
    {
        // Display codelet info
        const adj = this.owner;
        this.titleText    = 'Constable codelet from generation ' + this.gen; 
        this.messageText1 = `Looking for ${this.ruleType} rule violation`;
        this.messageText2 = '';    
        adj.app.reporter.trace(this.titleText);
        
        const rType = this.ruleType;
        const ruleIsRelevant = Wholes.CategoryNorms[adj.input.wholeName[0]].includes(rType);
        if (ruleIsRelevant && Rules.IsSatisfied(rType, adj.input.gridLetter.quantaIds)) {
            if (!adj.styProps.abstract_rules.includes(rType)) { adj.styProps.abstract_rules.unshift(rType); }
        }
        
        // Maybe post a new constable codelet
        const randGen = adj.randGen;
        if (randGen.coinFlip()) {
            adj.app.coderack.post(1, 'constable', Params.MediumUrgency, this.gen+1, [randGen.choice(Rules.RuleTypes)]);
            this.messageText2 = 'Constable codelet spun';
        }
    }
};

