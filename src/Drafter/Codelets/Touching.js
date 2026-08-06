/**
 * @classdesc
 * This Drafter codelet adds points to the sugar scores of each candidate based on how well the
 * norms for role-fillers touching each other would be met by the addition of it to the
 * role-filler that is being drafted.
 * 
 */
Codelets.Touching = class extends Codelets.CodeletBase
{
    static Name = 'touching';
    static Text = 'Touching';

    
    /**
     * @constructor
     * 
     * @param {Drafter} owner - The owner of the codelet.
     * @param {Number} urgency - The urgency of the codelet.
     * @param {Number} generation - The generation that the codelet belongs to.
     */
    constructor(owner, urgency, generation) 
    { 
        super(Codelets.Touching.Name, owner, urgency, generation);
    }


    /**
     * Runs the codelet.
     */
    run()
    {
        // Display codelet info
        const drafter = this.owner;
        this.titleText    = 'Touching codelet from generation ' + this.gen; 
        this.messageText1 = '';
        this.messageText2 = '';    
        drafter.app.reporter.trace(this.titleText);

        this.messageText1 = '(' + drafter.currentPoint + ') --> ';
        drafter.candidates.forEach(cand => {
            const tScore = this.candidateTouching(cand);
            const qtScore = this.candidateQuitTouching(cand);
            drafter.addChoice(cand, tScore, 8);
            drafter.addChoice(cand, qtScore, 9); 
            this.messageText1 += '(' + cand.pid + ')' + Math.round(tScore) + '|' + Math.round(qtScore) +  '  ';
        });
    }

    candidateTouching(cand) 
    {
        const drafter = this.owner;

        if (drafter.touchPoints.flat().includes(cand.pid)) {
            if (drafter.midTouch) {
                return 50.0;
            } else {
                if (!drafter.otherTouchNorms || !drafter.altMidTouch) {
                    return -2500.0;
                } else {
                    return 0;
                }
            }
        } 
        else if (drafter.avoidPoints.flat().includes(cand.pid)) {
            return -2500.0;
        } 
        else if (Utils.PointIds(drafter.otherStuff).includes(cand.pid)) {
            if (drafter.midTouch) {
                return -50.0;
            } else {
                return 2500.0;
            }
        } 
        else if (drafter.avoidQuanta.flat().includes(Knowledge.MidQuantaTouchMap[cand.qid])) {
            if (drafter.midTouch || (drafter.otherTouchNorms && drafter.altMidTouch)) {
                return -250.0;
            } else {
                return -500.0;
            }
        } 
        else {
            return 0;
        }
    }

    candidateQuitTouching(cand) 
    {
        const drafter = this.owner;

        if (drafter.touchPoints.flat().includes(cand.pid)) {
            if (drafter.t2Touch) {
                return 100.0;
            } else {
                if (drafter.otherTouchNorms && drafter.altT2Touch) {
                    return 0;
                } else {
                    return -1500.0;
                }
            }
        } 
        else if (drafter.avoidPoints.flat().includes(cand.pid)) {
            return -2500.0;
        } 
        else if (drafter.avoidQuanta.flat().includes(Knowledge.MidQuantaTouchMap[cand.qid])) {
            if (drafter.t2Touch) {
                if (!drafter.otherTouchNorms || drafter.altT2Touch) {
                    return -2500.0;
                } else {
                    return 0;
                }
            } else {
                return -500.0;
            }
        } 
        else if (drafter.t2Touch && drafter.touchPoints.length) {
            return -100.0;
        } 
        else {
            return 0;
        }
    }

};

