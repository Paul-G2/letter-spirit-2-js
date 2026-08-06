/**
 * @classdesc
 * This class implements the smart-parse algorithm for segmenting a set of quanta into parts.
 * 
 */
 class SmartParser
 {
    /**
     * @constructor
     * @param {Examiner} examiner - The Examiner instance that owns this object.
     */
    constructor(examiner) 
    { 
        this.examiner = examiner;
    }


    /**
     * Runs the Smart-Parse algorithm.
     * 
     */
    run()
    {
        const exmr = this.examiner;
        const coderack = exmr.app.coderack;
        const randGen = exmr.randGen;

        // Select a promising Whole category for the input letter
        const charOptions = Knowledge.LetterCategories.filter(char => exmr.inputLetterGestalts[char] > 0);
        const topOption = charOptions.reduce((prev, curr) => exmr.inputLetterGestalts[curr] > exmr.inputLetterGestalts[prev] ? curr : prev);
        const chosenChar = (charOptions.length == 0) ? 'o' : 
            (coderack.numCodeletsRun < 5) ? topOption :
            randGen.weightedChoice(charOptions, charOptions.map(char => exmr.inputLetterGestalts[char]));

        // Pick a corresponding gestalt function
        const gestaltFuncs = randGen.choice(SmartParser.GestaltFuncs[chosenChar]);

        // Evaluate the gestalt function
        const allQids = exmr.inputGridLetter.quantaIds;
        const firstPass = SmartParser.EvalFunc(gestaltFuncs[0], allQids, allQids, randGen).map(qidSet => Utils.Linearize(qidSet, randGen));
    
        let gestaltResult;
        if ((gestaltFuncs.length === 1) || allQids.every(qid => firstPass[0].includes(qid))) {
            gestaltResult = firstPass;
        } 
        else {
            const restFlattened = firstPass.slice(1).flat();
            gestaltResult = [firstPass[0]].concat(SmartParser.EvalFunc(gestaltFuncs[1], restFlattened, allQids, randGen));
        }

        // Update the workspace
        exmr.parts = gestaltResult.map( qidSet => new Part(SmartParser.QuantaJoints(qidSet), [new Label('**whine', 10)]) );
        Utils.Dampen(exmr); // Clears bindings, posts a gestalt codelet
        coderack.post(2*exmr.parts.length, 'looker', Params.VeryHighUrgency, 1);
    }


    /**
     * Evaluates a gestalt function.
     * @private
     * 
     */
    static EvalFunc(funcParams, qids, allQids, randGen) 
    {
        const islands =  Utils.GlomIslands(qids);
    
        switch (funcParams[0]) {
            case 'glomIslands':
                return islands;
            
            case 'cleaveOut': {
                const startPoint = SmartParser.GetPoint(funcParams[1], 'no-except', qids, allQids, randGen);
                const cleaveland = islands.find(island => island.map(qid => QuantaList[qid].pointIds).flat().includes(startPoint));
                if (!cleaveland) { return islands; }
                const rest = islands.filter(island => island !== cleaveland);
                const finishPoint = SmartParser.GetPoint(funcParams[2], startPoint, cleaveland, allQids, randGen);
                return rest.concat(SmartParser.CleaveOut(startPoint, finishPoint, cleaveland, randGen));
            }
            default:
                throw new Error(`Unknown parse command: ${funcParams[0]}`);
        }
    }


    /**
     * Finds a point id given its specification.
     * @private
     * 
     */    
    static GetPoint(pointSpec, except, qids, allQids, randGen) 
    {
        const targetPid = pointSpec[1];
        const Dist = Utils.DistanceBetweenPointIds;

        switch (pointSpec[0]) 
        {
            case 'ptN': {
                // Nearest point
                const pids = [ ...new Set( qids.flatMap(qid => QuantaList[qid].pointIds) ) ];
                let candidates = pids.filter(pid => pid != except);
                return candidates.reduce((prev, curr) => Dist(curr, targetPid) < Dist(prev, targetPid) ? curr : prev);
            }
            case 'tpN': {
                // Nearest tip
                let tips = Utils.GetTips(qids).filter(pid => pid != except);
                if (tips.length === 0) { 
                    const pids = [ ...new Set( qids.flatMap(qid => QuantaList[qid].pointIds) ) ];
                    tips = pids.filter(pid => pid != except); 
                }
                return tips.reduce((prev, curr) => Dist(curr, targetPid) < Dist(prev, targetPid) ? curr : prev);
            }
            case 'trp': {
                // Triple point
                const pids = allQids.flatMap(qid => QuantaList[qid].pointIds);
                const upids = [...new Set(pids)];
                let candidates = upids.filter(upid => (pids.filter(p => p == upid).length == 3) );
                if (candidates.length > 0) {
                    return randGen.choice(candidates);
                }
                else {
                    // Fall back to the point nearest to point 4. (That's where action tends to occur for 'e' and 'k'.)
                    candidates = [ ...new Set( qids.flatMap(qid => QuantaList[qid].pointIds) )];
                    return candidates.reduce((prev, curr) => Dist(curr, 4) < Dist(prev, 4) ? curr : prev);
                }
            }
            case 'quad': {
                // Quadruple point
                const pids = allQids.flatMap(qid => QuantaList[qid].pointIds);
                const upids = [...new Set(pids)];
                const candidates = upids.filter(upid => (pids.filter(p => p == upid).length == 4) );
                if (candidates.length > 0) {
                    return randGen.choice(candidates);
                }
                else {
                    // Fall back to triple point
                    return SmartParser.GetPoint(['trp'], except, qids, allQids, randGen);
                }
            }
            default:
                return undefined;
        }        
    }


    /**
     * From a given set of quanta, extracts a part that touches the specified start and finish points,
     * then separates any leftover quanta into connected sets.
     * @private
     * 
     */
    static CleaveOut(startPoint, finishPoint, qids, randGen)
    {
        const onePart = SmartParser.ShortestPath(startPoint, finishPoint, qids);
        const rest = qids.filter(qid => !onePart.includes(qid));
        return [onePart].concat( (rest.length === 0) ? [] : Utils.RobustLinearize(rest, randGen) );
    }


    /**
     * Finds the shortest path between two points, that uses only the given set of quanta.
     * @private
     */
    static ShortestPath(startPoint, endPoint, qids)
    {
        const quanta = qids.map(qid => QuantaList[qid]);
        const scores = [];
        for (let i = 0; i <= 21; i++) { scores.push({val:Number.POSITIVE_INFINITY, srcPoint:-1, srcQid:-1}); }
        scores[startPoint].val = 0;
        
        let stack = [startPoint];
        while (stack.length > 0) {
            let pointId = stack.shift();
            for (let q of quanta.filter(q => q.pointIds.includes(pointId))) {
                const farPointId = (q.startPointId === pointId) ? q.endPointId : q.startPointId;
                const newScoreVal = scores[pointId].val + q.length;
                if (newScoreVal < scores[farPointId].val) {
                    scores[farPointId] = {val:newScoreVal, srcPoint:pointId, srcQid:q.id};
                    stack.push(farPointId);
                }                           
            }
        }
        
        if (scores[endPoint].srcPoint === -1) {
            throw new Error("No path from " + startPoint + " to " + endPoint + ", in ShortestPath()");
        }

        const path = [];
        let pointId = endPoint;
        while (pointId != startPoint) {
            path.push(scores[pointId].srcQid);
            pointId = scores[pointId].srcPoint;
        }
        path.reverse();
        return path;
    }


    /**
     * Gets a list of all implied joints in a given set of quanta.
     * @private
     * 
     */
    static QuantaJoints(qids)
    {
        const joints = [];
        const N = qids.length;
        for (let i = 0; i < N; i++) {
            const qidA = qids[i];
            const nbrs = Knowledge.QuantaNeighbors[qidA];
            for (let j = i + 1; j < N; j++) {
                const qidB = qids[j];
                if (nbrs.includes(qidB)) { joints.push(new Joint(qidA, qidB)); }
            }
        }

        // Add any singlets
        const singlets = qids.filter( qid => !joints.some(j => j.hasQid(qid)) );
        joints.push(...singlets.map(qid => new Joint(qid)));

        return joints;
    }


    /**
     * Defines the functions used to segment a set of quanta into 
     * parts with good gestalt scores.
     * 
     * @private
     */
    static GestaltFuncs = 
    {
        // In the following, tpN means "tip nearest",  ptN means "point nearest",  
        // trp means "triple point",  quad means "quadruple point"

        a: [[['cleaveOut', ['tpN', 3], ['ptN', 19]]]],
        b: [[['cleaveOut', ['tpN', 1], ['ptN', 5]]]],
        c: [[['glomIslands']]],
        d: [[['cleaveOut', ['tpN', 15], ['ptN', 19]]]],
        e: [
            [['cleaveOut', ['ptN', 18], ['ptN', 4]]],
            [['cleaveOut', ['trp'], ['ptN', 18]]]
        ],
        f: [[['cleaveOut', ['tpN', 15], ['tpN', 12]]]],
        g: [[['cleaveOut', ['tpN', 7], ['ptN', 17]]]],
        h: [[['cleaveOut', ['tpN', 1], ['tpN', 5]]]],
        i: [[['glomIslands']]],
        j: [[['glomIslands']]],
        k: [
             [['cleaveOut', ['tpN', 1], ['ptN', 5]],   ['cleaveOut', ['tpN', 17], ['ptN', 5]]],
             [['cleaveOut', ['quad'],   ['tpN', 17]],  ['cleaveOut', ['quad'],    ['tpN', 19]]],
             [['cleaveOut', ['tpN', 1], ['ptN', 5]],   ['cleaveOut', ['tpN', 17], ['ptN', 3]]]
        ],
        l: [[['glomIslands']]],
        m: [
             [['cleaveOut', ['tpN', 5],  ['ptN', 3]],   ['cleaveOut', ['tpN', 5], ['ptN', 3]]],
             [['cleaveOut', ['ptN', 11], ['ptN', 10]]],
             [['cleaveOut', ['tpN', 5],  ['ptN', 3]],   ['cleaveOut', ['tpN', 11], ['ptN', 3]]],
             [['cleaveOut', ['tpN', 5],  ['ptN', 3]],   ['cleaveOut', ['tpN', 3], ['ptN', 12]]]
        ],
        n: [[['cleaveOut', ['tpN', 5], ['ptN', 3]]]],
        o: [[['glomIslands']]],
        p: [[['cleaveOut', ['tpN', 7], ['ptN', 3]]]],
        q: [[['cleaveOut', ['tpN', 21], ['ptN', 17]]]],
        r: [[['cleaveOut', ['tpN', 5], ['ptN', 3]]]],
        s: [[['cleaveOut', ['tpN', 17], ['ptN', 11]]]],
        t: [[['cleaveOut', ['tpN', 9], ['tpN', 19]]]],
        u: [[['cleaveOut', ['tpN', 17], ['ptN', 19]]]],
        v: [[['cleaveOut', ['tpN', 17], ['ptN', 13]]]],
        w: [
             [['cleaveOut', ['tpN', 17], ['ptN', 19]], ['cleaveOut', ['tpN', 17], ['ptN', 19]]],
             [['cleaveOut', ['tpN', 17], ['ptN', 19]], ['cleaveOut', ['tpN', 11], ['ptN', 19]]],
             [['cleaveOut', ['tpN', 17], ['ptN', 19]], ['cleaveOut', ['tpN', 19], ['ptN', 10]]]
        ],
        x: [[['cleaveOut', ['tpN', 17], ['tpN', 5]]]],
        y: [[['cleaveOut', ['tpN', 17], ['tpN', 7]]]],
        z: [
             [['cleaveOut', ['tpN', 3], ['ptN', 17]],  ['cleaveOut', ['tpN', 19], ['ptN', 5]]],
             [['cleaveOut', ['tpN', 19], ['ptN', 5]],  ['cleaveOut', ['tpN', 5], ['ptN', 17]]]
        ]
    };


};