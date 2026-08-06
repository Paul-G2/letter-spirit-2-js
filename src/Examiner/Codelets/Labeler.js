/**
 * @classdesc
 * This Examiner codelet tries to attach labels to a Part. 
 * 
 */
 Codelets.Labeler = class extends Codelets.CodeletBase
 {
    static Name = 'labeler';
    static Text = 'Labeler';

    // Labeler functions
    static LabelFuncs;


    /**
     * @constructor
     * 
     * @param {Examiner} owner - The codelet's owner.
     * @param {Number} urgency - The urgency of the codelet.
     * @param {Number} generation - The generation that the codelet belongs to.
     * @param {Array} args - Arguments to pass to the codelet.
     */
    constructor(owner, urgency, generation, args) 
    { 
        super(Codelets.Labeler.Name, owner, urgency, generation);
        this.part = args[0];

        // Initilize the static list of labeler functions
        const Labeler = Codelets.Labeler;
        Labeler.LabelFuncs = Labeler.LabelFuncs || [
            {name: 'Contact', func: Labeler.LabelContact}, 
            {name: 'Neighbors', func: Labeler.LabelNeighbors}, 
            {name: 'Tips', func: Labeler.LabelTips}, 
            {name: 'Curve', func: Labeler.LabelCurve}, 
            {name: 'Height', func: Labeler.LabelHeight}, 
            {name: 'Weight', func: Labeler.LabelWeight}, 
            {name: 'Shape', func: Labeler.LabelShape}, 
            {name: 'Ends', func: Labeler.LabelEnds}, 
            {name: 'Width', func: Labeler.LabelWidth}, 
            {name: 'Vertical', func: Labeler.LabelVertical}, 
            {name: 'Horizontal', func: Labeler.LabelHorizontal}
        ];
    }


    /**
     * Runs the codelet.
     */
    run()
    {
        // Display codelet info
        const exmr = this.owner;
        this.titleText    = 'Labeler codelet from generation ' + this.gen; 
        this.messageText1 = '';
        this.messageText2 = '';     
        exmr.app.reporter.trace(this.titleText);

        const updatedPart = exmr.getUpdatedPart(this.part); // In case the part has changed
        if (!updatedPart || updatedPart.hasLabel('**whine')) {
            this.messageText1 = `Part ${this.part.qidString()} is no longer around ... >>>fizzle<<<`;
        } 
        else {
            for (let i=0; i<9; i++) {
                const labelFunc = exmr.randGen.choice(Codelets.Labeler.LabelFuncs);
                this.messageText1 = `Labeling part ${updatedPart.qidString()} with type ${labelFunc.name}`;
                labelFunc.func(updatedPart, exmr.inputGridLetter.quantaIds);
            }
        }

        // Post a label-checker codelet
        exmr.app.coderack.post(1, 'label-checker', Params.MediumUrgency, this.gen+1);
    }


    /**
     * Adds a contact label, which will be one of:
     *  - 'all_over' (tips and middle), 
     *  - 't1m' (tip1 and middle), 
     *  - '2ts' (two tips, no middle), 
     *  - 't1'  (tip1 only), 
     *  - 't2'  (tip2 only), 
     *  - 'nc'  (no contact), 
     *  - 'm'   (middle only), 
     *  - 'mt2' (middle and tip2), 
     *  - '2ms' (multiple middle points).
     *  - 'c_lf' (contact on the left),
     *  - 'c_rt' (contact on the right).
     */
    static LabelContact(part, inputLetterQids) 
    {
        const qids = part.getLabel('quanta')?.data || [];  
        part.addLabel( new Label('contact', NormViols.ContactText(qids, inputLetterQids)) );
    }


    /**
     * Adds a neighbors label. The label consists of 8 yes/no/equal flags, one for each of the 8 
     * cardinal directions [n, ne, e, se, s, sw, w, nw], indicating whether there is a 
     * neighboring quantum in that direction.
     */
    static LabelNeighbors(part, inputLetterQids) 
    {
        const qids = part.getLabel('quanta')?.data || [];
        const otherIds = inputLetterQids.filter(qid => !qids.includes(qid));
        const quanta = qids.map(qid => QuantaList[qid]);
        const others = otherIds.map(qid => QuantaList[qid]);
        const partPoints = quanta.map(q => q.startPoint).concat(quanta.map(q => q.endPoint));
        const otherPoints = others.map(q => q.startPoint).concat(others.map(q => q.endPoint));

        const coord = function(dir, x, y) {
            switch (dir) {
                case 'n':  return  -y;
                case 'ne': return  x-y;
                case 'e':  return  x;
                case 'se': return  x+y;
                case 's':  return  y;
                case 'sw': return -x+y;
                case 'w':  return -x;
                case 'nw': return -x-y;
            }
        };

        let nData = ['n', 'n', 'n', 'n', 'n', 'n', 'n', 'n'];
        if ((qids.length > 0) && (otherIds.length > 0)) {
            nData = ['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'].map(dir => {
                const extPart = Math.max(...partPoints.map(p => coord(dir, p.x, p.y)));
                const extOther = Math.max(...otherPoints.map(p => coord(dir, p.x, p.y)));
                return (extOther > extPart) ? 'y' : (extOther < extPart) ? 'n' : 'eq';
            });
        }

        part.addLabel( new Label('neighborhood', nData) );
    }


    /**
     * Adds a tips label. It will have the form 
     * [ [tip0PointId, tip0Orientation], [tip1PointId, tip1Orientation] ], where 
     * each tipOrientation is one of 'n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'.
     */
    static LabelTips(part) 
    {
        const qids = part.getLabel('quanta')?.data || []; // Linearized
        const tips = Utils.GetTips(qids);
        if (tips.length > 0) { 
            const q0 = QuantaList[qids[0]];
            let [s0, e0] = tips.includes(q0.startPointId) ? [q0.endPoint, q0.startPoint] : [q0.startPoint, q0.endPoint];
            const [dx0, dy0] = [e0.x - s0.x, e0.y - s0.y];
            const ori0 = '' + ((dy0 > 0) ? 's' : (dy0 < 0) ? 'n' : '')  + ((dx0 > 0) ? 'e' : (dx0 < 0) ? 'w' : '');

            const q1 = QuantaList[qids[qids.length-1]];
            let [s1, e1] = (q1 === q0) ? [e0, s0] : tips.includes(q1.startPointId) ? [q1.endPoint, q1.startPoint] : [q1.startPoint, q1.endPoint];
            const [dx1, dy1] = [e1.x - s1.x, e1.y - s1.y];
            const ori1 = '' + ((dy1 > 0) ? 's' : (dy1 < 0) ? 'n' : '')  + ((dx1 > 0) ? 'e' : (dx1 < 0) ? 'w' : '');

            const tData = [[tips[0], ori0], [tips[tips.length-1], ori1]];
            part.addLabel( new Label('tips', tData) );
        }
    }   


    /**
     * For the entire curve, as well as each of its halves, assigns a label 
     * which is one of ['straight', 'slight_right', 'square_right',
     * 'strong_right', 'slight_left', 'square_left', 'strong_left'].
     * 
     */
    static LabelCurve(part) 
    {
        const qids = part.getLabel('quanta')?.data || [];

        const L = qids.length;
        const firstHalf = qids.slice(0, Math.ceil(L/2));
        const secondHalf = qids.slice(Math.floor(L/2), L);
    
        part.addLabel( new Label('curve', Codelets.Labeler.CurveLabelData(qids)) );
        part.addLabel( new Label('curve1', Codelets.Labeler.CurveLabelData(firstHalf)) );
        part.addLabel( new Label('curve2', Codelets.Labeler.CurveLabelData(secondHalf)) );
    }       


    /**
     * Computes curve label data, based on the given quanta.
     */
    static CurveLabelData(qids)
    {
        const tips = Utils.GetTips(qids);
        if (tips.length < 2) {
            return 'closure';
        } else {
            const curv = Utils.PartCurvature( Utils.LinearizedPointIds(qids) );
            return NormViols.CurvatureText(curv);  
        }
    }
    
    
    /**
     * Adds a height label, which will be one of ['no_height', 'very_short', 
     * 'short', 'medium_ht', 'tall', 'very_tall'].
     * 
     */
    static LabelHeight(part) 
    {
        const qids = part.getLabel('quanta')?.data || []; 
        const text = NormViols.HeightText(qids);
        part.addLabel( new Label(text, null) );
    }   


    /**
     * Adds a weight label, which will be one of ['zero', 'very_light', 'light', 
     * 'medium_wt', 'heavy', 'huge'].
     * 
     */
    static LabelWeight(part) 
    {
        const qids = part.getLabel('quanta')?.data || [];
        const text = NormViols.WeightText(qids);
        part.addLabel( new Label(text, null) );
    }   


    /**
     * Adds a shape label, which will be one of ['spiky_closure', 'closure', 
     * 'bactrian', 'cupped', 'simple'].
     * 
     */
    static LabelShape(part) 
    {
        const qids = part.getLabel('quanta')?.data || [];
        part.addLabel( new Label('shape', Codelets.Labeler.ShapeLabelData(qids)) );
    }


    /**
     * Computes shape label data, based on the given quanta.
     */
    static ShapeLabelData(qids)
    {
        const tips = Utils.GetTips(qids);

        const closure = (tips.length < 2);
        const midqClosure = (Utils.MidQuantaTouches(qids, qids) > 0);

        if (midqClosure || (closure && (tips.length > 0))) {
            return 'spiky_closure';
        } else if (closure) {
            return 'closure';
        } 
        else 
        {
            const hasHumps = function(pids, sign=1) {
                const yVals = pids.map(pid => sign * Utils.PointIdToXYCoords(pid).y);
                const minY = Math.min(...yVals);
                for (let i=yVals.indexOf(minY)+1; i < yVals.lastIndexOf(minY); i++) {
                    if (yVals[i] > minY) { return true; }
                }
                return false;
            };

            const pids = Utils.LinearizedPointIds(qids);
            const trimLpids = pids.slice(1);
            const trimRpids = pids.slice(0, pids.length-1);

            const bactrian = (hasHumps(pids) && (hasHumps(trimLpids) || hasHumps(trimRpids))) ||
                (hasHumps(pids, -1) && (hasHumps(trimLpids, -1) || hasHumps(trimRpids, -1)));
            if (bactrian) { 
                return 'bactrian'; // to keep w from being called u
            }

            const ctips = [pids[0], pids[pids.length-1]];
            const midIds = pids.slice(1, pids.length-1);
            if (midIds.length > 0) { 
                const midMax = Math.max(...midIds.map(pid => Utils.PointIdToXYCoords(pid).y));
                const ctipsMax = Math.max(...ctips.map(pid => Utils.PointIdToXYCoords(pid).y));
                if (midMax >= ctipsMax) { 
                    return 'cupped'; // to keep w from being called v
                }
            }
            return 'simple';
        }
    }   


    /**
     * Adds an ends label. Similar to tip labels, but tagged with the ids of the 
     * edge *quanta* instead of the tip points.
     * 
     */
    static LabelEnds(part) 
    {
        const qids = part.getLabel('quanta')?.data || []; // Linearized
        const tips = Utils.GetTips(qids);
        if (tips.length > 0) { 
            const q0 = QuantaList[qids[0]];
            let [s0, e0] = tips.includes(q0.startPointId) ? [q0.endPoint, q0.startPoint] : [q0.startPoint, q0.endPoint];
            const [dx0, dy0] = [e0.x - s0.x, e0.y - s0.y];
            const ori0 = '' + ((dy0 > 0) ? 's' : (dy0 < 0) ? 'n' : '')  + ((dx0 > 0) ? 'e' : (dx0 < 0) ? 'w' : '');

            const q1 = QuantaList[qids[qids.length-1]];
            let [s1, e1] = (q1 === q0) ? [e0, s0] : tips.includes(q1.startPointId) ? [q1.endPoint, q1.startPoint] : [q1.startPoint, q1.endPoint];
            const [dx1, dy1] = [e1.x - s1.x, e1.y - s1.y];
            const ori1 = '' + ((dy1 > 0) ? 's' : (dy1 < 0) ? 'n' : '')  + ((dx1 > 0) ? 'e' : (dx1 < 0) ? 'w' : '');

            // Return list of two sublists
            const eData = [[qids[0], ori0], [qids[qids.length-1], ori1]];
            part.addLabel( new Label('ends', eData) );
        }
    }


    /**
     * Adds a width label, one of ['skinny', 'half_wide', 'wide'].
     * 
     */
    static LabelWidth(part) 
    {
        const qids = part.getLabel('quanta')?.data || [];
        const text = NormViols.WidthText(qids);
        part.addLabel( new Label(text, null) );
    }


    /**
     * Adds vertical labels.
     * 
     */
    static LabelVertical(part) 
    {
        const qids = part.getLabel('quanta')?.data || [];

        const roofText = NormViols.RoofText(qids);
        const floorText = NormViols.FloorText(qids);

        part.addLabel(new Label(roofText, null));
        part.addLabel(new Label(floorText, null));
    }


    /**
     * Adds horizontal labels.
     * 
     */
    static LabelHorizontal(part) 
    {
        const qids = part.getLabel('quanta')?.data || [];

        const leftEdgeText = NormViols.LeftEdgeText(qids);
        const rightEdgeText = NormViols.RightEdgeText(qids);

        part.addLabel( new Label(leftEdgeText, null) );
        part.addLabel( new Label(rightEdgeText, null) );
    } 

};
