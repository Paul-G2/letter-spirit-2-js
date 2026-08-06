/**
 * @classdesc
 * A motif is a particular shape that recurs in multiple GridLetters within a font.
 * 
 */
class Motif 
{
    static Types =   ['literal', 'translate', 'turn_180', 'turn_90', 'turn_45'];
    static Weights = [10, 5, 3, 2, 2];
    
    static CompassTurn90(x)       { return {'n':'e', 'ne':'se', 'e':'s', 'se':'sw', 's':'w', 'sw':'nw', 'w':'n', 'nw':'ne'}[x]; }
    static CompassTurn180(x)      { return {'n':'s', 's':'n', 'w':'e', 'e':'w', 'nw':'se', 'ne':'sw', 'se':'nw', 'sw':'ne'}[x]; }
    static CompassReflectHoriz(x) { return {'n':'n', 's':'s', 'w':'e', 'e':'w', 'nw':'ne', 'ne':'nw', 'se':'sw', 'sw':'se'}[x]; }
    static CompassReflectVert(x)  { return {'n':'s', 's':'n', 'w':'w', 'e':'e', 'nw':'sw', 'ne':'se', 'se':'ne', 'sw':'nw'}[x]; }
    static SublistsCache = {};

    static 
    {
        [Motif.Types, Motif.Weights].forEach(x => Object.freeze(x));
    }


    /**
     * Returns a sequence of quanta from ls2, by starting from ls1[0] and crawling randomly 
     * for a while, halting at tips, or when it has completed a loop, or after a
     * random number of steps. 
     */
    static LazyNeighborRandomRehash(ls1, ls2, randGen) 
    {
        // Maybe stop
        if ( (ls1.length > 6) || (ls2.length === 0) || ((ls1.length > 1) && (randGen.nSidedDie(12) === 6)) ) {
            return ls1;
        }

        // From ls2, get neighbors of ls1's last quantum that are not touching ls1's second-last quantum 
        const Intersection = Utils.Intersection;
        const tail1 = ls1[ls1.length - 1];
        let bypassedQids = [];
        if (ls1.length > 1) {
            const preTail1 = ls1[ls1.length - 2];
            const commonPointId = Intersection(QuantaList[tail1].pointIds, QuantaList[preTail1].pointIds)[0];
            bypassedQids = Knowledge.QuantaTouchingPoint[commonPointId];
        }        
        const options = Intersection(ls2, Knowledge.QuantaNeighbors[tail1]).filter(qid => (!bypassedQids.includes(qid)));
        if (options.length === 0) {
            return ls1;
        }

        // Check for a loop
        if (ls1.length > 2) {
            if (Intersection(QuantaList[tail1].pointIds, QuantaList[ls1[0]].pointIds, QuantaList[ls1[1]].pointIds).length > 0) {
                return ls1;
            }
        }
        
        const newHead = randGen.choice(options);
        return Motif.LazyNeighborRandomRehash([...ls1, newHead], ls2.filter(qid => qid !== newHead), randGen);
    }


    /**
     * Gets all sublists and transformed sublists of a given Motif list.
     * @param {String} spType - The Stylistic Property type
     * @param {String[]|Number[]} motifLs - A list of motif elements
     * @param {Boolean} useCache - Whether to use the cache
     */
    static MotifSublists(spType, motifLs, useCache=true) 
    {
        // Maybe it's in the cache
        let cacheKey;
        if (useCache) {
            cacheKey = spType + '_' + motifLs.join(',');
            if (Object.hasOwn(Motif.SublistsCache, cacheKey)) {
                return Motif.SublistsCache[cacheKey];
            }
        }

        let base, result;
        switch (spType) 
        {
            case 'literal_motifs':
                result = [
                    ...Utils.GetAllSubLists(motifLs),
                    ...Utils.GetAllSubLists(motifLs.slice().reverse())
                ];
                break;

            case 'translate_motifs':
                result = [
                    ...Utils.GetAllSubLists(motifLs),
                    ...Utils.GetAllSubLists(Utils.ApplyToNested(motifLs.slice().reverse(), Motif.CompassTurn180))
                ];
                break;

            case 'turn_180_motifs':
                base = [
                    ...Utils.GetAllSubLists(motifLs),
                    ...Utils.GetAllSubLists(Utils.ApplyToNested(motifLs.slice().reverse(), Motif.CompassTurn180))
                ];
                let reflectH = Utils.ApplyToNested(base, Motif.CompassReflectHoriz);
                let reflectV = Utils.ApplyToNested(base, Motif.CompassReflectVert);
                let reflectHV = Utils.ApplyToNested(reflectH, Motif.CompassReflectVert);
                result = [...base, ...reflectH, ...reflectV, ...reflectHV];
                break;

            case 'turn_90_motifs':
                base = [
                    ...Utils.GetAllSubLists(motifLs),
                    ...Utils.GetAllSubLists(Utils.ApplyToNested(motifLs.slice().reverse(), Motif.CompassTurn90))
                ];
                let turn90 = Utils.ApplyToNested(base, Motif.CompassTurn90);
                let turn180 = Utils.ApplyToNested(turn90, Motif.CompassTurn90);
                let turn270 = Utils.ApplyToNested(turn180, Motif.CompassTurn90);
                let allTurns = [...base, ...turn90, ...turn180, ...turn270];
                result = [
                    ...allTurns,
                    ...Utils.ApplyToNested(allTurns,Motif.CompassReflectHoriz)
                ];
                break;

            case 'turn_45_motifs':
                let cleanLs = motifLs.filter(x => (x !== 'no_angle'));
                result = [
                    ...Utils.GetAllSubLists(cleanLs),
                    ...Utils.GetAllSubLists(Utils.ApplyToNested(cleanLs.slice().reverse(), function (x) {return -x;}))
                ];
                break;

            default:
                throw new Error(`Motif.MotifSublists: Unknown motif type: ${spType}`);
        }

        // Uniquify
        const uniqueStrings = new Set( result.map(JSON.stringify) );
        result = Array.from(uniqueStrings, JSON.parse);
        if (useCache) { Motif.SublistsCache[cacheKey] = result; }

        return result;
    }


    /**
     * Clears the sublists cache.
     */
    static ClearSublistsCache() 
    { 
        Motif.SublistsCache = {}; 
    }
 };
