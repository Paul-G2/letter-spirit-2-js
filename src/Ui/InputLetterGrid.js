/**
 * @classdesc
 * This is the ui element for inputting a single letter.
 * 
 */
Ui.InputLetterGrid = class {

    /**
     * @constructor
     * 
     * @param {HTMLElement} site - The html div that will host the grid.
     * @param {boolean} [editable=true] - Whether the grid quanta can be added/removed with the mouse.
     * @param {string} [bkgndColor='#b3ddcc'] - The grid's background color.
     * @param {string} [gridLineColor='#98d1ba'] - The grid's line color.
     */
    constructor(site, opts={editable:true}) 
    { 
        this.site = site;
        this.bkgndColor  = opts.bkgndColor || '#b3ddcc';
        this.gridLineColor  = opts.gridLineColor || '#98d1ba';
        this.drawParams = {};
        this.labelText = '';
        this.letterParts = [];

        this.canvas = Ui.Utils.CreateElement('canvas', 'lettergrid-canvas', site, 
            {position:'absolute', margin:'0', padding:'0', top:'0%', left:'0%', width:'100%', 
            height:'100%', background:this.bkgndColor}
        ); 

        this.clickHandler = null;
        this.setEditable(opts.editable || (opts.editable === undefined));

        this.onQuanta = []; 
    }


    /**
     * Sets the grid editable or not editable.
     * @param {boolean} editable - The value to set.
     * 
     */
    setEditable(editable) 
    {
        if (editable && !this.clickHandler) {
            this.clickHandler = this._onClick.bind(this);
            this.canvas.addEventListener('click', this.clickHandler);
        } 
        else if (!editable && this.clickHandler) {
            this.canvas.removeEventListener('click', this.clickHandler);
            this.clickHandler = null;
        }
    }


    /**
     * Sets the grid's on-quanta.
     * 
     */
    setOnQuanta(qids) 
    { 
        this.onQuanta = (qids || []).slice(); 
    }


    /**
     * Sets info about this grid's letter, obtained from the Examiner.
     */
    setExmrInfo(labelText, parts) 
    { 
        this.labelText = labelText; 
        this.letterParts = parts;
    }


    /**
     * Redraws the grid and its quanta.
     * 
     */
    redraw()
    {
        const canv = this.canvas;
        const ctx = canv.getContext("2d");
        const dp = this.drawParams;

        // Maybe update the drawParams
        if ( !Ui.Utils.RightsizeCanvas(canv) ) { return; }
        if ( Ui.Utils.NeedToRescale(dp, ctx) && !this._updateDrawParams(ctx)) { return; }

        // Fill the canvas with the background color
        const [w, h] = [dp.canvWidth, dp.canvHeight];
        ctx.fillStyle = this.bkgndColor; 
        ctx.fillRect(0, 0, w, h);

        // Draw the grid lines
        ctx.strokeStyle = this.gridLineColor; 
        Array.from({length: 56}, (e, i)=> i).forEach( iq => {
            const q = QuantaList[iq];
            const [xs, ys] = [dp.xi + dp.xgap*q.startPoint.x, dp.yi + dp.ygap*q.startPoint.y];
            const [xe, ye] = [dp.xi + dp.xgap*q.endPoint.x,   dp.yi + dp.ygap*q.endPoint.y];
            ctx.lineWidth = (iq == 8) || (iq == 9) ? 2*dp.gridLineWidth : dp.gridLineWidth;
            Ui.Utils.DrawLine(ctx, xs, ys, xe, ye);
        });

        // Draw the quanta
        const prevLineCap = ctx.lineCap;
        ctx.lineCap = 'round';
        ctx.lineWidth = dp.quantaLineWidth;
        if (!this.letterParts || !this.letterParts.length) {
            ctx.strokeStyle  = !!this.clickHandler ? 'black' : '#808080'; 
            this.onQuanta.forEach( iq => {
                const q = QuantaList[iq];
                const [xs, ys] = [dp.xi + dp.xgap*q.startPoint.x, dp.yi + dp.ygap*q.startPoint.y];
                const [xe, ye] = [dp.xi + dp.xgap*q.endPoint.x,   dp.yi + dp.ygap*q.endPoint.y];
                Ui.Utils.DrawLine(ctx, xs, ys, xe, ye);
            });
        }
        else {
            this.letterParts.forEach( part => {
                ctx.strokeStyle = part.color;
                part.getQuanta().forEach( q => {
                    const [xs, ys] = [dp.xi + dp.xgap*q.startPoint.x, dp.yi + dp.ygap*q.startPoint.y];
                    const [xe, ye] = [dp.xi + dp.xgap*q.endPoint.x,   dp.yi + dp.ygap*q.endPoint.y];
                    Ui.Utils.DrawLine(ctx, xs, ys, xe, ye);
                });
            });
        }
        ctx.lineCap = prevLineCap;

        // Maybe draw the label text
        if (this.labelText) {
            ctx.textAlign = 'center'; 
            ctx.fillStyle = !!this.clickHandler ? 'black' : '#808080'; 
            ctx.font = dp.fontSize + "px sans-serif"; 
            ctx.fillText(this.labelText, w/2, dp.textPosY);
        }
    }


    /** 
     * Recalculates the drawing parameters for this object.
     * 
     * @private
     */
    _updateDrawParams(ctx)
    {
        const [w, h] = [ctx.canvas.width, ctx.canvas.height];
        if ((w < 1) || (h < 1)) { return false; }

        const dp = this.drawParams;
        [dp.canvWidth, dp.canvHeight] = [w, h];
        
        dp.gridLineWidth = Math.min(3, Math.max(1, 0.030*Math.min(w, h/2)));
        dp.quantaLineWidth = 3*dp.gridLineWidth;
        dp.gridHeight = 0.85*h;

        dp.xgap = dp.ygap = Math.min((w-2-dp.quantaLineWidth)/2, (dp.gridHeight-2-dp.quantaLineWidth)/6); 
        dp.xi = (w/2 - dp.xgap);
        dp.yi = 1 + dp.quantaLineWidth/2;

        dp.fontSize = Math.round(0.95*dp.ygap);
        dp.textPosY = dp.yi + dp.ygap*6 + 0.90*dp.fontSize;

        return true;
    }



    /**
     * Click handler.
     * @private
     *  
     */
    _onClick(e)
    {
        const clickPt = Ui.Utils.GetRelativeEventCoordinates(e);
        if (!clickPt) { return; }

        const dp = this.drawParams;

        let dists = QuantaList.map( q => {
            const pa = [dp.xi + dp.xgap*q.startPoint.x, dp.yi + dp.ygap*q.startPoint.y];
            const pb = [dp.xi + dp.xgap*q.endPoint.x,   dp.yi + dp.ygap*q.endPoint.y];
            return Ui.Utils.SquaredDistanceToLineSegment(clickPt, pa, pb);
        });

        var indexOfMinDist = dists.reduce((iMin, x, i, dists) => x < dists[iMin] ? i : iMin, 0);
        if (dists[indexOfMinDist] < 0.4*Math.min(dp.xgap, dp.ygap)**2) { 
            if (this.onQuanta.includes(indexOfMinDist)) {
                this.onQuanta.splice(this.onQuanta.indexOf(indexOfMinDist), 1);
            } else {
                this.onQuanta.push(indexOfMinDist);
            }
            this.redraw();
        }
    }
};
