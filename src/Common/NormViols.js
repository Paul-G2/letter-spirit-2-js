/**
 * @classdesc
 * A norm violation ... 
 * 
 */
class NormViols 
{
    static NvTypes;
    static Lists;
    static HeightsList;
    static WidthsList;
    static WeightsList;
    static LeftEdgeList;
    static RightEdgeList;
    static RoofList;
    static FloorList;
    static LeftCurveList;
    static RightCurveList;
    static CurvesList;

    static 
    {
        // NB: Order matters in these lists
        NormViols.NvTypes        = ['Height', 'Width', 'Weight', 'Left_Edge', 'Right_Edge', 'Roof', 'Floor', 'Curve', 'Touch', 'Tips'];
        NormViols.HeightsList    = ['no_height', 'very_short', 'short', 'medium_ht', 'tall', 'very_tall'];
        NormViols.WidthsList     = ['skinny', 'half_wide', 'wide'];
        NormViols.WeightsList    = ['very_light', 'light', 'medium_wt', 'heavy', 'huge'];
        NormViols.LeftEdgeList   = ['l_edge_rt', 'l_edge_md', 'l_edge_lf'];
        NormViols.RightEdgeList  = ['r_edge_lf', 'r_edge_md', 'r_edge_rt'];
        NormViols.RoofList       = ['roof_bottom', 'roof_middown', 'roof_baseline', 'roof_midline', 'roof_x_height', 'roof_t_height', 'roof_top'];
        NormViols.FloorList      = ['floor_top', 'floor_t_height', 'floor_x_height', 'floor_midline', 'floor_baseline', 'floor_middown', 'floor_bottom'];
        NormViols.LeftCurveList  = ['straight', 'slight_left', 'square_left', 'strong_left', 'full_left', 'closure'];
        NormViols.RightCurveList = ['straight', 'slight_right', 'square_right', 'strong_right', 'full_right', 'closure'];
        NormViols.CurvesList     = ['full_left', 'strong_left', 'square_left', 'slight_left', 'straight', 'slight_right', 'square_right', 'strong_right', 'full_right', 'closure'];

        NormViols.Lists = [NormViols.HeightsList, NormViols.WidthsList, NormViols.WeightsList, 
            NormViols.LeftEdgeList, NormViols.RightEdgeList, NormViols.RoofList, NormViols.FloorList, 
            NormViols.CurvesList, NormViols.LeftCurveList, NormViols.RightCurveList];

        NormViols.FeatureDimensionName = new Map(
            [[NormViols.HeightsList, 'Height'], [NormViols.WidthsList, 'Width'], [NormViols.WeightsList, 'Weight'], 
            [NormViols.LeftEdgeList, 'Left_Edge'], [NormViols.RightEdgeList, 'Right_Edge'], [NormViols.RoofList, 'Roof'], [NormViols.FloorList, 'Floor'], 
            [NormViols.LeftCurveList, 'Left_Curve'], [NormViols.RightCurveList, 'Right_Curve'], [NormViols.CurvesList, 'Curve']]);

        NormViols.Lists.forEach( l => Object.freeze(l) );
        
    }


    /**
     * 
     * @param {*} filler 
     * @param {String} nvType 
     * @param {RandGen} randGen
     * @returns {String | String[]}
     */
    static RelativeNvType(filler, nvType, inputLetterQids, wholeName, randGen) 
    {
        const role = Roles[filler[0]];
        const quanta = filler[1];
        const roleNorms = role.norms;
        const topo = role.topology;
        
        switch (nvType) {
            case 'Height':
                return NormViols.ListNvCompare(
                    NormViols.HeightText(quanta),
                    NormViols.BestNorm(NormViols.HeightsList, roleNorms),
                    NormViols.HeightsList
                );
            case 'Width':
                return NormViols.ListNvCompare(
                    NormViols.WidthText(quanta),
                    NormViols.BestNorm(NormViols.WidthsList, roleNorms),
                    NormViols.WidthsList
                );
            case 'Weight':
                return NormViols.ListNvCompare(
                    NormViols.WeightText(quanta),
                    NormViols.BestNorm(NormViols.WeightsList, roleNorms),
                    NormViols.WeightsList
                );
            case 'Roof':
                return NormViols.ListNvCompare(
                    NormViols.RoofText(quanta),
                    NormViols.BestNorm(NormViols.RoofList, roleNorms),
                    NormViols.RoofList
                );
            case 'Floor':
                return NormViols.ListNvCompare(
                    NormViols.FloorText(quanta),
                    NormViols.BestNorm(NormViols.FloorList, roleNorms),
                    NormViols.FloorList
                );
            case 'Left_Edge':
                return NormViols.ListNvCompare(
                    NormViols.LeftEdgeText(quanta),
                    NormViols.BestNorm(NormViols.LeftEdgeList, roleNorms),
                    NormViols.LeftEdgeList
                );
            case 'Right_Edge':
                return NormViols.ListNvCompare(
                    NormViols.RightEdgeText(quanta),
                    NormViols.BestNorm(NormViols.RightEdgeList, roleNorms),
                    NormViols.RightEdgeList
                );
            case 'Curve':
                if (topo === 'dot' || topo === 'loop') {
                    return 'same';
                } else {
                    let crvNorms, correctLabel;
                    if (topo == 'bisegment') {
                        const L = quanta.length;
                        const qids1 = quanta.slice(0, Math.ceil(L/2));
                        const qids2 = quanta.slice(Math.floor(L/2), L);
                        const curvature1 = Utils.PartCurvature( Utils.LinearizedPointIds(qids1) );
                        const curvature2 = Utils.PartCurvature( Utils.LinearizedPointIds(qids2) );
                        if (Math.abs(curvature1) > Math.abs(curvature2)) {
                            crvNorms = roleNorms.curve1;
                            correctLabel = NormViols.CurvatureText(curvature1);
                        } else {
                            crvNorms = roleNorms.curve2;
                            correctLabel = NormViols.CurvatureText(curvature2);
                        }
                    } else {
                        crvNorms = roleNorms.curve;
                        if (Utils.GetTips(quanta).length < 2) {
                            correctLabel = 'closure';
                        } else {
                            const curv = Utils.PartCurvature( Utils.LinearizedPointIds(quanta) );
                            correctLabel = NormViols.CurvatureText(curv);  
                        }
                    }
                    return NormViols.ListNvCurvatureCompare(
                        correctLabel,
                        NormViols.BestNorm(null, crvNorms),
                        NormViols.LeftCurveList,
                        NormViols.RightCurveList
                    );
                }
            case 'Touch':
                return NormViols.TouchCompare(
                    NormViols.ContactText(quanta, inputLetterQids),
                    NormViols.BestNorm(null, roleNorms.contact[wholeName])
                );
            case 'Tips':
                if (topo == 'dot' || topo == 'loop') {
                    return 'none';
                } else {
                    const normTips = roleNorms.tips.map(t => NormViols.BestNorm(null, t.location));
                    const partTips = Utils.GetTips(quanta);
                    if ((partTips.length < 2) || (normTips.length < 2)) { return 'none';}

                    const pick = randGen.coinFlip();
                    const normTip  = pick ? normTips[0] : normTips[1];
                    const partTip  = pick ? partTips[0] : partTips[1];
                    const whichTip = pick ? 'tip1' : 'tip2';
                    return [randGen.choice(NormViols.TipTypes(role, whichTip)), NormViols.TipCompare(normTip, partTip, randGen)];
                }
            default:
                throw new Error(`NormViols.RelativeNvType: no such norm type ${nvType}`);
        }
    }


    /**
     * 
     * @param {*} filler 
     * @param {String} nvType 
     * @param {RandGen} randGen
     * @returns {String | String[]}
     */
    static ValToValNvType(filler, nvType, inputLetterQids, wholeName, randGen) 
    {
        const role = Roles[filler[0]];
        const quanta = filler[1];
        const roleNorms = role.norms;
        const topo = role.topology;
        
        switch (nvType) {
            case 'Height':
                return [NormViols.BestNorm(NormViols.HeightsList, roleNorms), NormViols.HeightText(quanta)];

            case 'Width':
                return [NormViols.BestNorm(NormViols.WidthsList, roleNorms), NormViols.WidthText(quanta)];

            case 'Weight':
                return [NormViols.BestNorm(NormViols.WeightsList, roleNorms), NormViols.WeightText(quanta)];

            case 'Roof':
                return [NormViols.BestNorm(NormViols.RoofList, roleNorms), NormViols.RoofText(quanta)];

            case 'Floor':
                return [NormViols.BestNorm(NormViols.FloorList, roleNorms), NormViols.FloorText(quanta)];

            case 'Left_Edge':
                return [NormViols.BestNorm(NormViols.LeftEdgeList, roleNorms), NormViols.LeftEdgeText(quanta)];

            case 'Right_Edge':
                return [NormViols.BestNorm(NormViols.RightEdgeList, roleNorms), NormViols.RightEdgeText(quanta)];

            case 'Curve':
                if (topo === 'dot' || topo === 'loop') {
                    return ['dont_care', 'dont_care'];
                } 
                else {
                    let crvNorms, correctLabel;
                    if (topo == 'bisegment') {
                        const L = quanta.length;
                        const qids1 = quanta.slice(0, Math.ceil(L/2));
                        const qids2 = quanta.slice(Math.floor(L/2), L);
                        const curvature1 = Utils.PartCurvature( Utils.LinearizedPointIds(qids1) );
                        const curvature2 = Utils.PartCurvature( Utils.LinearizedPointIds(qids2) );
                        if (Math.abs(curvature1) > Math.abs(curvature2)) {
                            crvNorms = roleNorms.curve1;
                            correctLabel = NormViols.CurvatureText(curvature1);
                        } else {
                            crvNorms = roleNorms.curve2;
                            correctLabel = NormViols.CurvatureText(curvature2);
                        }
                    } else {
                        crvNorms = roleNorms.curve;
                        if (Utils.GetTips(quanta).length < 2) {
                            correctLabel = 'closure';
                        } else {
                            const curv = Utils.PartCurvature( Utils.LinearizedPointIds(quanta) );
                            correctLabel = NormViols.CurvatureText(curv);  
                        }
                    }
                    return [correctLabel, NormViols.BestNorm(null, crvNorms)];
                }

            case 'Touch':
                return [ NormViols.ContactText(quanta, inputLetterQids),
                    NormViols.BestNorm(null, roleNorms.contact[wholeName]) ];

            case 'Tips':
                if (topo == 'dot' || topo == 'loop') {
                    return 'none';
                } else {
                    const normTips = roleNorms.tips.map(t => NormViols.BestNorm(null, t.location));
                    const partTips = Utils.GetTips(quanta);
                    if ((partTips.length < 2) || (normTips.length < 2)) { return 'none';}
                    
                    const pick = randGen.coinFlip();
                    const normTip  = pick ? normTips[0] : normTips[1];
                    const partTip  = pick ? partTips[0] : partTips[1];
                    const whichTip = pick ? 'tip1' : 'tip2';
                    return [randGen.choice(NormViols.TipTypes(role, whichTip)), [Number(normTip), Number(partTip)]];
                }

            default:
                throw new Error(`NormViols.ValToValNvType: no such norm type ${nvType}`);
        }
    }


    /**
     * Compares actual-vs-norm labels, based on their position in a reference list.
     * @static
     * @param {String} quantaLabel 
     * @param {String} bestNormLabel 
     * @param {String[]} refLabelList 
     */
    static ListNvCompare(quantaLabel, bestNormLabel, refLabelList)
    {
        const qIndex = refLabelList.indexOf(quantaLabel);
        const nIndex = refLabelList.indexOf(bestNormLabel);

        if (qIndex === -1 || nIndex === -1) { 
            return 'no_comparison'; 
        } else {
            return (qIndex > nIndex) ? 'more' : (qIndex < nIndex) ? 'less' : 'same';
        }
    }


    /**
     * Compares actual-vs-norm curvature labels, based on their position in reference lists.
     * @static
     * @param {String} curvLabel 
     * @param {String} bestNormLabel 
     * @param {String[]} refLabelListL 
     * @param {String[]} refLabelListR
     */
    static ListNvCurvatureCompare(curvLabel, bestNormLabel, refLabelListL, refLabelListR)
    {
        const qIndex = Math.max(refLabelListL.indexOf(curvLabel), refLabelListR.indexOf(curvLabel));
        const nIndex = Math.max(refLabelListL.indexOf(bestNormLabel), refLabelListR.indexOf(bestNormLabel));

        if (qIndex === -1 || nIndex === -1) { 
            return 'no_comparison'; 
        } else if (qIndex == nIndex) {
            return (curvLabel == bestNormLabel) ? 'same' : 'flipped';
        } else {
            return (qIndex > nIndex) ? 'more' : 'less';
        }
    }


    /**
     * Compares actual-vs-norm contact labels
     * @param {String} actualLabel 
     * @param {String} bestNormLabel 
     */
    static TouchCompare(actualLabel, bestNormLabel) 
    {
        if (actualLabel === bestNormLabel ) {
            return 'same';
        } else if (actualLabel === 'all_over') {
            return 'more';
        } else if (actualLabel === 'nc') {
            return 'less';
        } else {
            switch (bestNormLabel) {
                case 'nc':
                    return 'more';
                case 'all_over':
                    return 'less';
                case 'c_lf':
                case 'c_rt':
                    return 'diff';
                case 't1':
                    switch (actualLabel) {
                        case 'm': return 'into';
                        case '2ts': return 'plus_t';
                        case 't1m': return 'plus_m';
                        default: return 'diff';
                    }
                case 'm':
                    switch (actualLabel) {
                        case 't1': return 'out_of';
                        case 't2': return 'out_of';
                        case 't1m': return 'plus_t';
                        case 'mt2': return 'plus_t';
                        case '2ms': return 'plus_m';
                        default: return 'diff';
                    }
                case 't2':
                    switch (actualLabel) {
                        case 'm': return 'into';
                        case '2ts': return 'plus_t';
                        case 'mt2': return 'plus_m';
                        default: return 'diff';
                    }
                case '2ts':
                    switch (actualLabel) {
                        case 'm': return 'diff';
                        case 't1': return 'minus_t';
                        case 't2': return 'minus_t';
                        default: return 'into';
                    }
                case 't1m':
                    switch (actualLabel) {
                        case 't1': return 'minus_m';
                        case 'm': return 'minus_t';
                        case '2ts': return 'out_of';
                        case '2ms': return 'into';
                        default: return 'diff';
                    }
                case 'mt2':
                    switch (actualLabel) {
                        case 'm': return 'minus_t';
                        case 't2': return 'minus_m';
                        case '2ts': return 'out_of';
                        case '2ms': return 'into';
                        default: return 'diff';
                    }
                case '2ms':
                    switch (actualLabel) {
                        case 'm': return 'minus_m';
                        case 't1': return 'diff';
                        case 't2': return 'diff';
                        default: return 'out_of';
                    }
            }
        }
    }


    /**
     * Compares actual-vs-norm tip labels
     * @param {Number} - The id of the norm tip.
     * @param {Number} - The id of the part tip.
     * @param {RandGen} randGen - A random number generator. 
     */
    static TipCompare(normTip, partTip, randGen)
    {
        if ( randGen.coinFlip() ) 
        {
            const diff = Utils.DistanceBetweenPointIds(normTip, 11) - Utils.DistanceBetweenPointIds(partTip, 11);
            switch (Math.sign(diff)) {
                case -1: return 'outward';
                case 1: return 'inward';
                case 0: return 'no_move';
            }
        } 
        else {
            return Utils.PointIdsToCompass(normTip, partTip);
        }
    }


    /**
     * Returns the possibel tip types for a given role and tip position.
     * @param {Role} role 
     * @param {String} whichTip 
     */
    static  TipTypes(role, whichTip) 
    {
        let strokeType = role.stroke;
        let isTip1 = whichTip == 'tip1';
        switch (strokeType) {
            case 'down':
                return isTip1 ? ['tip', 'up_tip'] : ['tip', 'down_tip'];
            case 'downright':
                return isTip1 ? ['tip', 'up_tip', 'left_tip', 'up_left_tip'] : ['tip', 'down_tip', 'right_tip', 'down_right_tip'];
            case 'right':
                return isTip1 ? ['tip', 'left_tip'] : ['tip', 'right_tip'];
            case 'upright':
                return isTip1 ? ['tip', 'down_tip', 'left_tip', 'down_left_tip'] : ['tip', 'up_tip', 'right_tip', 'up_right_tip'];
        }
    }




    /**
     * Gets the name of the role-norm attribute with the highest score,
     * among a given list of attributes.
     * @static
     * 
     * @param {String[]} nvList - The list of attributes to consider.
     * @param {Object} roleNorms - The role-norms object.
     *
     */
    static BestNorm(nvList, roleNorms)
    {
        let viableAttrs = Object.keys(roleNorms);
        if (nvList) { viableAttrs = viableAttrs.filter(attr => nvList.includes(attr)); }
        const attrMax = viableAttrs.reduce((a, b) => roleNorms[a] > roleNorms[b] ? a : b, Number.NEGATIVE_INFINITY);
        
        return (attrMax === Number.NEGATIVE_INFINITY) ? '' : attrMax;
    }


    /**
     * Gets a text description of the height of a given set of quanta.
     * @static
     */
    static HeightText(qids) 
    {
        // Determine which rows of the letter grid are occupied by the input quanta
        let rowIds = [14, 15, 16, 32, 33, 44, 45];

        let height = 0;
        for (let r=0; r<6; r++) {
            if (rowIds.some(id => qids.includes(id))) { height += 1; }
            rowIds = rowIds.map((id, i) => {return id + ((i<3) ? 3 : 2);});
        }
       
        // Return a text description
        return  NormViols.HeightsList[Math.min(height, 5)];
    }


    /**
     * Gets a text description of the width of a given set of quanta.
     * @static
     */
    static WidthText(qids) 
    {
        // Determine which columns of the letter grid are occupied by the input quanta
        const col0_ids = [0, 2, 4, 6, 8, 10, 12, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50, 52, 54];
        const col1_ids = [1, 3, 5, 7, 9, 11, 13, 33, 35, 37, 39, 41, 43, 45, 47, 49, 51, 53, 55];

        let width = 0;
        if (col0_ids.some(id => qids.includes(id))) { width += 1; }
        if (col1_ids.some(id => qids.includes(id))) { width += 1; } 

        return NormViols.WidthsList[width];
    }


    /**
     * Gets a text description of the weight of a given set of quanta.
     * @static
     */
    static WeightText(qids) 
    {
        const wts = qids.map(qid => qid < 32 ? 1 : 1.4142);
        const wt = wts.reduce((a, b) => a + b, 0);

        const idx = (wt < 1) ? -1 : (wt <= 1.5) ? 0 : (wt <= 2.9) ? 1 : (wt <= 5) ? 2 : (wt <= 8) ? 3 : 4;   
        return (idx < 0) ? 'zero' : NormViols.WeightsList[idx];
    }


    /**
     * Gets a text description of the roof type of a given set of quanta.
     * @static
     */
    static RoofText(qids) 
    {
        const occupiedVerticalSectors = [0, 1, 2, 3, 4, 5, 6].filter(s => Knowledge.VertQuanta[s].some(v => qids.includes(v)));
        const roofLevel = (occupiedVerticalSectors.length === 0) ? 0 : Math.max(...occupiedVerticalSectors);
        return NormViols.RoofList[roofLevel];
    }


    /**
     * Gets a text description of the floor type of a given set of quanta.
     * @static
     */
    static FloorText(qids) 
    {
        const occupiedVerticalSectors = [0, 1, 2, 3, 4, 5, 6].filter(s => Knowledge.VertQuanta[s].some(v => qids.includes(v)));
        const floorLevel = (occupiedVerticalSectors.length === 0) ? 0 : Math.min(...occupiedVerticalSectors);
        return NormViols.FloorList[NormViols.FloorList.length - 1 - floorLevel];
    }


    /**
     * Gets a text description of the left-edge position of a given set of quanta.
     * @static
     */
    static LeftEdgeText(qids) 
    {
        const lf = Knowledge.LeftQuanta.some(id => qids.includes(id));
        const md = Knowledge.MiddleQuanta.some(id => qids.includes(id));
        //const rt = Knowledge.RightQuanta.some(id => qids.includes(id));
        return lf ? NormViols.LeftEdgeList[2] : md ? NormViols.LeftEdgeList[1] : NormViols.LeftEdgeList[0];
    }


    /**
     * Gets a text description of the right-edge position of a given set of quanta.
     * @static
     */
    static RightEdgeText(qids) 
    {
        //const lf = Knowledge.LeftQuanta.some(id => qids.includes(id));
        const md = Knowledge.MiddleQuanta.some(id => qids.includes(id));
        const rt = Knowledge.RightQuanta.some(id => qids.includes(id));
        return rt ? NormViols.RightEdgeList[2] : md ? NormViols.RightEdgeList[1] : NormViols.RightEdgeList[0];
    }


    /**
     * Gets a text description of a given curvature value.
     * @static
     */
    static CurvatureText(curvature) 
    {
        const result =
            ((-0.05 <= curvature) && (curvature <= 0.05)) ? 'straight' : 
            ((0.051 <= curvature) && (curvature <= 0.15)) ? 'slight_right' :
            ((0.151 <= curvature) && (curvature <= 0.251)) ? 'square_right' : 
            ((0.251 <= curvature) && (curvature <= 0.381)) ? 'strong_right' :
            ((curvature > 0.381)) ? 'full_right' : 
            ((-0.151 <= curvature) && (curvature <= -0.05)) ? 'slight_left' :
            ((-0.251 <= curvature) && (curvature <= -0.151)) ? 'square_left' : 
            ((-0.381 <= curvature) && (curvature <= -0.251)) ? 'strong_left' :
            ((curvature < -0.381)) ? 'full_left' : 
            'weird_curve';

        return result;
    }


    /**
     * Gets a text decsription of the contact type of a given set of quanta with the input letter.
     * @static
     */
    static ContactText(partQids, inputLetterQids)
    {
        const partPids = Utils.LinearizedPointIds(partQids); // partQids is linearized
        const otherQids = inputLetterQids.filter(qid => !partQids.includes(qid)); 
        const otherPids = [ ...new Set(otherQids.flatMap(qid => QuantaList[qid].pointIds)) ]; // otherQids is not necessarily linearized

        if (Utils.GetTips(partQids).length) {
            const tip1 = otherPids.includes(partPids[0]);
            const tip2 = otherPids.includes(partPids[partPids.length-1]);
            const middle = Utils.MidQuantaTouches(partQids, otherQids) + partPids.slice(1, partPids.length-1).filter(pid => otherPids.includes(pid)).length;

            if (tip1) {
                if (middle > 0) {
                    return (tip2) ? 'all_over' : 't1m';  // Both tips and middle, or just tip1 and middle
                } else {
                    return (tip2) ? '2ts' : 't1';        // Both tips and not middle, or just tip1
                }
            } else {
                if (tip2) {
                    return (middle > 0) ? 'mt2' : 't2';  // Tip2 and middle, or just tip2
                } else {
                    return (middle === 0) ? 'nc' : (middle === 1 ) ? 'm' : '2ms';  // Nowhere, middle once, or middle more than once
                }
            }
        } 
        else {
            const touchingPids = partPids.filter(pid => otherPids.includes(pid));
            if (touchingPids.length === 0) {
                return 'nc'; // no contact
            } else {
                return (Math.max(...touchingPids) > 14) ? 'c_rt' : 'c_lf';  // contact on the right, or the left
            }
        }
    }


    /**
     * Returns a string representation of a relative norm violation
     */
    static RelativeNvToString(nv)
    {
        if ( !Array.isArray(nv[2]) ) {
            return nv[0] + ':' + nv[1] + '-' + nv[2]; 
        } else {
            return nv[0] + ':' + nv[2][0] + '-' + nv[2][1];
        }
    }


    /**
     * Returns a string representation of a val-to-val norm violation
     */
    static ValToValNvToString(nv)
    {
        if ( !Array.isArray(nv[2][1]) ) {
            return nv[0] + ':' + nv[1] + '-' + nv[2][0] + ':' + nv[2][1]; 
        } else {
            return nv[0] + ':' + nv[2][0] + '-' + nv[2][1][0] + ':' + nv[2][1][1];
        }
    }


    /**
     * Returns the name of the feature dimension for a given norm name.
     * (eg, returns 'Height' for 'very_tall', 'Width' for 'skinny', etc.)
     */
    static GetFeatureDimensionName(normName)
    {
        const list = NormViols.Lists.find(list => list.includes(normName));
        return NormViols.FeatureDimensionName.get(list);
    }

};
