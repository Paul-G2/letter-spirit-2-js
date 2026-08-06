/**
 * @classdesc
 * This class provides several utility functions used throughout the code.
 * 
 */
class Utils
{
    static CompassAngles = {'n': 90, 'ne': 45, 'e': 0, 'se': 315, 's': 270, 'sw': 225, 'w': 180, 'nw': 135};

    /**
     * Gets the xy coordinates of a given point.
     * 
     * @param {Number} pointId - The point id. (Range is [1 - 21])
     */
    static PointIdToXYCoords(pointId, flipy = false)
    {
        // if ((pointId < 1) || (pointId > 21)) { throw new Error("Invalid pointId, in PointIdToXYCoords"); }
        return Knowledge.PointCoords[pointId];
    }


    /**
     * Returns the distance between two points.
     * 
     * @param {Number} pid1 - The id of the first point.
     * @param {Number} pid2 - The id of the second point.
     *
     */
    static DistanceBetweenPointIds(pid1, pid2)
    {
        const p1 = Utils.PointIdToXYCoords(pid1);
        const p2 = Utils.PointIdToXYCoords(pid2);
        return Math.sqrt((p2.x - p1.x)**2 + (p2.y - p1.y)**2);
    }


    /**
     * Returns the distance between two points.
     * 
     * @param {Object} p1 - The first point.
     * @param {Object} p2 - The second point.
     *
     */
    static DistanceBetweenPoints(p1, p2)
    {
        return Math.sqrt((p2.x - p1.x)**2 + (p2.y - p1.y)**2);
    }


    /**
     * Gets the compass direction defined by two points
     * 
     * @param {Number} pid1 - The id of the first point.
     * @param {Number} pid2 - The id of the second point.
     *
     */
    static PointIdsToCompass(pid1, pid2)
    {
        const p1 = Utils.PointIdToXYCoords(pid1);
        const p2 = Utils.PointIdToXYCoords(pid2);
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;

        if (dx == 0  &&  dy <  0) { return 'n';  }
        if (dx >  0  &&  dy <  0) { return 'ne'; }
        if (dx >  0  &&  dy == 0) { return 'e'; }
        if (dx >  0  &&  dy >  0) { return 'se'; }
        if (dx == 0  &&  dy >  0) { return 's';  }
        if (dx <  0  &&  dy >  0) { return 'sw'; }
        if (dx <  0  &&  dy == 0) { return 'w';  }
        if (dx <  0  &&  dy <  0) { return 'nw'; }
        return 'no_move';
    }


    /**
     * Maps a list  of quantum-ids to compass directions
     * 
     * @param {Number[]} qids - The list of quantum ids.
     */
    static QuantaToCompass(qids)
    {
        const pointIds = Utils.LinearizedPointIds(qids);
        
        const result = [];
        for (let i = 0; i < pointIds.length - 1; i++) { 
            result.push(Utils.PointIdsToCompass(pointIds[i], pointIds[i+1])); 
        }
        return result;
    }


    /**
     * Maps a list  of quantum-ids to the angles between them.
     * 
     * @param {Number[]} qids - The list of quantum ids.
     */
    static QuantaToAngles(qids)
    {
        const compassDirs = Utils.QuantaToCompass(qids);
        
        const result = [];
        for (let i = 0; i < compassDirs.length - 1; i++) { 
            const ang1 = Utils.CompassAngles[compassDirs[i]];
            const ang2 = Utils.CompassAngles[compassDirs[i+1]];
            const temp = 180 - (ang1 - ang2);
            const angleDiff = (temp > 180) ? temp - 360 : (temp < -180) ? temp + 360 : temp;
            result.push(angleDiff); 
        }

        return result;
    }


    /**
     * Returns the angle between two vectors (in degrees).
     */
    static PointsAngle(p1, p2) 
    {
        const p1Coords = (typeof p1 === 'number') ? Utils.PointIdToXYCoords(p1) : p1;
        const p2Coords = (typeof p2 === 'number') ? Utils.PointIdToXYCoords(p2) : p2;

        const dx = p2Coords.x - p1Coords.x;
        const dy = -(p2Coords.y - p1Coords.y);

        if (dx === 0) {
            return (dy >= 0) ? 90 : 270;
        } else {
            const raw = Utils.Round3((180/Math.PI) * Math.atan(dy/dx));
            const delta = (dx < 0) ? 180 : (dy < 0) ? 360 : 0;
            return (raw + delta);
        }
    }


    /**
     * Gets the tips (as point ids) of a given Part or quanta-list.
     * 
     * @param {Part|Array} arg - The part or list of quanta ids.
     * 
     */
    static GetTips(arg) 
    {
        const qids = (arg instanceof Part) ? arg.getQuantaIds() : arg;
        const pointIds = qids.flatMap(qid => QuantaList[qid].pointIds);
        return pointIds.filter((pid, i, a) => a.indexOf(pid) === a.lastIndexOf(pid));              
    }


    /**
     * Rounds a number to 1 decimal place.
     * 
     */
    static Round1(val)
    {
       return Math.round(val * 10) / 10;
    }


    /**
     * Rounds a number to 2 decimal places.
     * 
     */
    static Round2(val)
    {
       return Math.round(val * 100) / 100;
    }


    /**
     * Rounds a number to 3 decimal places.
     * 
     */
    static Round3(val)
    {
       return Math.round(val * 1000) / 1000;
    }


    /**
     * Returns the intersection of multiple lists.
     */
    static Intersection(...lists)
    {
        if (!lists.length) return [];

        let result = lists[0];
        for (let i = 1; i < lists.length; i++) {
            result = result.filter(x => lists[i].includes(x));
        }
        return result;
    }


    /**
     * Returns all non-empty sub-lists of a given list.
     * @param {Array} ls 
     */
    static GetAllSubLists(ls)
    {
        const result = [];
        const L = ls.length;
        for (let i = 0; i < L; i++) {
            for (let j = i + 1; j <= L; j++) {
                result.push(ls.slice(i, j));
            }
        }
        return result;
    }
    
    
    /**
     * From a *linearized* list of quanta, extracts the point ids 
     * encountered while walking through the list in order.
     * 
     */
    static LinearizedPointIds(qids) 
    {
        if (!qids || !qids.length) { return []; }

        const quanta = qids.map(qid => QuantaList[qid]);
        if (qids.length === 1) { return [...quanta[0].pointIds]; }

        const result = [];
        quanta.forEach((q, i) => { 
            if (i < quanta.length - 1) { 
                result.push(quanta[i+1].pointIds.includes(q.startPointId) ? q.endPointId : q.startPointId);
            } else { 
                result.push(...(quanta[i-1].pointIds.includes(q.startPointId) ? q.pointIds : q.pointIds.slice().reverse())); 
            }
        });
        return result;             
    }


    /**
     * From a list of quanta, extracts the point ids, not worrying about order. 
     * 
     */
    static PointIds(qids) 
    {
        if (!qids || !qids.length) { return []; }
        const pids = qids.flatMap(qid => QuantaList[qid].pointIds);
        return [...new Set(pids)];          
    }


    /**
     * Given a quanta-id list, check whether it contains a loop, and if so re-order it to 
     * make the lowest-number quantum the beginning and end of the list.
     */
    static CanonicalizeLoops(qids)  
    {
        const L = qids.length;
        if ((L > 1) && (qids[0] == qids[L-1])) {
            const trimmed = qids.slice(1);
            const indexOfMin = trimmed.indexOf(Math.min(...trimmed));
            return trimmed.slice(indexOfMin, L-1).concat(trimmed.slice(0, indexOfMin+1)); 
        } else {
            return qids;
        }
    }


    /**
     * Counts the number of mid-quanta crossings between two quanta lists.
     * 
     */
    static MidQuantaTouches(qids1, qids2) 
    {
        const crossings = qids1.map(qid1 => qids2.includes(Knowledge.MidQuantaTouchMap[qid1]) ? 1 :  0);
        return crossings.reduce((a, b) => a + b, 0);
    }

    
    /**
     * From a *linearized* list of point ids, computes a measure the path's curvature.
     * 
     */
    static PartCurvature(pointIds) 
    {
        if (!pointIds || pointIds.length < 3) { return 0; }

        const end1 = Utils.PointIdToXYCoords(pointIds[0]);
        const end2 = Utils.PointIdToXYCoords(pointIds[pointIds.length - 1]);
        const v12 = {x: end2.x - end1.x, y: end2.y - end1.y};
        const dsq = v12.x**2 + v12.y**2;

        let sum = 0;
        pointIds.slice(1,-1).forEach(pid => {
            const pt = Utils.PointIdToXYCoords(pid);
            sum += (end1.x - pt.x)*v12.y - (end1.y - pt.y)*v12.x;
        })
            
        const avg = sum/(dsq*pointIds.length);
        return Utils.Round3(avg);
    }


    /**
     * Reduces all role and whole activations, clears the bindings, and 
     * cues up some gestalt codelets.
     * 
     */
    static Dampen(exmr)
    {
        Object.keys(exmr.roleActivations).forEach( r => exmr.roleActivations[r] *= 0.05 );
        Object.keys(exmr.wholeActivations).forEach( w => exmr.wholeActivations[w] *= 0.10 );
        exmr.bindings = [];
        exmr.app.coderack.post(Params.GestaltBatchSize, 'gestalt', Params.VeryHighUrgency, 1);
    }


    /**
     * Given a set of quanta making up a Part, tries to do a forward traversal starting from a tip.
     * If the quanta-set has more than 2 tips, the algorithm fails and just returns the input.
     * 
     * @param {Array} qids - A list of quantum ids.
     * @param {RandGen} randGen - A random number generator.
     */
    static Linearize(qids, randGen) 
    {
        if (qids.length === 0) { return []; }

        const tips = Utils.GetTips(qids); // Tips are points that occur only once
        const startQid = (tips.length === 0) ? qids[0] : qids.find(qid => QuantaList[qid].pointIds.includes(tips[0]));

        return (tips.length > 2) ? [...qids] : 
            Utils._RobustNeighborSort([startQid], qids.filter(qid => qid !== startQid), randGen).flat();
    }


    /**
     * Given a set of quanta making up a Part, does a forward traversal starting from a tip. 
     * Repeats until all quanta have been assigned to some path, returning multiple paths if necessary.
     *
     */
    static RobustLinearize(qids, randGen) 
    {
        if (qids.length === 0) { return []; }

        const tips = Utils.GetTips(qids);
        const startQid = (tips.length === 0) ? qids[0] : qids.find(qid => QuantaList[qid].pointIds.includes(tips[0]));
            
        const firstSwing = Utils._RobustNeighborSort([startQid], qids.filter(qid => qid !== startQid), randGen);
        const remaining = qids.filter(qid => !firstSwing.flat().includes(qid));
        
        return firstSwing.concat( Utils.RobustLinearize(remaining, randGen) );
    }
    

    /**
     * Checks whether a set of quanta is ordered such that it can be traversed by
     * a single path from start to finish.
     * 
     * @param {Array} qids - A list of quantum ids.
     */
    static IsLinearized(qids) 
    {
        if (!qids.length === 0) { return true; }
        if (new Set(qids).size !== qids.length) { return false; } // duplication check
        for (let i = 0; i < qids.length - 1; i++) {
            const currPointIds = QuantaList[qids[i]].pointIds;
            const nextPointIds = QuantaList[qids[i+1]].pointIds;
            if (!nextPointIds.includes(currPointIds[0]) && !nextPointIds.includes(currPointIds[1])) { return false; }
        }
        return true;
    }


    /** 
     * Internal function used by the Linearize methods. 
     * Appends quanta from a second list to the tail of a first list, to build a linear path.
     * When no more can be appended, starts a new path.
     *
     */
    static _RobustNeighborSort(qids1, qids2, randGen) 
    {
        if (qids1.length === 0) { throw new Error("_RobustNeighborSort: qids1 is empty"); }
        if (qids2.length === 0) { return [qids1]; }

        const tail1 = qids1[qids1.length - 1];
        let bypassed = [];
        if (qids1.length > 1) {
            const preTail1 = qids1[qids1.length - 2];
            const commonPointId = QuantaList[tail1].pointIds.find(pid => QuantaList[preTail1].pointIds.includes(pid));
            bypassed = Knowledge.QuantaTouchingPoint[commonPointId];
        } 
        
        const nbrs = Knowledge.QuantaNeighbors[tail1];
        const options = qids2.filter(qid => nbrs.includes(qid) && !bypassed.includes(qid));        
        if (options.length > 0) {
            // Pick one of the connected quanta, append it to qids1, and recurse
            const head2 = randGen ? randGen.choice(options) : options[0];
            return Utils._RobustNeighborSort([...qids1, head2], qids2.filter(qid => qid !== head2), randGen);
        } 
        else {
            // No more quanta can be appended to qids1, so start a new path
            const islands = Utils.GlomIslands(qids2);
            return [qids1].concat( Utils.RobustLinearize(islands[0], randGen) || []);
        }
    }


    /**
     * Groups a list of quanta into connected islands.
     * 
     */
    static GlomIslands(qids) 
    {
        let islands = [];
        let unusedQids = [...qids];

        while (unusedQids.length > 0) {
            const island = [unusedQids.shift()];
            islands.push(island); 
            let nbrs = Knowledge.QuantaNeighbors[island[0]].filter(qid => unusedQids.includes(qid));
            while (nbrs.length > 0) {
                island.push(...nbrs);
                unusedQids = unusedQids.filter(qid => !nbrs.includes(qid));
                nbrs = nbrs.flatMap(nid => Knowledge.QuantaNeighbors[nid]).filter(nid => unusedQids.includes(nid));
                nbrs = [...new Set(nbrs)];
            }
        }
        return islands;
    }
    

    /**
     * Makes connected parts, given a list of joints.
     *  
     */
    static MakePartsFromJoints(joints)
    {
        let parts = [];
        let unusedJoints = [...joints];
        while (unusedJoints.length > 0) {
            let newJointList = [unusedJoints.shift()];
            for (let j = 0; j < newJointList.length; j++) {
                for (let i = 0; i < unusedJoints.length; i++) {
                    const joint = unusedJoints[i];
                    if ( newJointList.some(jt => (jt.qidA === joint.qidA) || (jt.qidB === joint.qidA) || (jt.qidA === joint.qidB) || (jt.qidB === joint.qidB)) ) {
                        newJointList.push(joint);
                        unusedJoints[i] = null;
                    }
                }
                unusedJoints = unusedJoints.filter(x => x !== null);
            }
            if (newJointList.length > 1) { // Remove former singlets
                const newJointQids = newJointList.flatMap(jt => [jt.qidA, jt.qidB]);
                newJointList = newJointList.filter(jt => !jt.isSinglet() ||
                    newJointQids.indexOf(jt.qidA) === newJointQids.lastIndexOf(jt.qidA) ); 
            }
            parts.push(new Part(newJointList));
        }      
        return parts;  
    }
    

    /**
     * Calculates how well a part fills a given role.
     * 
     */
    static CalcRoleScoreForPart(part, role, exmr)
    {
        const topos = part.labels.filter(f => f.hasData());     // contact, nbhd, tips, curve, curve1, curve2, shape, ends
        const features = part.labels.filter(f => !f.hasData()); // All the other labels
        const flippedTopos = topos.map(t => t.toFlipped());

        // Calculate feature score           
        let featureScore = 0;
        features.forEach(f => { featureScore += (role.norms[f.text] !== undefined) ? role.norms[f.text] : exmr.punish; });
        
        // Calculate topology scores
        let topoNormalScore = 0;
        topos.forEach(t => {topoNormalScore += Utils.TopologyScore(role, t, exmr.punish, exmr.punishHard); });
        
        let topoFlippedScore = 0;
        flippedTopos.forEach(t => {topoFlippedScore += Utils.TopologyScore(role, t, exmr.punish, exmr.punishHard); });  
    
        // Package the result
        featureScore = 25*(featureScore/Params.MaxFeatureScore);
        const topoScore = 25*Math.max(topoNormalScore, topoFlippedScore) / Params.MaxTopoScore[role.topology];
        const flip = (topoNormalScore > topoFlippedScore) ? 'normal' : 'flipped';

        const result = { role:role, score:Math.max(0, Utils.Round3(featureScore + topoScore + 2*Math.min(featureScore, topoScore))), flip:flip };
        return result;
    }


    /**
     * Calculates a topology score.
     * @private
     * 
     */
    static TopologyScore(role, label, punish, punishHard)
    {
        const labelData = label.data;
        const roleData = role.norms[label.text];
        let val;

        const getVal = function (dict, key, defaultVal=punishHard) { 
            return (dict[key] !== undefined) ? dict[key] : defaultVal; 
        }; 

        const curveScore = function (labelData, roleData) {
            if (!roleData || !Object.keys(roleData).length) { return 0; }
            if (roleData[labelData] !== undefined) { return roleData[labelData]; }
            if (labelData == 'weird_curve') { return 0; }
            const minIndex = Math.min(...Object.keys(roleData).map(k => Knowledge.CurvesList.indexOf(k)));
            const maxIndex = Math.max(...Object.keys(roleData).map(k => Knowledge.CurvesList.indexOf(k)));
            const labelIndex = Knowledge.CurvesList.indexOf(labelData);
            const dist = Math.min(Math.abs(labelIndex - minIndex), Math.abs(maxIndex - labelIndex));
            return dist * punish;
        };

        switch (label.text) {
            case 'tips':
                if (!roleData || !roleData.length) { return 0; }
                return getVal(roleData[0].location, labelData[0][0]) + getVal(roleData[0].orientation, labelData[0][1]) + 
                       getVal(roleData[1].location, labelData[1][0]) + getVal(roleData[1].orientation, labelData[1][1]);

            case 'ends':
                if (!roleData || !roleData.length) { return 0; }
                return getVal(roleData[0], labelData[0].join()) + getVal(roleData[1], labelData[1].join());
            
            case 'neighborhood':
                if (!roleData || !roleData.length) { return 0; }
                val = punishHard;
                for (let item of roleData) {
                    if (item[0].reduce((a,b,i) => a && ((b == 'dc') || (labelData[i] == b) ||(labelData[i] == 'eq'), true))) {
                        val = item[1];
                        break;
                    }
                }
                return val;
            
            case 'contact':
                val = punishHard;
                Object.values(roleData).forEach( dict => Object.entries(dict).forEach(([k, v]) => {
                    if (k == labelData) { val = Math.max(val, v); }
                }));
                return val;
            
            case 'shape':
                return getVal(roleData, labelData, punish);
            
            case 'curve':
                if (role.topology !== 'segment') { return 0; }
                return curveScore(labelData, roleData);

            case 'curve1':
            case 'curve2':
                if (role.topology !== 'bisegment') { return 0; }
                return curveScore(labelData, roleData);

            default:
                return 0;
        }
    }


    /*
     * Gets a feature's score from the norms. If the feature is not in the norms, 
     * then a negative score propotional to its distance from the norms is returned.
     */
    static DimensionScore(feature, norms, punishVal)
    {
        if (norms.hasOwnProperty(feature)) { 
            return norms[feature];
        } 
        else {
            const featureList = NormViols.Lists.find(fl => fl.includes(feature));
            const acceptable = Utils.Intersection(featureList, Object.keys(norms));
            const acceptableOrders = acceptable.map(item => featureList.indexOf(item));
            const maxOrder = Math.max(...acceptableOrders);
            const minOrder = Math.min(...acceptableOrders);
            const featureOrder = featureList.indexOf(feature);

            const dimensionDistance = Math.min(Math.abs(featureOrder - maxOrder), Math.abs(featureOrder - minOrder));
            return dimensionDistance * punishVal;           
        }
    }

    
    /**
     * Gets the label text for a given dimension and a given set of quanta.
     */
    static DimensionLabel(dim, quanta)
    {
        switch (dim) {
            case 'Height':
                return NormViols.HeightText(quanta);
            case 'Width':
                return NormViols.WidthText(quanta);
            case 'Weight':
                return NormViols.WeightText(quanta);
            case 'Roof':
                return NormViols.RoofText(quanta);
            case 'Floor':
                return NormViols.FloorText(quanta);
            case 'Left_Edge':
                return NormViols.LeftEdgeText(quanta);
            case 'Right_Edge':
                return NormViols.RightEdgeText(quanta);
            default:
                return null;
        }
    }


    /**
     * Sorts a list of parts by their position in the grid.
     *  
     */
    static SortPartsByGridPosition(parts)
    {
        const scoredParts = parts.map(part => { return { part: part, posn: Math.min(...part.getQuanta().map(q => 
            1000*q.startPoint.x + 100*q.startPoint.y + 10*q.endPoint.x + q.endPoint.y)) }; });
        
        return scoredParts.toSorted((a,b) => a.posn - b.posn).map(p => p.part);
    }


    /**
     * Returns all permutations of a given list.
     *  
     */
    static GetPermutations(ls)
    {
        let perms = [];

        for (let i = 0; i < ls.length; i++) {
            let rest = Utils.GetPermutations(ls.slice(0, i).concat(ls.slice(i + 1)));

            if(!rest.length) {
                perms.push([ls[i]])
            } else {
                for(let j = 0; j < rest.length; j = j + 1) {
                    perms.push([ls[i]].concat(rest[j]))
                }
            }
        }
        return perms;
    }


    /**
     * Checks if two (possibly nested) arrays are equal.
     * 
     */
    static ArraysEqual(arr1, arr2) 
    {
        if ((arr1 === undefined) || (arr2 === undefined) || (arr1 === null) || (arr2 === null)) { return false; }

        // Make sure both inputs are arrays
        if (!Array.isArray(arr1)) { arr1 = [arr1]; } 
        if (!Array.isArray(arr2)) { arr2 = [arr2]; } 

        // Maybe the arrays are the same
        if (arr1 === arr2) { return true; }

        // Check if both inputs have the same length
        if (arr1.length !== arr2.length) {
            return false;
        }

        // Iterate through each element
        for (let i = 0; i < arr1.length; i++) {
            const elem1 = arr1[i];
            const elem2 = arr2[i];

            // If elements are arrays or objects, use recursion
            if (Array.isArray(elem1) && Array.isArray(elem2)) {
                if (!Utils.ArraysEqual(elem1, elem2)) {
                    return false;
                }
            } 

            // Handle other objects (non-arrays) if necessary. 
            else if ((typeof elem1 === 'object') && (elem1 !== null) && (typeof elem2 === 'object') && (elem2 !== null)) {
                if (JSON.stringify(elem1) !== JSON.stringify(elem2)) {
                    return false;
                }
            }

            // Compare primitive values
            else if (elem1 !== elem2) {
                return false;
            }
        }

        return true;
    }


    /**
     * Applies a function to each entry of a dictionary, and returns a new dictionary.
     */
    static MapDictionary(dict, func) {
        return Object.fromEntries(Object.entries(dict).map(([k,v]) => func(k,v)));
    }


    /**
     * Returns the average of a list of numbers, rounded to 3 digits.
     */
    static AverageR3(vals)
    {
        return (vals.length == 0) ? 0 : Utils.Round3(vals.reduce((a, b) => a + b, 0)/vals.length);
    }


    /**
     * Applies a function to each element of a nested array.
     */
    static ApplyToNested = (arr, fn) => {
        return arr.map(item => Array.isArray(item) ? Utils.ApplyToNested(item, fn) : fn(item));
    }


    /**
     * Finds the longest matching sequence between two lists.
     * @param {Array} ls1
     * @param {Array} ls2
     */
    static FindLongestMatchingSequence(ls1, ls2) 
    {
        const m = ls1.length;
        const n = ls2.length;

        // Create a 2D array (DP table) initialized with zeros
        const dp = Array(m + 1).fill(0).map(() => Array(n + 1).fill(0));

        // Build the DP table
        let maxLength = 0;
        let endIndex1 = -1; // End index of the sequence in arr1
        for (let i = 1; i <= m; i++) {
            for (let j = 1; j <= n; j++) {
                if (ls1[i - 1] === ls2[j - 1]) {
                    dp[i][j] = dp[i - 1][j - 1] + 1;
                    if (dp[i][j] > maxLength) {
                        maxLength = dp[i][j];
                        endIndex1 = i - 1;
                    }
                } else {
                    dp[i][j] = 0; // The sequence is broken if elements don't match
                }
            }
        }

        // If no matching sequence is found
        if (maxLength === 0) {
            return [];
        }

        // Extract the longest matching sequence
        const startIndex1 = endIndex1 - maxLength + 1;
        const longestSequence = ls1.slice(startIndex1, endIndex1 + 1);

        return longestSequence;
    }


    /**
     * Returns the longest matching sequence between a list and a list of sublists.
     */
    static SublistsInclude(subLists, list) 
    {
        let longestMatch = [];
        for (const subList of subLists) {
            const match = Utils.FindLongestMatchingSequence(list, subList);
            if (match.length > longestMatch.length) { longestMatch = match; } 
        }
        return longestMatch;
    }

};
