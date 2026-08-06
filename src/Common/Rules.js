/**
 * @classdesc
 * This class contains all the code for the 30 abstract rules:
 * 15 zones, 6 orientations, 6 angles, 3 lengths.
 * 
 */
class Rules
{
    static RuleTypes;
    static RuleStrings;
    static Zones;

    static 
    {
        Rules.RuleTypes = [
            'ban_topedge', 'ban_topbox', 'ban_ascender', 'ban_descender', 'ban_bottombox',
            'ban_bottomedge', 'ban_rightedge', 'ban_leftedge',
            'ban_vertedges', 'ban_vertboxes', 'ban_topleft', 'ban_topright',
            'ban_bottomleft', 'ban_bottomright', 'ban_corners',
            'ban_horiz_quanta', 'ban_vert_quanta', 'ban_foreslash_quanta',
            'ban_backslash_quanta', 'ban_rectilinear_quanta',
            'ban_diagonal_quanta', 'ban_45_angle', 'ban_90_angle',
            'ban_135_angle', 'ban_180_angle', 'ban_45_135_angle',
            'ban_90_180_angle', 'at_least_2', 'at_most_2', 'at_most_3'
        ];

        const ruleStrings = [
            'ban/top/edge', 'ban/top/box', 'ban/ascend', 'ban/descend', 'ban/bottom/box',
            'ban/bottom/edge', 'ban/right/edge', 'ban/left/edge',
            'ban/vert/edges', 'ban/vert/boxes', 'ban/top/left', 'ban/top/right',
            'ban/bottom/left', 'ban/bottom/right', 'ban/corners',
            'ban/horiz/quanta', 'ban/vert/quanta', 'ban/foreslash/quanta',
            'ban/backslash/quanta', 'ban/rect/quanta',
            'ban/diag/quanta', 'ban/45/angle', 'ban/90/angle',
            'ban/135/angle', 'ban/180/angle', 'ban/45,135/angle',
            'ban/90,180/angle', 'at/least/2', 'at/most/2', 'at/most/3'
        ];
        Rules.RuleStrings = Object.fromEntries(Rules.RuleTypes.map((rType, i) => [rType, ruleStrings[i].split('/')]));

        Object.freeze(Rules.RuleTypes);
        Object.freeze(Rules.RuleSTrings);
    }


    /**
     * Indicates whether a given rule is satisfied by a given set of quanta.
     */
    static IsSatisfied(rType, qids, otherQids=undefined)
    {
        switch (rType) 
        {
            case 'ban_topedge':
                return !qids.some(qid => Knowledge.TopedgeZone.includes(qid));

            case 'ban_topbox':
                return !qids.some(qid => Knowledge.TopboxZone.includes(qid));

            case 'ban_ascender':
                return !qids.some(qid => Knowledge.AscenderZone.includes(qid));

            case 'ban_descender':
                return !qids.some(qid => Knowledge.DescenderZone.includes(qid));

            case 'ban_bottombox':
                return !qids.some(qid => Knowledge.BottomboxZone.includes(qid));

            case 'ban_bottomedge':
                return !qids.some(qid => Knowledge.BottomedgeZone.includes(qid));

            case 'ban_rightedge':
                return !qids.some(qid => Knowledge.RightedgeZone.includes(qid));

            case 'ban_leftedge':
                return !qids.some(qid => Knowledge.LeftedgeZone.includes(qid));

            case 'ban_vertedges':
                return !qids.some(qid => Knowledge.VertedgesZone.includes(qid));

            case 'ban_vertboxes':
                return !qids.some(qid => Knowledge.VertboxesZone.includes(qid));

            case 'ban_topleft':
                return !qids.some(qid => Knowledge.TopleftZone.includes(qid));

            case 'ban_topright':
                return !qids.some(qid => Knowledge.ToprightZone.includes(qid));

            case 'ban_bottomleft':
                return !qids.some(qid => Knowledge.BottomleftZone.includes(qid));

            case 'ban_bottomright':
                return !qids.some(qid => Knowledge.BottomrightZone.includes(qid));

            case 'ban_corners':
                return !qids.some(qid => Knowledge.CornersZone.includes(qid));

            case 'ban_horiz_quanta':
                return !qids.some(qid => Knowledge.Horizontals.includes(qid));

            case 'ban_vert_quanta':
                return !qids.some(qid => Knowledge.Verticals.includes(qid));

            case 'ban_foreslash_quanta':
                return !qids.some(qid => Knowledge.Foreslashes.includes(qid));

            case 'ban_backslash_quanta':
                return !qids.some(qid => Knowledge.Backslashes.includes(qid));

            case 'ban_rectilinear_quanta':
                return !qids.some(qid => Knowledge.Rectilinears.includes(qid));

            case 'ban_diagonal_quanta':
                return !qids.some(qid => Knowledge.Diagonals.includes(qid));

            case 'ban_45_angle':
                return !Knowledge.Degrees45.some(pair => qids.includes(pair[0]) && qids.includes(pair[1]));

            case 'ban_90_angle':
                return !Knowledge.Degrees90.some(pair => qids.includes(pair[0]) && qids.includes(pair[1]));

            case 'ban_135_angle':
                return !Knowledge.Degrees135.some(pair => qids.includes(pair[0]) && qids.includes(pair[1]));

            case 'ban_180_angle':
                return !Knowledge.Degrees180.some(pair => qids.includes(pair[0]) && qids.includes(pair[1]));

            case 'ban_45_135_angle':
                return (!Knowledge.Degrees45.some(pair => qids.includes(pair[0]) && qids.includes(pair[1])) &&
                        !Knowledge.Degrees135.some(pair => qids.includes(pair[0]) && qids.includes(pair[1])));

            case 'ban_90_180_angle':
                return (!Knowledge.Degrees90.some(pair => qids.includes(pair[0]) && qids.includes(pair[1])) &&
                        !Knowledge.Degrees180.some(pair => qids.includes(pair[0]) && qids.includes(pair[1])));

            case 'at_least_2':
                return !Rules.AtLeastTwoTest(qids);

            case 'draft_at_least_2':
                return !Rules.DraftAtLeastTwoTest(qids, otherQids);

            case 'at_most_2':
                return !Knowledge.AtMostTwo.some(triplet => triplet.every(x => qids.includes(x)));

            case 'at_most_3':
                return !Knowledge.AtMostThree.some(quad => quad.every(x => qids.includes(x)));

            default:
                throw new Error(`Rules.IsSatisfied: no such rule type ${rType}`);
        }
    }


    /**
     * A special-case oddball test.
     */
    static AtLeastTwoTest(qids)
    {
        const vertSingleton = Knowledge.Verticals.some(v => {
            if (!qids.includes(v)) { return false; }
            const vnbrs = Utils.Intersection(Knowledge.QuantaNeighbors[v], Knowledge.Verticals);
            return !Utils.Intersection(qids, vnbrs).length;
        });

        if (vertSingleton) { 
            return true; 
        } else {
            return Knowledge.HorizAndDiagPairs.some(pair => (Utils.Intersection(pair, qids).length == 1) );
        }
    }


    /**
     * A special-case oddball test, for Drafter
     */
    static DraftAtLeastTwoTest(ownStuff, otherStuff)
    {
        const ownStuffProcessed = (ownStuff.length == 0) ? [] : ownStuff.slice().reverse().slice(1);
        const ans1 = Rules.AtLeastTwoTest([...ownStuffProcessed, ...otherStuff]);
        const ans2 = Rules.AtLeastTwoTest([...otherStuff, ...ownStuff]);
        return ans1 && ans2;
    }


    /**
     * Returns the set of qids that are the victims of the given rule type.
     */
    static RuleVictims(ruleType) 
    {
        if (!Rules.RuleTypes.includes(ruleType)) { 
            throw new Error(`Rules.RuleVictims: no such rule type ${ruleType}`); 
        }

        switch (ruleType) {
            case "ban_topedge": return Knowledge.TopedgeZone;
            case "ban_topbox": return Knowledge.TopboxZone;
            case "ban_ascender": return Knowledge.AscenderZone;
            case "ban_descender": return Knowledge.DescenderZone;
            case "ban_bottombox": return Knowledge.BottomboxZone;
            case "ban_bottomedge": return Knowledge.BottomedgeZone;
            case "ban_rightedge": return Knowledge.RightedgeZone;
            case "ban_leftedge": return Knowledge.LeftedgeZone;
            case "ban_vertedges": return Knowledge.VertedgesZone;
            case "ban_vertboxes": return Knowledge.VertboxesZone;
            case "ban_topleft": return Knowledge.TopleftZone;
            case "ban_topright": return Knowledge.ToprightZone;
            case "ban_bottomleft": return Knowledge.BottomleftZone;
            case "ban_bottomright": return Knowledge.BottomrightZone;
            case "ban_corners": return Knowledge.CornersZone;
            case "ban_horiz_quanta": return Knowledge.Horizontals;
            case "ban_vert_quanta": return Knowledge.Verticals;
            case "ban_foreslash_quanta": return Knowledge.Foreslashes;
            case "ban_backslash_quanta": return Knowledge.Backslashes;
            case "ban_rectilinear_quanta": return Knowledge.Rectilinears;
            case "ban_diagonal_quanta": return Knowledge.Diagonals;
            default: return [];
        }
    }

};
