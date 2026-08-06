/**
 * @classdesc
 * This Drafter codelet adds points to the quit-sugar score of each candidate based on how well
 * its endpoint has been rated as the finish point of the role-filler.
 * 
 */
Codelets.Finisher = class extends Codelets.CodeletBase
{
    static Name = 'finisher';
    static Text = 'Finisher';

    
    /**
     * @constructor
     * 
     * @param {Drafter} owner - The owner of the codelet.
     * @param {Number} urgency - The urgency of the codelet.
     * @param {Number} generation - The generation that the codelet belongs to.
     */
    constructor(owner, urgency, generation) 
    { 
        super(Codelets.Finisher.Name, owner, urgency, generation);
    }


    /**
     * Runs the codelet.
     */
    run()
    {
        // Display codelet info
        const drafter = this.owner;
        this.titleText    = 'Finisher from generation ' + this.gen; 
        this.messageText1 = '';
        this.messageText2 = '';    
        drafter.app.reporter.trace(this.titleText);
        
        this.messageText1 = '(' + drafter.currentPoint + ') --> ';
        drafter.candidates.forEach(cand => {
            const score = 0.25*this.candidateTipValue(cand);
            drafter.addChoice(cand, score, 2);
            this.messageText1 += '(' + cand.pid + ')' + Math.round(score) + '  ';
        });
    }


    /**
     * Calculates the tip score.
     */
    candidateTipValue(cand)
    {
        const drafter = this.owner;
        const tip2ChoicesDict = Object.fromEntries(drafter.tip2Choices);
        const pointsBeyond = drafter.setup.pointsFromPoint(cand.pid).filter(pt => pt != drafter.lastPoint);
        // consider how well you might do after the next step
        const scoreAfter = (pointsBeyond.length === 0) ?  0 : 0.25*Math.max(...pointsBeyond.map(pt => tip2ChoicesDict[pt] || 0));
        const score = (tip2ChoicesDict[cand.pid] || 0) - scoreAfter;
        return (score > 0) ? score : -200;
    }
};

