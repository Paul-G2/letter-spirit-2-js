/**
 * @classdesc
 * This Drafter codelet adds points to the continue-sugar score of each candidate based on whether 
 * or not the role-filler that is being drafted can possibly match that trait after the candidate
 * is added to it.
 */
Codelets.TraitProgressReward = class extends Codelets.CodeletBase
{
    static Name = 'trait-progress-reward';
    static Text = 'Trait Progress/Rewarder';

    
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
        super(Codelets.TraitProgressReward.Name, owner, urgency, generation);
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
        this.titleText    = 'TraitProgressReward codelet from generation ' + this.gen; 
        this.messageText1 = '';
        this.messageText2 = '';    
        drafter.app.reporter.trace(this.titleText);
        
        this.messageText1 = '(' + drafter.currentPoint + ') --> ';
        drafter.candidates.forEach(cand => {
            const score = this.totalScore(cand);
            drafter.addChoice(cand, score, 5);
            this.messageText1 += '(' + cand.pid + ')' + Math.round(score) + '  ';
        });
    }


    /**
     * 
     */
    totalScore(cand) 
    {
        const drafter = this.owner;
        const dim = this.draftDimension;
        const quanta = [cand.qid, ...drafter.ownStuff];
        const totalScore = 20*this.traitAheadScore(dim, quanta) + 
            15*this.traitLookingAheadScore(dim, quanta, drafter.tip1, drafter.tip2);
        return totalScore;
    }


    /**
     * 
     */    
    traitAheadScore(dim, quanta) 
    {
        const drafter = this.owner;
        const label = Utils.DimensionLabel(dim, quanta);
        const featureList = NormViols.Lists.find(ls => ls.includes(label));
        const nowAndFuture = featureList.slice(featureList.indexOf(label));
        if (!nowAndFuture.length) {
            return 0;
        } else {
            const labelVals = nowAndFuture.map(lbl => Utils.DimensionScore(lbl, drafter.roleTraits, this.punishVal));
            return Math.max(...labelVals);
        }
    }


    /**
     * 
     */
    traitLookingAheadScore(dim, quanta, tip1, tip2) 
    {
        const drafter = this.owner;
        const label = Codelets.TraitProgressReward.DimensionLabelAnticipating(dim, quanta, tip1, tip2);
        const featureList = NormViols.Lists.find(ls => ls.includes(label));
        const nowAndFuture = featureList?.slice(featureList.indexOf(label));
        if (!nowAndFuture.length) {
            return 0;
        } else {
            const labelVals = nowAndFuture.map(lbl => Utils.DimensionScore(lbl, drafter.roleTraits, this.punishVal));
            return Math.max(...labelVals);
        }
    }

    /**
     * 
     */
    static DimensionLabelAnticipating(dim, qids, tip1, tip2) 
    { 
        let q1, q2, pointXs, pointYs;

        switch (dim) 
        {
            case "Height": 
                pointYs = [tip1, tip2, ...qids.flatMap(qid => QuantaList[qid].pointIds)].map(pid => Utils.PointIdToXYCoords(pid).y);
                const height = Math.max(...pointYs) - Math.min(...pointYs);
                return NormViols.HeightsList[Math.min(height, 5)];

            case "Width": 
                pointXs = [tip1, tip2, ...qids.flatMap(qid => QuantaList[qid].pointIds)].map(pid => Utils.PointIdToXYCoords(pid).x);
                const width = Math.max(...pointXs) - Math.min(...pointXs);
                return NormViols.WidthsList[Math.min(width, 2)];

            case "Weight": 
                return NormViols.WeightText([1, ...qids]);

            case "Left_Edge": 
                q1 = (tip1 < 8) ? 14 : (tip1 < 15) ? 15 : 16;
                q2 = (tip2 < 8) ? 14 : (tip2 < 15) ? 15 : 16;
                return NormViols.LeftEdgeText([q1, q2, ...qids]);

            case "Right_Edge": 
                q1 = (tip1 > 14) ? 16 : (tip1 > 7) ? 15 : 14;
                q2 = (tip2 > 14) ? 16 : (tip2 > 7) ? 15 : 14;
                return NormViols.RightEdgeText([q1, q2, ...qids]);

            case "Floor": 
                q1 = Quantum.FromPointIds(tip1, (tip1 > 7) ? tip1-7 : tip1+7).id;
                q2 = Quantum.FromPointIds(tip2, (tip2 > 7) ? tip2-7 : tip2+7).id;
                return NormViols.FloorText([q1, q2, ...qids]);

            case "Roof": 
                q1 = Quantum.FromPointIds(tip1, (tip1 > 7) ? tip1-7 : tip1+7).id;
                q2 = Quantum.FromPointIds(tip2, (tip2 > 7) ? tip2-7 : tip2+7).id;
                return NormViols.RoofText([q1, q2, ...qids]);

            default: 
                return '';
        }
    }
};

