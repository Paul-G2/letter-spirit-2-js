/**
 * @classdesc
 * This Drafter codelet adds points to both sugar scores of each candidate
 * based on how well it would make the role-filler that is being drafted obey a given rule.
 * 
 */
Codelets.RuleEnforcer = class extends Codelets.CodeletBase
{
    static Name = 'rule-enforcer';
    static Text = 'Rule/Enforcer';

    
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
        super(Codelets.RuleEnforcer.Name, owner, urgency, generation);
        this.ruleInfo = args[0].slice();
    }


    /**
     * Runs the codelet.
     */
    run()
    {
        // Display codelet info
        const drafter = this.owner;
        this.titleText    = 'RuleEnforcer from generation ' + this.gen; 
        this.messageText1 = '';
        this.messageText2 = '';    
        drafter.app.reporter.trace(this.titleText);

        this.messageText1 = this.ruleInfo[1] + ' : (' + drafter.lastPoint + ')(' + drafter.currentPoint + ') --> ';
        drafter.candidates.forEach(cand => {
            const ruleStepScore = 800*this.ruleStepScore(this.ruleInfo, cand);
            drafter.addChoice(cand, ruleStepScore, 6);
            this.messageText1 += '(' + cand.pid + ')' + Math.round(ruleStepScore) + '  ';
        });
    }


    /**
     * Calculates a rule-satisfaction score.
     */
    ruleStepScore(ruleInfo, cand) 
    {
        const drafter = this.owner;
        const tf = this.owner.app.thematicFocus;
        
        const ruleTfLevel = ruleInfo[0];
        const ruleType = (ruleInfo[1] == 'at_least_2') ? 'draft_at_least_2' : ruleInfo[1];
        const quantaSoFar = [...drafter.ownStuff, ...drafter.otherStuff];

        const preTest = Rules.IsSatisfied(ruleType, quantaSoFar, drafter.ownStuff, drafter.otherStuff);
        if (preTest) {
            const postTest = Rules.IsSatisfied(ruleType, [cand.qid, ...quantaSoFar], drafter.ownStuff, drafter.otherStuff);
            if (!postTest) {
                return -1.0 * tf.draftLevelScore('abstract_rules', ruleTfLevel);
            }
        } 
        return 0;
    }

};

