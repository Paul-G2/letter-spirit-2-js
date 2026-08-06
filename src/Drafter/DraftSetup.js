/**
 * @classdesc
 * This class provides utility methods for the Drafter.
 * 
 */
 class DraftSetup
 {
    /**
     * @constructor
     * @param {Drafter} drafter - A Drafter instance.
     */
    constructor(drafter) 
    {
        this.drafter    = drafter;
        this.app        = drafter.app;
        this.draftUtils = drafter.draftUtils;
        this.randGen    = drafter.randGen;
    }


    /**
     * Common initialization for all drafts.
     */
    generalDraftInit()
    {
        const drafter = this.drafter;
        const exmr = this.app.examiner;

        drafter.quitConsider = 0;
        drafter.quitDrawing = false;
        StyProps.SpTypes.forEach(spType => drafter.sampledStyProps[spType] = this.spSample(spType));

        drafter.roleTraits = this.roleTraits(drafter.theRoleName);
        
        const touchNorms = Roles[drafter.theRoleName].norms.contact[drafter.theWholeName];
        const maxTouchNorm = Object.keys(touchNorms).reduce((a, b) => touchNorms[a] > touchNorms[b] ? a : b);
        drafter.otherTouchNorm = Object.keys(touchNorms).filter(n => n != maxTouchNorm).reduce((a, b) => (touchNorms[a] > touchNorms[b]) ? a : b, '');
        const touchNormScores = DraftUtils.TouchNormScores(maxTouchNorm);
        const otherTouchScores = DraftUtils.TouchNormScores(drafter.otherTouchNorm);
        
        const topo = Roles[drafter.theRoleName].topology;
        drafter.draftMode = ((topo == 'segment') || (topo == 'bisegment')) ? 'normal' : (topo == 'loop') ? 'loop_begin' : 'dot';
        switch (drafter.draftMode) {
            case 'normal':
            case 'loop_begin':
                drafter.midTouch    = (1 === touchNormScores[1]);
                drafter.t2Touch     = (1 === touchNormScores[2]);
                drafter.altMidTouch = (1 === otherTouchScores[1]);
                drafter.altT2Touch  = (1 === otherTouchScores[2]);
                break;
            case 'dot':  // circle can require touch on either side
                drafter.midTouch = false;
                drafter.t2Touch = false;
                drafter.altMidTouch = false;
                drafter.altT2Touch = false;
                break;
        }        
    }


    /**
     * Initializes a segment draft.
     */
    segmentDraftInit() 
    {
        const drafter = this.drafter;
        const randGen = this.randGen;

        this.generalDraftInit();
        drafter.flipFlag = randGen.coinFlip();
        const tip1Choices = this.roleTips(1).map(([tip,score]) => [tip, Math.pow(Math.max(0,score), drafter.tipRandomness)]);
        drafter.tip1 = Number(randGen.weightedChoice(tip1Choices));
        drafter.tip2Choices = this.roleTips(2).map(([tip,score]) => [tip, Math.pow(Math.max(0,score), drafter.tipRandomness)]).filter(([tip,wt]) => tip != drafter.tip1);
        drafter.tip2 = Number(randGen.weightedChoice(drafter.tip2Choices));
        
        drafter.normCurve = (Roles[drafter.theRoleName].topology == 'bisegment') ? this.getNormCurve()[0] : this.getNormCurve();

        if (drafter.flipFlag) {
            const oldTip1 = drafter.tip1;
            const tip1Choices = this.roleTips(2).map(([tip,score]) => [tip, Math.pow(Math.max(0,score), drafter.tipRandomness)]);
            drafter.tip1 = Number(randGen.weightedChoice(tip1Choices));
            drafter.tip2Choices = this.roleTips(1).filter(([tip,wt]) => tip != drafter.tip1);
            drafter.tip2 = oldTip1;
            drafter.normCurve = Knowledge.TipFlipMap[drafter.normCurve];
        }

        drafter.lastPoint = 'none';
        drafter.currentPoint = drafter.tip1;
        drafter.ownStuff = [];
    }


    /**
     * Initializes a bisegment draft.
     */
    bisegmentDraftInit() 
    {
        const drafter = this.drafter;
        this.segmentDraftInit();

        drafter.actualTip2 = drafter.tip2; 
        drafter.tip2 = Roles[drafter.theRoleName].norms.midpoint; // Pretend midpoint is tip2 for now
        drafter.normCurve = drafter.flipFlag ? Knowledge.TipFlipMap[this.getNormCurve()[1]] : this.getNormCurve()[0];
    }


    /**
     * Initializes a loop or dot draft.
     */
    loopDotDraftInit() 
    {
        const drafter = this.drafter;
        const randGen = this.randGen;

        this.generalDraftInit();

        if (Roles[drafter.theRoleName].topology == 'dot') {
            drafter.normCurve = 'straight';
            drafter.midTouch = false;
            drafter.t2Touch = false;
            drafter.altMidTouch = false;
            drafter.altT2Touch = false;
            const tip1Choices = this.dotStartPoints().map(([tip,score]) => [tip, Math.pow(Math.max(0,score), drafter.tipRandomness)])
            drafter.tip1 = Number(randGen.weightedChoice(tip1Choices));
            drafter.tip2Choices = this.dotLastPoints().map(([tip,score]) => [tip, Math.pow(Math.max(0,score), drafter.tipRandomness)]).filter(([tip,wt]) => tip != drafter.tip1);
            drafter.tip2 = Number(randGen.weightedChoice(drafter.tip2Choices));
        } else {
            drafter.normCurve = 'strong_left';
            drafter.midTouch = false;
            drafter.t2Touch = true;
            drafter.altMidTouch = false;
            drafter.altT2Touch = false;
            const tip1Choices = this.loopStartPoints().map(([tip,score]) => [tip, Math.pow(Math.max(0,score), drafter.tipRandomness)])
            drafter.tip1 = Number(randGen.weightedChoice(tip1Choices));
            drafter.tip2Choices = this.loopLastPoints().map(([tip,score]) => [tip, Math.pow(Math.max(0,score), drafter.tipRandomness)]).filter(([tip,wt]) => tip != drafter.tip1);
            drafter.tip2 = Number(randGen.weightedChoice(drafter.tip2Choices));
        }

        drafter.lastPoint = 'none';
        drafter.currentPoint = drafter.tip1;
        drafter.ownStuff = [];
    }


    /**
     * Gets the list of candidate starting points for a dot draft, with scores.
     */
    dotStartPoints()
    {
        const normFirstPoints = Roles[this.drafter.theRoleName].norms.first_point;
        const candList = Object.entries( DraftSetup.ScoreListsMultiply(normFirstPoints, this.draftUtils.tipTouchScores(1)));

        const best = 0.01 + Math.max(...candList.map(([key, score]) => score));
        return candList.map(([key, score]) => [key, Math.round(score*400/best)]);
    }

    
    /**
     * Gets the list of candidate ending points for a dot draft, with scores.
     */
    dotLastPoints()
    {
        const normLastPoints = Roles[this.drafter.theRoleName].norms.last_point;
        const candList = Object.entries( DraftSetup.ScoreListsMultiply(normLastPoints, this.draftUtils.tipTouchScores(2)));

        const best = 0.01 + Math.max(...candList.map(([key, score]) => score));
        return candList.map(([key, score]) => [key, Math.round(score*400/best)]);
    }


    /**
     * Gets the list of candidate starting points for a loop draft, with scores.
     */
    loopStartPoints()
    {
        const normFirstPoints = this.biasPointsScores(Roles[this.drafter.theRoleName].norms.first_point);
        const candList = Object.entries( DraftSetup.ScoreListsMultiply(normFirstPoints, this.draftUtils.tipTouchScores(1)));

        const best = 0.01 + Math.max(...candList.map(([key, score]) => score));
        return candList.map(([key, score]) => [key, Math.round(score*400/best)]);
    }


    /**
     * Gets the list of candidate ending points for a loop draft, with scores.
     */
    loopLastPoints()
    {
        const normLastPoints = this.biasPointsScores(Roles[this.drafter.theRoleName].norms.last_point);
        const candList = Object.entries( DraftSetup.ScoreListsMultiply(normLastPoints, this.draftUtils.tipTouchScores(2)));

        const best = 0.01 + Math.max(...candList.map(([key, score]) => score));
        return candList.map(([key, score]) => [key, Math.round(score*400/best)]);
    }


    /**
     * Computes ... 
     */
    biasPointsScores(ptScores) 
    {
        const rulesScores = this.rulesScores();
        const motifsScores = this.motifsScores();
        const ruleAndMotifWeights = DraftSetup.ScoreListsMultiply(rulesScores, motifsScores); 
               
        let scoredBiasPts = Knowledge.AllPointIds.map(pt => {
            const qidOptions = Knowledge.QuantaTouchingPoint[pt];
            const scores = qidOptions.map(qid => ruleAndMotifWeights[qid]);
            const bestScore = Math.max(...scores);
            return [pt, bestScore];
        });

        const biasIndex = Object.fromEntries( scoredBiasPts.filter(([pt, score]) => score >= 0.01) );
        return DraftSetup.ScoreListsMultiply(biasIndex, ptScores);
    }    


    /**
     * Gets a sampling of Stylistic Properties of the given type from the ThematicFocus.
     */
    spSample(spType) 
    {
        const tf = this.app.thematicFocus;
        const tfLevelWts = ThematicFocus.LevelNames.map((levelName, i) => tf.styProps[levelName].isEmpty() ? 0 : Math.pow(2, i+1)); 
        const isMotifType = StyProps.IsMotifType(spType);
        const samples = [];   
        for (let i = 0; i < 200; i++) {
            const levelName = this.randGen.weightedChoice(ThematicFocus.LevelNames, tfLevelWts);
            const levelSps = tf.getStyProps(spType, levelName);
            if (levelSps.length > 0) {
                const spWeights = isMotifType ? levelSps.map(sp => sp.length) : levelSps.map(sp => 1);
                const sample = [levelName, this.randGen.weightedChoice(levelSps, spWeights)];
                if (!samples.some(s => Utils.ArraysEqual(s, sample))) { samples.push(sample); }
            }
        }
        return samples;
    }


    roleTraits(roleName)
    {
        const drafter = this.drafter;
        const roleNorms = Roles[roleName].norms;

        const exclude = ['curve', 'tips', 'ends', 'shape', 'neighborhood', 'contact', 'curve1', 'curve2', 'midpoint', 'first_point', 'last_point'];
        const normDict = Object.fromEntries(Object.entries(roleNorms).filter(([k,v]) => !exclude.includes(k) && (v >= 8)));
        Object.keys(normDict).forEach(key => normDict[key] = 5);

        const normViols = this.calcNormViolations(roleNorms);
        const nvNames = [...new Set(normViols.map(nv => nv[0]))];
        const nvDict = Object.fromEntries( nvNames.map(nvName => {
            const nvScores = normViols.filter(nv => nv[0] == nvName).map(nv => nv[1]); 
            return [nvName,  Utils.Round3(Math.max(...nvScores))];
        }));

        return {...normDict, ...nvDict};
    }


    /**
     * Given a set of role-norms, applies norm violations from the ThematicFocus to generate a set 
     * of transformed features, with a score for each one.
     */
    calcNormViolations(roleNorms)
    {
        // Get the highest-value norms in the roleNorms set. (eg 'short', 'wide', ... 'l_edge_rt', 'r_edge_rt', ... )
        const sizeTraits = [NormViols.HeightsList, NormViols.WidthsList, NormViols.WeightsList].map(dimList => 
            dimList.map(dim => [dim, Utils.DimensionScore(dim, roleNorms, -5000)]).reduce((a, b) => a[1] > b[1] ? a : b)[0]        
        );
        
        const borderTraits = [NormViols.LeftEdgeList, NormViols.RightEdgeList, NormViols.FloorList, NormViols.RoofList].map(dimList => 
            dimList.map(dim => [dim, Utils.DimensionScore(dim, roleNorms, -5000)]).reduce((a, b) => a[1] > b[1] ? a : b)[0]
        );

        // Now transform them via the relative and val_to_val norm violations that are in the sampled thematic focus.
        const relativeNvs = (normName) => {
            const result = [];
            const featureName = NormViols.GetFeatureDimensionName(normName); // 'Height' or 'Width' etc.
            this.drafter.sampledStyProps.relative_nvs.forEach(item => {
                const [tfLevelName, roleName, dim, rel] = [item[0], item[1][0], item[1][1], item[1][2]];
                if (dim == featureName) { 
                    const score = this.app.thematicFocus.draftLevelScore('relative_nvs', tfLevelName)
                    const featureList = NormViols.Lists.find(fl => fl.includes(normName));
                    const normOrder = featureList.indexOf(normName);
                    const modOrder = (rel == 'more') ? Math.min(normOrder+1, featureList.length-1) : Math.max(normOrder-1, 0);
                    result.push([featureList[modOrder], score]);
                }
            })
            return result;
        };

        const valToValNvs = (normName) => {
            const result = [];
            const featureName = NormViols.GetFeatureDimensionName(normName); // 'Height' or 'Width' etc.
            this.drafter.sampledStyProps.val_to_val_nvs.forEach(item => {
                const [tfLevelName, roleName, dim, valA, valB] = [item[0], item[1][0], item[1][1], item[1][2][0], item[1][2][1]];
                if (dim == featureName) { 
                    const score = this.app.thematicFocus.draftLevelScore('val_to_val_nvs', tfLevelName);
                    result.push([valB, score]); 
                }
            })
            return result;
        };

        let nvs = [...sizeTraits.map(relativeNvs), ...sizeTraits.map(valToValNvs), ...borderTraits.map(relativeNvs), ...borderTraits.map(valToValNvs)];
        nvs = nvs.flat(1).filter(nv => nv.length > 0);
        return nvs;
    }


    roleTips(tipId)
    {
        const drafter = this.drafter;
        const roleNorms = Roles[drafter.theRoleName].norms;

        const tipLs = DraftSetup.ScoreListsMultiply( roleNorms.tips[tipId-1].location, this.draftUtils.tipTouchScores(tipId)); 
        const endLs = this.endInfoBias(roleNorms.ends[tipId-1]);

        const rawScored = DraftSetup.ScoreListsMultiply(tipLs, endLs);
        const bestRawScore = Math.max(1e-10, ...Object.values(rawScored));
        return Object.entries(rawScored).map( ([tip, score]) => [Number(tip), Math.round(score*400/bestRawScore)] );
    }


    /**
     * Computes a score for each potential tip, based on how well it matches the
     * current rules and motifs. 
     */
    endInfoBias(endInfo) 
    {
        const rulesScores = this.rulesScores();
        const motifsScores = this.motifsScores();
        const ruleAndMotifWeights = DraftSetup.ScoreListsMultiply(rulesScores, motifsScores); 
               
        let qcScores = Object.entries(endInfo).map(([qc, score]) => {
            const comps = qc.split(',');
            const q = Number(comps[0]);
            const c = comps[1];
            return [[q,c], score*ruleAndMotifWeights[q]];
        });
        qcScores = qcScores.filter(([qc, score]) => (score >= 0.001) && !this.drafter.otherStuff.some(x => x == qc[0]));
        
        // Convert ends to tips
        const tipScores = qcScores.map(([[q,c], score]) => {
            const points = QuantaList[q].pointIds;
            return ((c=='n') || (c=='w') || (c=='nw') || (c=='sw')) ? [points[0], score] : [points[1], score];
        });

        // Keep only the max score for each tip
        const tipMaxScores = {};
        for (let [tip, score] of tipScores) {
            tipMaxScores[tip] = (tip in tipMaxScores) ? Math.max(tipMaxScores[tip], score) : score;
        }

        return tipMaxScores;
    }


    /**
     * Assigns a score to each quantum-id, based on whether it is a victim of an abstract rule.
     */
    rulesScores()
    {
        const allQids1 = Object.fromEntries(Knowledge.AllQuantaIds.map(q => [q, 1]));
        let dictList = this.drafter.sampledStyProps.abstract_rules.map(ruleInfo => {
            const victims = Rules.RuleVictims(ruleInfo[1]);
            const score = Utils.Round3(-0.01 * (1 + this.app.thematicFocus.draftLevelScore('abstract_rules', ruleInfo[0])));
            return DraftSetup.ScoreListsAdd(Object.fromEntries(victims.map(q => [q, score])), allQids1);
        });
        dictList = dictList.filter(dict => Object.keys(dict).length > 0);

        let product = {};
        if (dictList.length > 0) {
            product = dictList[0];
            for (let i = 1; i < dictList.length; i++) { product = DraftSetup.ScoreListsMultiply(product, dictList[i]); }
        }
        return product;
    }


    /**
     * Assigns a score to each quantum-id, based on how many literal motifs it appears in.
     */
    motifsScores() 
    {
        const allQids1 = Object.fromEntries(Knowledge.AllQuantaIds.map(q => [q, 1]));
        let dictList = this.drafter.sampledStyProps.literal_motifs.map(motifInfo => {
            const rewarded = motifInfo[1];
            const score = Utils.Round3(40*this.app.thematicFocus.draftLevelScore('literal_motifs', motifInfo[0], [0]));
            return DraftSetup.ScoreListsAdd(Object.fromEntries(rewarded.map(q => [q, score])), allQids1);
        });
        dictList = dictList.filter(dict => Object.keys(dict).length > 0);

        let sum = {};
        if (dictList.length > 0) {
            sum = dictList[0];
            for (let i = 1; i < dictList.length; i++) { sum = DraftSetup.ScoreListsAdd(sum, dictList[i]); }
        }
        return sum;
    }


    /**
     * Gets the curve that has the highest score in the current role-norm.
     */
    getNormCurve()
    {
        const drafter = this.drafter;
        if (Roles[drafter.theRoleName].topology == 'bisegment') {
            const curve1 = Roles[drafter.theRoleName].norms.curve1;
            const curve2 = Roles[drafter.theRoleName].norms.curve2;
            return [
                 Object.entries(curve1).reduce((a, b) => a[1] > b[1] ? a : b)[0],
                 Object.entries(curve2).reduce((a, b) => a[1] > b[1] ? a : b)[0]
            ];
        } else {
            const curve = Roles[drafter.theRoleName].norms.curve;
            return Object.entries(curve).reduce((a, b) => a[1] > b[1] ? a : b)[0];
        }
    }


    /**
     * Gets the points that are neighbors ofthe given point
     * (and that are not part of ownStuff and not the current point).
     */
    pointsFromPoint(pointId)
    {
        const drafter = this.drafter;
        const quantaTouchingPt = Knowledge.QuantaTouchingPoint[pointId];
        const theirPoints = quantaTouchingPt.flatMap(pid => QuantaList[pid].pointIds);  
        const ownStuffPoints = drafter.ownStuff.flatMap(pid => QuantaList[pid].pointIds);
        const result = theirPoints.filter(p => !ownStuffPoints.includes(p) && (p != drafter.currentPoint));
        return [...new Set(result)]; 
    }


    /**
     * Converts a list of neighbor points into a list of candidates.
     */
    candidatesFromPoints(pt, ptList)
    {
        const lastPoint = this.drafter.lastPoint;

        return ptList.map(p => { return {
            pid: p,
            qid: Quantum.FromPointIds(pt, p).id,
            dir: Utils.PointIdsToCompass(pt, p),
            ang: (lastPoint == 'none') ? 'none' : Utils.QuantaToAngles([Quantum.FromPointIds(lastPoint, pt).id, Quantum.FromPointIds(pt, p).id])[0]
        }});
    }

    
    /**
     * Multiplies (the common elements of) two dictionaries of the form {qid: score, ...}.
     */
    static ScoreListsMultiply(d1, d2)
    {
        const k1 = Object.keys(d1);
        const k2 = Object.keys(d2);
        if (k1.length == 0) { return d2; }
        if (k2.length == 0) { return d1; }

        const unionQids = [...new Set([...k1, ...k2])];
        return Object.fromEntries(unionQids.map(q => [q, Utils.Round3((d1[q] || 0) * (d2[q] || 0))]));
    }


    /**
     * Adds (the common elements of) two dictionaries of the form {qid: score, ...}.
     */
    static ScoreListsAdd(d1, d2)
    {
        const k1 = Object.keys(d1);
        const k2 = Object.keys(d2);
        if (k1.length == 0) { return {}; }

        const unionQids = [...new Set([...k1, ...k2])];
        return Object.fromEntries(unionQids.map(q => [q, (d1[q] || 0) + (d2[q] || 0)]));
    }

};