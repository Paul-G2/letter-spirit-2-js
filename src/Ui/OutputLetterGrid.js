/**
 * @classdesc
 * This is a ui for a single letterform grid used to display drafted letterforms.
 * 
 */
Ui.OutputLetterGrid = class {

    /**
     * @constructor
     * 
     * @param {OutputLetterArray} parentUi - The parent Ui.
     * @param {HTMLElement} site - The html div that will host the grid.
     * @param {string} letter - The grid's letter category (a-z).
     * @param {string} [borderCode='ltrb'] - Which borders to draw.
     * @param {string} [bkgndColor='#ffdead'] - The grid's background color.
     */
    constructor(parentUi, site, letter, opts={}) 
    { 
        this.parentUi = parentUi;
        this.site = site;
        this.letter = letter;
        this.bkgndColor = opts.bkgndColor || '#ffdead';
        this.borderCode = opts.borderCode || 'ltrb';
        this.activeBorder = false;

        this.canvas = Ui.Utils.CreateElement('canvas',
            'letterformgrid-canvas-' + letter, site, {position:'absolute', margin:'0', padding:'0', 
            top:'0%', left:'0%', width:'100%', height:'100%', background:this.bkgndColor}
        ); 

        this.onQuanta = [];
        this.tentativeQuanta = [];
    }


    /**
     * Sets the grid's on-quanta.
     */
    setOnQuanta(qids) 
    { 
        this.onQuanta = (qids || []).slice(); 
    }

    
    /**
     * Sets the grid's tentative-quanta.
     */
    setTentativeQuanta(qids) 
    { 
        this.tentativeQuanta = (qids || []).slice(); 
    }

    
    /**
     * Redraws the grid and its quanta.
     */
    redraw()
    {
        const canv = this.canvas;
        const ctx = canv.getContext("2d");

        if ( !Ui.Utils.RightsizeCanvas(this.canvas) ) { return; }
        const [w, h] = [canv.width, canv.height];

        // Fill the canvas with the background color
        ctx.fillStyle = this.bkgndColor; 
        ctx.fillRect(0, 0, w, h);

        // Draw the grid
        const dotRadius = Math.min(1, 0.025*w);
        const dotSize = 2*dotRadius + 1;
        const xgap = Math.min(w/3.5, 7*h/60); 
        const ygap = xgap;
        let [xi, yi] = [w/2- xgap - dotRadius, 7*h/16 - 3*ygap - dotRadius];
        ctx.fillStyle = 'black'; 
        for (let iy=0; iy<7; iy++) {
            for (let ix=0; ix<3; ix++) {
                ctx.fillRect(xi+ix*xgap, yi+iy*ygap, dotSize, dotSize); 
            }            
        }

        // Draw the border
        ctx.strokeStyle = 'black';
        ctx.lineWidth = this.activeBorder ? "11" : "1";
        if (this.activeBorder || this.borderCode.includes('l')) { Ui.Utils.DrawLine(ctx, 0,0, 0,h); }
        if (this.activeBorder || this.borderCode.includes('r')) { Ui.Utils.DrawLine(ctx, w,0, w,h); }
        if (this.activeBorder || this.borderCode.includes('t')) { Ui.Utils.DrawLine(ctx, 0,0, w,0); }
        if (this.activeBorder || this.borderCode.includes('b')) { Ui.Utils.DrawLine(ctx, 0,h, w,h); }
        ctx.strokeStyle = 'black';

        // Draw the letter-label
        const fontSize = (0.9*ygap).toFixed(2);
        ctx.font = fontSize + "px arial";
        ctx.fillText(this.letter, w/2 - fontSize/4, 0.95*h);

        // Draw the quanta
        const app = this.parentUi.parentUi.parentUi.app;
        ctx.lineWidth = "4";
        if (!this.activeBorder || (app.activeModule.name == 'Drafter'))
        {
            [xi, yi] = [w/2- xgap, 7*h/16 - 3*ygap];
            ctx.strokeStyle = '#a2a2a2';
            this.tentativeQuanta.forEach( iq => {
                const q = QuantaList[iq];
                const [xs, ys] = [xi + xgap*q.startPoint.x, yi + ygap*q.startPoint.y];
                const [xe, ye] = [xi + xgap*q.endPoint.x, yi + ygap*q.endPoint.y];
                Ui.Utils.DrawLine(ctx, xs, ys, xe, ye);
            });
            ctx.strokeStyle = 'black';
            this.onQuanta.forEach( iq => {
                const q = QuantaList[iq];
                const [xs, ys] = [xi + xgap*q.startPoint.x, yi + ygap*q.startPoint.y];
                const [xe, ye] = [xi + xgap*q.endPoint.x, yi + ygap*q.endPoint.y];
                Ui.Utils.DrawLine(ctx, xs, ys, xe, ye);
            });
        }
        else
        {
            const ExUi = Ui.ExaminerWorkspaceUi;
            const parts = Utils.SortPartsByGridPosition(app.examiner.parts);
            for (let i = 0; i < parts.length; i++) { parts[i].color = ExUi.PartColors[i%ExUi.PartColors.length]; }
            parts.forEach( part => {
                ctx.strokeStyle = part.color;
                part.getQuanta().forEach( q => {
                    const [xs, ys] = [xi + xgap*q.startPoint.x, yi + ygap*q.startPoint.y];
                    const [xe, ye] = [xi + xgap*q.endPoint.x, yi + ygap*q.endPoint.y];
                    Ui.Utils.DrawLine(ctx, xs, ys, xe, ye);
                });
            });
        }
    
        ctx.strokeStyle = 'black';
        ctx.lineWidth = "1";
    }

};