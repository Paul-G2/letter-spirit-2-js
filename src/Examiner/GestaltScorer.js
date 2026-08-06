/**
 * @classdesc
 * This class provides utilities for calculating gestalt letter scores for the Examiner.
 * 
 */
 class GestaltScorer
 { 
    /**
     * Calculates the gestalt scores for a given GridLetter.
     * @static
     *
     */
    static CalcGestalts(gridLetter)
    {
        const qids = gridLetter.quantaIds;

        // Feature 1. Blurred prototypes
        const qRaw = {};
        for (const [char, protVec] of Object.entries(Knowledge.BlurredPrototypes)) {
            qRaw[char] = gridLetter.distanceTo(protVec);
        }
        GestaltScorer.InvertAndScaleToTen(qRaw);


        // Feature 2. Number of quanta in each cell (Square prototypes)
        const sqFeatureVec = [];  
        Knowledge.QuantaBySquare.forEach((sq) => {sqFeatureVec.push( sq.reduce((sum, q) => sum + (qids.includes(q) ? 1 : 0), 0) ); });
        const sqRaw = {};
        for (const [char, protVec] of Object.entries(Knowledge.SquarePrototypes)) {
            sqRaw[char] = sqFeatureVec.reduce( (absdiff, f, i) => absdiff + Math.abs(f - protVec[i]), 0 );
        }
        GestaltScorer.InvertAndScaleToTen(sqRaw);


        // Feature 3. Number of "tips" in each cell
        const tipScores = Knowledge.TipGroups.map(tipGroup => (tipGroup.filter(tip => qids.includes(tip)).length == 1 ? 1 : 0) );  
        const tipsFeatureVec = Knowledge.TipGroupsBySquare.map(tgbs => tgbs.reduce((sum, idx) => sum + tipScores[idx], 0));
        const tipRaw = {};
        for (const [char, protVec] of Object.entries(Knowledge.TipPrototypes)) {
            tipRaw[char] = tipsFeatureVec.reduce( (absdiff, f, i) => absdiff + Math.abs(f - protVec[i]), 0 );
        }
        GestaltScorer.InvertAndScaleToTen(tipRaw);


        // Feature 4. Closure
        const letterHasClosure = GestaltScorer.HasClosure(gridLetter);
        const closureRaw = Object.fromEntries( 
            Object.entries(Knowledge.ClosurePrototypes).map(([char, protVal]) => [char, letterHasClosure ? 10*protVal : 10*(1 - protVal)]) );
             
            
        // Feature 5. Ascenders
        const letterHasAscender = [0,1,2,3,14,15,16,17,18,19,32,33,34,35,44,45,46,47].filter(n => qids.includes(n)).length > 0;
        const ascenderRaw = Object.fromEntries(
            Object.entries(Knowledge.AscendPrototypes).map(([char, protVal]) => [char, letterHasAscender ? 10*protVal : 10*(1 - protVal)]) );
        

        // Feature 6. Descenders
        const letterHasDescender = [10,11,12,13,26,27,28,29,30,31,40,41,42,43,52,53,54,55].filter(n => qids.includes(n)).length > 0;
        const descenderRaw = Object.fromEntries(
            Object.entries(Knowledge.DescendPrototypes).map(([char, protVal]) => [char, letterHasDescender ? 10*protVal : 10*(1 - protVal)]) );
   
        
        // Combine features 1 thru 6 into a single gestalt score for each character in the alphabet. (Score range will be -55 to 20.)
        const gestalts = {};
        for (const char of Object.keys(qRaw)) { 
            const val = (Params.GestaltPerk/16.0) * 
                (qRaw[char] + sqRaw[char] + tipRaw[char] + closureRaw[char] + ascenderRaw[char] + descenderRaw[char] - 44);
            gestalts[char] = Utils.Round3(val);
        }

        // Make sure that at least one gestalt is greater than zero
        const maxG = Math.max(...Object.values(gestalts));
        if (maxG <= 0) { 
            for (const [key, value] of Object.entries(gestalts)) { gestalts[key] = value - maxG + 1; }
        }

        return gestalts;
    }


    /**
     * Returns true if the given GridLetter has a closed loop.
     * @static
     * @private
     */
    static HasClosure(gridLetter)
    {
        const quanta = gridLetter.quanta;
        if (quanta.length < 3) { return false; }
        
        for (let q of quanta) {
            const targetPointId = q.startPointId;
            const visited = [q];
            const stack = [q.endPointId];
            while (stack.length > 0) {
                const currEndPtId = stack.pop();
                const candidates = quanta.filter((q) => !visited.includes(q) && (q.endPointId === currEndPtId || q.startPointId === currEndPtId));
                for (let cand of candidates) {
                    if ((cand.startPointId === targetPointId) || (cand.endPointId === targetPointId)) { return true; }
                    stack.push( (cand.startPointId === currEndPtId) ? cand.endPointId : cand.startPointId );
                    visited.push(cand);
                }
            }
        }
        return false;
    }


    /**
     * Scales a given list of scores to a range of 0 to 10.
     * Also inverts the values, so that more-similar features get higher scores.
     * @static
     * @private
     * 
     */
    static InvertAndScaleToTen(scores)
    {
        const min = Math.min(...Object.values(scores));
        const max = Math.max(...Object.values(scores));
        const scale = min - max;

        for (const [key, value] of Object.entries(scores)) {
            scores[key] = (scale < 0) ? 10*(value-max)/scale : 5;
        }
    }
};
