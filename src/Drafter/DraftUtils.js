/**
 * @classdesc
 * This class provides utilities for drafting.
 * 
 */
class DraftUtils
{
    static BaseBorrowList;
    static RoleBorrowList;

    static // Static constructor
    {
        const K = Knowledge;
        DraftUtils.BaseBorrowList = Object.fromEntries([
            ['a', [['steal', 'e', K.Turn180Map]]],
            ['b', [['steal', 'q', K.Turn180Map], ['steal', 'd', K.HorizFlipMap], ['steal', 'p', K.VertFlipMap]]],
            ['c', [['chop', 'o', K.RightedgeZone]]],
            ['d', [['steal', 'p', K.Turn180Map], ['steal', 'b', K.HorizFlipMap], ['steal', 'q', K.VertFlipMap]]],
            ['e', [['steal', 'a', K.Turn180Map]]],
            ['f', []],
            ['g', []],
            ['h', [['chop', 'b', K.BaseBarQids], ['steal', 'y', K.Turn180Map]]],
            ['i', [['chop', 'j', K.DescenderZone]]],
            ['j', []],
            ['k', []],
            ['l', []],
            ['m', [['steal', 'w', K.Turn180Map]]],
            ['n', [['chop', 'o', K.BaseBarQids], ['steal', 'u', K.Turn180Map], ['chop', 'h', K.AscenderZone]]],
            ['o', [['chop', 'b', K.AscenderZone], ['chop', 'd', K.AscenderZone], ['chop', 'g', K.DescenderZone], ['chop', 'p', K.DescenderZone], ['chop', 'q', K.DescenderZone]]],
            ['p', [['steal', 'd', K.Turn180Map], ['steal', 'q', K.HorizFlipMap], ['steal', 'b', K.VertFlipMap]]],
            ['q', [['steal', 'b', K.Turn180Map], ['steal', 'p', K.HorizFlipMap], ['steal', 'd', K.VertFlipMap]]],
            ['r', [['chop', 'c', K.BaseBarQids], ['chop', 'n', K.RightedgeZone]]],
            ['s', [['steal', 'z', K.HorizFlipMap]]],
            ['t', []],
            ['u', [['chop', 'o', K.XBarQids], ['chop', 'y', K.DescenderZone], ['steal', 'n', K.Turn180Map]]],
            ['v', []],
            ['w', [['steal', 'm', K.Turn180Map]]],
            ['x', []],
            ['y', [['chop', 'g', K.XBarQids], ['steal', 'h', K.Turn180Map]]],
            ['z', [['steal', 's', K.HorizFlipMap]]]
        ]);
        Object.freeze(DraftUtils.BaseBorrowList);


        DraftUtils.RoleBorrowList = Object.fromEntries([
            ['a_arch', ['a_arch', 'right_buttress']],
            ['backslash', ['backslash']],
            ['basebar', ['basebar', 's_base']],
            ['cap', ['cap', 'z_cap', 'crossbar']],
            ['center_post', ['center_post']],
            ['circle', ['circle']],
            ['crossbar', ['crossbar', 'cap', 'z_cap']],
            ['dot', ['dot']],
            ['down_arm', ['down_arm']],
            ['down_circle', ['down_circle']],
            ['e_bowl', ['e_bowl', 'left_bowl']],
            ['e_crossbar', ['e_crossbar', 's_crossbar']],
            ['e_tail', ['e_tail']],
            ['f_post', ['f_post']],
            ['foreslash', ['foreslash']],
            ['halfpost', ['halfpost', 'right_halfarc', 'left_halfarch', 'right_halfarch', 'right_halfpost']],
            ['left_bowl', ['left_bowl', 'e_bowl']],
            ['left_downbowl', ['left_downbowl']],
            ['left_halfarc', ['left_halfarc']],
            ['left_halfarch', ['left_halfarch']],
            ['left_halfpost', ['left_halfpost']],
            ['left_post', ['left_post']],
            ['left_tail', ['left_tail']],
            ['left_uparc', ['left_uparc']],
            ['left_upbowl', ['left_upbowl']],
            ['left_wing', ['left_wing']],
            ['right_bowl', ['right_bowl']],
            ['right_buttress', ['a_arch', 'right_buttress']],
            ['right_curl', ['right_curl', 'right_hook']],
            ['right_downbowl', ['right_downbowl']],
            ['right_halfarc', ['right_halfarc']],
            ['right_halfarch', ['right_halfarch']],
            ['right_halfpost', ['right_halfpost']],
            ['right_hook', ['right_hook', 'right_curl']],
            ['right_post', ['right_post']],
            ['right_tail', ['right_tail']],
            ['right_wing', ['right_wing']],
            ['s_base', ['s_base', 'basebar']],
            ['s_crossbar', ['s_crossbar', 'e_crossbar']],
            ['t_post', ['t_post']],
            ['up_arm', ['up_arm']],
            ['up_circle', ['up_circle']],
            ['z_cap', ['z_cap', 'cap', 'crossbar']]
        ]);
        Object.freeze(DraftUtils.RoleBorrowList);
    }


    /**
     * @constructor
     * @param {Drafter} drafter - A Drafter instance.
     */
    constructor(drafter) 
    { 
        this.drafter = drafter;
    }

    
    static ArcRadius(curve, p1, p2) 
    {
        let fraction;
        switch (curve) {
            case 'full_left':
                fraction = 0.64; 
                break;
            case 'strong_left':
                fraction = 0.559;
                break;
            case 'square_left':
                fraction = 0.65;
                break;
            case 'slight_left':
                fraction = 0.707;
                break;
            case 'slight_right':
                fraction = 0.707;
                break;
            case 'square_right':
                fraction = 0.65;
                break;
            case 'strong_right':
                fraction = 0.559;
                break;
            case 'full_right':
                fraction = 0.64;
                break;
            default:
                throw new Error(`Unknown curve type, in DraftUtils.ArcRadius(): ${curve}`);
        }
        return fraction * Utils.DistanceBetweenPointIds(p1, p2);
    };


    /**
     * Returns the point to use as the center of an arc when plotting curve on grid
     */
    static ArcCenter(curve, p1, p2) 
    {
        let f;
        switch (curve) {
            case 'full_left':
                f = 0.1;
                break;
            case 'strong_left':
                f = 0.25;
                break;
            case 'square_left':
                f = 0.5;
                break;
            case 'slight_left':
                f = 1.0; 
                break;
            case 'slight_right':
                f = 0.0;
                break;
            case 'square_right':
                f = 0.5;
                break;
            case 'strong_right':
                f = 0.75;
                break;
            case 'full_right':
                f = 0.9;
                break;
            default:
                throw new Error(`Unknown curve type, in DraftUtils.ArcCenter(): ${curve}`);
        }

        const [q1, q2] = [Utils.PointIdToXYCoords(p1), Utils.PointIdToXYCoords(p2)];
        const [midx, midy]   = [(q1.x + q2.x)/2, (q1.y + q2.y)/2];
        const [perpx, perpy] = [q1.y - midy,  midx - q1.x];
        const [Ax, Ay] = [midx - perpx, midy - perpy];
        const [Bx, By] = [midx + perpx, midy + perpy];
        return {x:Ax + f*(Bx - Ax), y:Ay + f*(By - Ay)};
    }


    static ArcDists(curve, p1, p2) 
    {
        const arcCenter = DraftUtils.ArcCenter(curve, p1, p2);
        const allDistsFromCtr = Object.values(Knowledge.PointCoords).map(p => Utils.DistanceBetweenPoints(p, arcCenter));
        const arcRadius = DraftUtils.ArcRadius(curve, p1, p2);
        return allDistsFromCtr.map(d => Math.abs(d - arcRadius));
    }


    static CurveSigns(curve, p1, p2) 
    {
        const labelSign = curve.endsWith('right') ? 1 : -1;
        const signs = Knowledge.AllPointIds.map(pt => (pt === p1 || pt === p2) ? 0 : DraftUtils.CurveSign(p1, pt, p2))
        return signs.map(sign => (Math.abs(labelSign - sign) < 1.5) ? 1.0 : 0.1);
    }


    /**
     * Returns positive if the given midpoint is right of the end1-to-end2 direction, otherwise false.
     */
    static CurveSign(end1, mid, end2) 
    {
        end1 = Knowledge.PointCoords[end1];
        end2 = Knowledge.PointCoords[end2];
        mid  = Knowledge.PointCoords[mid];

        if (end1.x === end2.x) { // vertical line case
            const e2AboveE1 = (end1.y < end2.y);
            const midRight = (mid.x > end1.x);
            return (e2AboveE1 == midRight) ? 1 : -1; 
        } else {
            const e1RightE2 = (end1.x > end2.x);
            const lineY = end1.y + ((end2.y - end1.y) * (mid.x - end1.x)) / (end2.x - end1.x);
            const midAboveLine = (mid.y > lineY);
            return (e1RightE2 == midAboveLine) ? 1 : -1;
        }
    }  


    static TouchNormScores(touchNorm) 
    {
        switch (touchNorm) {
            case 'nc':
                return [0, 0, 0];
            case 'all_over':
                return [1, 2, 1];
            case 'c_lf':
                return [1, 0, 0];
            case 'c_rt':
                return [0, 0, 1];
            case 't1':
                return [1, 0, 0];
            case 'm':
                return [0, 1, 0];
            case 't2':
                return [0, 0, 1];
            case '2ts':
                return [1, 0, 1];
            case 't1m':
                return [1, 1, 0];
            case 'mt2':
                return [0, 1, 1];
            case '2ms':
                return [0, 2, 0];
            default:
                return [0, 0, 0];
        }
    };


    tipTouchScores(whichTip) 
    {
        const drafter = this.drafter;
        const touchNorms = Roles[drafter.theRoleName].norms.contact[drafter.theWholeName];
        const maxTouchNorm = Object.keys(touchNorms).reduce((a, b) => touchNorms[a] > touchNorms[b] ? a : b);
        const normScores = DraftUtils.TouchNormScores(maxTouchNorm);

        const shouldTouch = (1 === (whichTip === 1 ? normScores[0] : normScores[2]));
        const goodPoints = drafter.touchPoints.flat();
        const badPoints = shouldTouch ? drafter.avoidPoints.flat() : [...drafter.avoidPoints.flat(), ...Utils.PointIds(drafter.otherStuff)];
    
        const scores = Knowledge.AllPointIds.map(p => (shouldTouch && goodPoints.includes(p)) ? 10000 : badPoints.includes(p) ? 0.0001: 1.0);
        return Object.fromEntries(Knowledge.AllPointIds.map((p, i) => [p, scores[i]]));
    };


    recordTouchingInfo()
    {
        const drafter = this.drafter;
        const touchNorms = Roles[drafter.theRoleName].norms.contact[drafter.theWholeName];
        const maxTouchNorm = Object.keys(touchNorms).reduce((a, b) => touchNorms[a] > touchNorms[b] ? a : b);
        const normScores = DraftUtils.TouchNormScores(maxTouchNorm);

        const points = Utils.LinearizedPointIds(drafter.ownStuff);
        const otherPoints = Utils.PointIds(drafter.otherStuff);
        const t1 = (points.length === 0) ? [] : [points[0]];
        const t2 = (points.length === 0) ? [] : [points[points.length-1]];
        const m = (points.length === 0) ? [] : points.slice(1, -1);

        if ( (normScores[0] === 1) && t1.length && !otherPoints.includes(t1[0]) ) {
            drafter.touchPoints = [t1, ...drafter.touchPoints];
        }
        if ( (normScores[0] === 0) && t1.length ) {
            drafter.avoidPoints = [t1, ...drafter.avoidPoints];
        }
        if ( (normScores[1] === 1) && m.length && !m.some(item => otherPoints.includes(item)) ) {
            drafter.touchPoints = [m, ...drafter.touchPoints];
        }
        if ( (normScores[1] === 0) && m.length ) {
            drafter.avoidQuanta = [drafter.ownStuff, ...drafter.avoidQuanta];
            drafter.avoidPoints = [m, ...drafter.avoidPoints];
        }
        if ( (normScores[2] === 1) && t2.length && !otherPoints.includes(t2[0]) ) {
            drafter.touchPoints = [t2, ...drafter.touchPoints];
        }
        if ( (normScores[2] === 0) && t2.length ) {
            drafter.avoidPoints = [t2, ...drafter.avoidPoints];
        }        
    }

};