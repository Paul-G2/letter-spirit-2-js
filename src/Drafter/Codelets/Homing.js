/**
 * @classdesc
 * This Drafter codelet adds points to the sugar scores of each candidate based on how well the
 * candidate leads in the same direction as the previous quantum. The codelet awards relatively 
 * small amounts of sugar (0 to 22.5), so it acts more as a tie-breaker between otherwise roughly equal choices.
 * 
 */
Codelets.Homing = class extends Codelets.CodeletBase
{
    static Name = 'homing';
    static Text = 'Homing';

    
    /**
     * @constructor
     * 
     * @param {Drafter} owner - The owner of the codelet.
     * @param {Number} urgency - The urgency of the codelet.
     * @param {Number} generation - The generation that the codelet belongs to.
     */
    constructor(owner, urgency, generation) 
    { 
        super(Codelets.Homing.Name, owner, urgency, generation);
    }


    /**
     * Runs the codelet.
     */
    run()
    {
        // Display codelet info
        const drafter = this.owner;
        this.titleText    = 'Homing codelet from generation ' + this.gen; 
        this.messageText1 = '';
        this.messageText2 = '';    
        drafter.app.reporter.trace(this.titleText);
        
        if (drafter.lastPoint != 'none') { 
            this.messageText1 = '(' + drafter.currentPoint + ') --> ';
            drafter.candidates.forEach(cand => {
                const score = this.candidateHoming(cand);
                drafter.addChoice(cand, Utils.Round3(score), 3);
                this.messageText1 += '(' + cand.pid + ')' + Utils.Round1(score) + '  ';
            });
        }
    }


    /**
     * Calculates the homing score.
     */
    candidateHoming(cand) 
    {
        let payoff = 20;
        // The following is commented-out because it is unreachable, due to the test in the above run() method:
        // const drafter = this.owner;
        // if (drafter.lastPoint == 'none') {
        //     const compass = cand.dir;
        //     const tip1Norms = Roles[drafter.theRoleName].norms.tips[0].orientation;
        //     const score = tip1Norms[Knowledge.TipFlipMap[compass]] || 0;
        //     payoff = (score >= 0) ? 10*score : -5;
        // }

        const turn = cand.ang;
        let multiplier;
        switch (Math.abs(turn)) {
            case 180:
                multiplier = 1.25;
                break;
            case 135:
                multiplier = 0.75;
                break;
            case 90:
                multiplier = 0.45;
                break;
            case 45:
                multiplier = 0.0;
                break;
            default:
                throw new Error('Unexpected turn value, in Codelets.Homing.candidateHoming: ' + turn);
        }
        
        return 0.9 * multiplier * payoff;
    };
};

