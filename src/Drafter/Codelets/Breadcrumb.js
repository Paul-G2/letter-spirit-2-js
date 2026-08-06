/**
 * @classdesc
 * This Drafter codelet adds points to the sugar scores of each candidate based on how well 
 * the candidate would make the current role-filler follow the role's curvature norm,
 * on a path from its initial point to its tentative finish point.
 * It awards between 4480 and 4800 sugar points.
 * 
 */
Codelets.Breadcrumb = class extends Codelets.CodeletBase
{
    static Name = 'breadcrumb';
    static Text = 'Breadcrumb';

    
    /**
     * @constructor
     * 
     * @param {Drafter} owner - The owner of the codelet.
     * @param {Number} urgency - The urgency of the codelet.
     * @param {Number} generation - The generation that the codelet belongs to.
     */
    constructor(owner, urgency, generation) 
    { 
        super(Codelets.Breadcrumb.Name, owner, urgency, generation);
    }


    /**
     * Runs the codelet.
     */
    run()
    {
        // Display codelet info
        const drafter     = this.owner;
        this.titleText    = 'Breadcrumb from generation ' + this.gen; 
        this.messageText1 = '';
        this.messageText2 = '';    
        drafter.app.reporter.trace(this.titleText);

        this.messageText1 = '(' + drafter.currentPoint + ') --> ';
        drafter.candidates.forEach(cand => {
            const score = this.headingScore(drafter.currentPoint, cand.pid);
            drafter.addChoice(cand, score, 1);
            this.messageText1 += '(' + cand.pid + ')' + Math.round(score) + '  ';
        });
    }


    /**
     * Calculates the heading score.
     */
    headingScore (p1, p2)
    {
        const drafter = this.owner;
        const normCurve = drafter.normCurve;
        let tipAngle;
        
        if (normCurve == 'straight') {
            tipAngle = Utils.PointsAngle(drafter.tip1, drafter.tip2);
        } else {
            const p1xy = Utils.PointIdToXYCoords(p1);
            const arcCenter = DraftUtils.ArcCenter(normCurve, drafter.tip1, drafter.tip2);
            if ( Utils.DistanceBetweenPoints(p1xy, arcCenter) < 0.00001 ) {
                tipAngle = 500;
            } else {
                tipAngle = Utils.PointsAngle(arcCenter, p1xy) + (normCurve.endsWith('_left') ? -90 : 90);
            }            
        }

        const pointsAngle = Utils.PointsAngle(p1, p2); 
        let angleDiff = pointsAngle - tipAngle;
        angleDiff -= ((angleDiff > 180) ? 360 : (angleDiff < -180) ? -360 : 0);
        const angleScore = Utils.Round3(600 - (2/9)*Math.abs(angleDiff));
        return 8*angleScore;
    }
};

