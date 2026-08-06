/**
 * @classdesc
 * This class draws the Adjudicator workspace.
 * 
 */
Ui.AdjudicatorWorkspaceUi = class 
{
    /**
     * @constructor
     * 
     * @param {MainUi} parentUi - The parent Ui.
     * @param {HTMLElement} parentDiv - The html div that hosts this ui.
     */
    constructor(parentUi, parentDiv) 
    { 
        this.parentUi = parentUi;
        this.parentDiv = parentDiv;
        this.adjudicator = parentUi.app.adjudicator;
        this.childUis = [];
        this.drawParams = {};

        this.bgColor = '#fffbcc';
        this.bgDark  = '#fff792';

        this._buildUi(parentDiv);  
    }


    /**
     * Creates the ui elements.
     * @private
     */
    _buildUi()
    {
        this.mainDiv = Ui.Utils.CreateElement('div', 'adj-workspace-div', this.parentDiv, 
            {position:'absolute', top:'0%', left:'0%', width:'100%', height:'100%', background:this.bgColor,
            borderLeft: '1px solid #000000'});     

        this.spCanvasDiv = Ui.Utils.CreateElement('div', 'adj-spcanvas-div', this.mainDiv, 
            {position:'absolute', top:'12px', left:'12px', bottom:'12px', right:'12px', background:this.bgColor,
            border: '1px solid #000000', overflowX:'scroll', overflowY:'auto'});     

        this.spCanvas = Ui.Utils.CreateElement('canvas', 'adj-sp-canvas', this.spCanvasDiv, 
            {position:'absolute', top:'0%', left:'0%', width:'800%', height:'100%', background:this.bgColor});
    }
    

    /*
     * Shows or hides the ui.
     */
    setShown(val) 
    {
        this.mainDiv.style.display = val ? 'block' : 'none';
    }


    /**
     * Redraws the ui.
     */
    redraw()
    {
        const dp = this.drawParams;
        const spCanvas = this.spCanvas;
        const spCtx = spCanvas.getContext('2d');

        // // Maybe update the drawParams
        if ( !Ui.Utils.RightsizeCanvas(spCanvas) ) { return; }
        if ( Ui.Utils.NeedToRescale(dp, spCtx) && !this.updateDrawParams(spCtx)) { return; }

        spCtx.clearRect(0, 0, spCanvas.width, spCanvas.height);

        this.redrawTitle(spCtx);
        this.redrawLabels(spCtx);
        this.redrawLiteralMotifs(spCtx);
        this.redrawNonLiteralMotifs('translate_motifs', spCtx); 
        this.redrawNonLiteralMotifs('turn_180_motifs', spCtx);
        this.redrawNonLiteralMotifs('turn_90_motifs', spCtx);
        this.redrawNonLiteralMotifs('turn_45_motifs', spCtx);
        this.redrawRules(spCtx);
        this.redrawNormViolations(spCtx);
    }


    redrawTitle(ctx) 
    {
        const dp = this.drawParams;
        ctx.font = dp.titleFont;
        ctx.textAlign = 'center';
        ctx.alignItems = 'end';
        ctx.fillStyle = '#909090';
        ctx.fillText('Stylistic Properties', ...dp.titlePos);
    }


    redrawLabels(ctx) 
    {
        const dp = this.drawParams;

        ctx.font = dp.lblFont;
        ctx.textAlign = 'left';
        ctx.alignItems = 'center';
        ctx.fillStyle = 'black';
        ctx.fillText('literal', ...dp.lbl0Pos);
        ctx.fillText('motifs', ...dp.lbl1Pos);

        ctx.fillText('translational', ...dp.lbl2Pos);
        ctx.fillText('motifs', ...dp.lbl3Pos);

        ctx.fillText('turn 180', ...dp.lbl4Pos);
        ctx.fillText('motifs', ...dp.lbl5Pos);

        ctx.fillText('turn 90', ...dp.lbl6Pos);
        ctx.fillText('motifs', ...dp.lbl7Pos);

        ctx.fillText('turn 45', ...dp.lbl8Pos);
        ctx.fillText('motifs', ...dp.lbl9Pos);

        ctx.fillText('rules', ...dp.lbl10Pos);

        ctx.fillText('norm', ...dp.lbl11Pos);
        ctx.fillText('violations', ...dp.lbl12Pos);
    }


    /**
     * Draws the literal motifs.
     */
    redrawLiteralMotifs(ctx)
    {
        const dp = this.drawParams;
        const mtfSpan = 2*dp.mtfCellSize + dp.litMtfXSpacing;
        const yTop = dp.litMtfYTop;  
        let xOffset = dp.mtfXStart;      

        const litMotifs = this.adjudicator.styProps['literal_motifs'];
        const seen = new Set();
        litMotifs.slice().reverse().forEach((litMotif, i) => {    
            // Avoid duplicates  
            const sortedQidStr = [...new Set(litMotif)].sort().join(',');
            if (seen.has(sortedQidStr)) { return; }
            seen.add(sortedQidStr);      
      
            // Draw the grid lines
            ctx.strokeStyle = '#aaaaaa'; 
            ctx.lineWidth = dp.litMtfGridLineWidth;
            Array.from({length: 32}, (e, j)=> j).forEach( (iq) => {
                const q = QuantaList[iq];
                const [xs, ys] = [xOffset + dp.mtfCellSize*q.startPoint.x, yTop + dp.mtfCellSize*q.startPoint.y];
                const [xe, ye] = [xOffset + dp.mtfCellSize*q.endPoint.x,   yTop + dp.mtfCellSize*q.endPoint.y];
                Ui.Utils.DrawLine(ctx, xs, ys, xe, ye);
            });

            // Draw the quanta
            const prevLineCap = ctx.lineCap;
            ctx.lineCap = 'round';
            ctx.lineWidth = dp.quantaLineWidth;
            ctx.strokeStyle  = 'blue'; 
            litMotif.forEach( iq => {
                const q = QuantaList[iq];
                const [xs, ys] = [xOffset + dp.mtfCellSize*q.startPoint.x, yTop + dp.mtfCellSize*q.startPoint.y];
                const [xe, ye] = [xOffset + dp.mtfCellSize*q.endPoint.x,   yTop + dp.mtfCellSize*q.endPoint.y];
                Ui.Utils.DrawLine(ctx, xs, ys, xe, ye);
            });
            ctx.lineCap = prevLineCap;
            xOffset += mtfSpan;
        });
    }

    /**
     * Draws the non-literal motifs.
     */
    redrawNonLiteralMotifs(motifType, ctx)
    {
        const dp = this.drawParams;
        const motifs = (motifType == 'turn_45_motifs') ? this.adjudicator.styProps[motifType].map(m => Ui.AdjudicatorWorkspaceUi.GetTurn45MotifVertices(m)) : 
            this.adjudicator.styProps[motifType].map(m => Ui.AdjudicatorWorkspaceUi.GetNonLiteralMotifVertices(m));
        const yTop = dp.mtfYTop[motifType];  

        const prevLineCap = ctx.lineCap;
        ctx.lineCap = 'round';
        ctx.lineWidth = dp.quantaLineWidth;
        ctx.strokeStyle  = 'blue';
        
        const seen = new Set();
        let xStart = dp.mtfXStart;
        motifs.slice().reverse().forEach((motif, i) => {
            // Avoid duplicates
            const qids = [];
            for (let j = 0; j < motif.length-1; j++) { qids.push(Quantum.FromPoints(motif[j], motif[j+1]).id); }
            const sortedQidStr = [...new Set(qids)].sort().join(',');
            if ( seen.has(sortedQidStr) ) { return; }
            seen.add(sortedQidStr);
            
            const yVals = motif.map(p => p.y);
            const motifHeight = Math.max(...yVals) - Math.min(...yVals);
            let xMax = xStart;
            const yStart = yTop + (4 - motifHeight)*dp.mtfCellSize/2;
            for (let j = 0; j < motif.length-1; j++) {
                const startPoint = motif[j];
                const endPoint = motif[j+1];
                const [xs, ys] = [xStart + dp.mtfCellSize*startPoint.x, yStart + dp.mtfCellSize*startPoint.y];
                const [xe, ye] = [xStart + dp.mtfCellSize*endPoint.x,   yStart + dp.mtfCellSize*endPoint.y];
                Ui.Utils.DrawLine(ctx, xs, ys, xe, ye);
                xMax = Math.max(xMax, xe, xs);
            };
            xStart = xMax + dp.litMtfXSpacing;
        });
        ctx.lineCap = prevLineCap;
    }


    redrawRules(ctx)
    {
        const dp = this.drawParams;
        const str = this.adjudicator.styProps['abstract_rules'].slice().reverse().join(', ');
        ctx.font = dp.ruleFont;
        ctx.textAlign = 'left';
        ctx.fillStyle = '#d70000';
        ctx.fillText(str, ...dp.ruleStringPos);
    }


    redrawNormViolations(ctx)
    {
        const dp = this.drawParams;

        let str = '';
        this.adjudicator.styProps['relative_nvs'].slice().reverse().forEach((nv, i) => { 
            str += (i > 0) ? ', ' : ''; 
            str += NormViols.RelativeNvToString(nv); 
        }); 
        ctx.font = dp.nvFont;
        ctx.textAlign = 'left';
        ctx.fillStyle = '#008000';
        ctx.fillText(str, ...dp.relNvStringPos);

        str = '';
        this.adjudicator.styProps['val_to_val_nvs'].slice().reverse().forEach((nv, i) => { 
            str += (i > 0) ? ', ' : ''; 
            str += NormViols.ValToValNvToString(nv); 
        }); 
        ctx.font = dp.nvFont;
        ctx.textAlign = 'left';
        ctx.fillStyle = '#8000ff';
        ctx.fillText(str, ...dp.v2vNvStringPos);
    }


    updateDrawParams(spCtx)
    {
        const dp = this.drawParams;
        let [w, h] = [spCtx.canvas.width, spCtx.canvas.height];
        if ((w < 1) || (h < 1)) { return false; }

        dp.litMtfGridLineWidth = 1; ////////Math.max(1, 0.030*Math.min(w, h));
        dp.quantaLineWidth = 3*dp.litMtfGridLineWidth;

        dp.mtfCellSize = h/40; 
        dp.lblFontSize = Math.round(0.9*dp.mtfCellSize);
        dp.lblFont = 'normal ' + dp.lblFontSize.toString() + 'px Arial';

        dp.mtfXStart = 8*dp.lblFontSize;
        dp.litMtfXSpacing = dp.mtfCellSize;

        dp.titleFontSize = Math.round(0.03*h);
        dp.titleFont = 'bold italic ' + dp.titleFontSize.toString() + 'px Arial';
        dp.titlePos = [(0.5/8)*w, 0.032*h];

        dp.mtfYTop = {};
        dp.litMtfYTop = dp.mtfYTop['literal_motifs'] = dp.titlePos[1] + dp.mtfCellSize;
        dp.lblPosX = 0.5*dp.mtfCellSize;
        dp.lbl0Pos = [dp.lblPosX, dp.litMtfYTop + 2.5*dp.mtfCellSize];
        dp.lbl1Pos = [dp.lblPosX, dp.lbl0Pos[1] + 1.2*dp.lblFontSize];

        dp.transMtfYTop = dp.mtfYTop['translate_motifs'] = 0.26*h;
        dp.lbl2Pos = [dp.lblPosX, 0.31*h];
        dp.lbl3Pos = [dp.lblPosX, dp.lbl2Pos[1] + 1.2*dp.lblFontSize];

        dp.turn180MtfYTop = dp.mtfYTop['turn_180_motifs'] = 0.415*h;
        dp.lbl4Pos = [dp.lblPosX, 0.465*h];
        dp.lbl5Pos = [dp.lblPosX, dp.lbl4Pos[1] + 1.2*dp.lblFontSize];

        dp.turn90MtfYTop = dp.mtfYTop['turn_90_motifs'] = 0.57*h;
        dp.lbl6Pos = [dp.lblPosX, 0.62*h];
        dp.lbl7Pos = [dp.lblPosX, dp.lbl6Pos[1] + 1.2*dp.lblFontSize];

        dp.turn45MtfYTop = dp.mtfYTop['turn_45_motifs'] = 0.725*h;
        dp.lbl8Pos = [dp.lblPosX, 0.775*h];
        dp.lbl9Pos = [dp.lblPosX, dp.lbl8Pos[1] + 1.2*dp.lblFontSize];

        dp.rulesYTop = 0.905*h;
        dp.lbl10Pos = [dp.lblPosX, 0.905*h];

        dp.nvsYTop = 0.97*h;
        dp.lbl11Pos = [dp.lblPosX, 0.97*h];
        dp.lbl12Pos = [dp.lblPosX, dp.lbl11Pos[1] + 1.2*dp.lblFontSize];

        dp.ruleFontSize = Math.round(0.775*dp.mtfCellSize);
        dp.ruleFont = 'normal ' + dp.ruleFontSize.toString() + 'px Courier New';
        dp.ruleStringPos = [dp.mtfXStart, 0.900*h];

        dp.nvFontSize = Math.round(0.775*dp.mtfCellSize);
        dp.nvFont = 'normal ' + dp.nvFontSize.toString() + 'px Courier New';
        dp.relNvStringPos = [dp.mtfXStart, 0.96*h];
        dp.v2vNvStringPos = [dp.mtfXStart, dp.relNvStringPos[1] + 1.7*dp.nvFontSize];

        return true;
    }


    /**
     * Converts a translate/turn-90/turn-180 motif, which is a list of compass directions, to a list of numerical vertices.
     */
    static GetNonLiteralMotifVertices(motif)
    {
        if (motif.length == 0) return [];
        const vertices = [{x:0, y:0}];
        let minX = 0, minY = 0;
        
        motif.forEach( dir => {
            const prev = vertices[vertices.length-1];
            const x = prev.x + (dir.includes('e') ? 1 : dir.includes('w') ? -1 : 0);
            const y = prev.y + (dir.includes('s') ? 1 : dir.includes('n') ? -1 : 0);
            vertices.push({x:x, y:y});
            minX = Math.min(minX, x);
            minY = Math.min(minY, y);
        });

        vertices.forEach(v => {
            v.x -= minX;
            v.y -= minY;
        });

        return vertices;
    }


    /**
     * Converts a turn-45 motif, which is a list of angles, to a list of numerical vertices.
     */
    static GetTurn45MotifVertices(motif)
    {
        if (motif.length == 0) return [];
        if (motif[0] == 'no_angle') return [{x:0, y:0}, {x:0, y:1}];
        
        const trials = [];
        const pathLengths = [0, 0];
        for (let k = 0; k < 2; k++) {
            const vertices = (k == 0) ? [{x:0, y:0}, {x:0, y:1}] : [{x:0, y:0}, {x:1, y:1}];
            pathLengths[k] = (k == 0) ? 1 : 1.4142;
            let ang1 = (k == 0) ? 180 : 135;
            
            motif.forEach( angDiff => {
                const ang2 = 180 - (angDiff - ang1);
                const ang2Rads = ang2 * Math.PI/180;
                const dx = Math.round(Math.sin(ang2Rads));
                const dy = -Math.round(Math.cos(ang2Rads));
                const prev = vertices[vertices.length-1];
                vertices.push({x:prev.x + dx, y:prev.y + dy});
                pathLengths[k] += Math.sqrt(dx*dx + dy*dy);
                ang1 = ang2;
            });
            trials.push(vertices);
        }

        let [v0xs, v0ys] = [trials[0].map(v => v.x), trials[0].map(v => v.y)];
        let [v1xs, v1ys] = [trials[1].map(v => v.x), trials[1].map(v => v.y)];
        let [v0minX, v0maxX, v0minY, v0maxY] = [Math.min(...v0xs), Math.max(...v0xs), Math.min(...v0ys), Math.max(...v0ys)];
        let [v1minX, v1maxX, v1minY, v1maxY] = [Math.min(...v1xs), Math.max(...v1xs), Math.min(...v1ys), Math.max(...v1ys)];
        let vertices;
        if ((v0maxX-v0minX > 2) && (v0maxY-v0minY > 2)) {
            vertices = trials[1];
        } else if ((v1maxX-v1minX > 2) && (v1maxY-v1minY > 2)) {
            vertices = trials[0];
        } else if (pathLengths[0] > pathLengths[1]) {
            vertices = trials[1];
        } else {
            vertices = trials[0];
        }
        let [minX, maxX, minY, maxY] = (vertices === trials[0]) ? [v0minX, v0maxX, v0minY, v0maxY] : [v1minX, v1maxX, v1minY, v1maxY];
        if ((maxX-minX) > (maxY-minY)) {
            vertices = vertices.map(v => ({x:-v.y, y:v.x}));
            let [tempX, tempY] = [minX, maxX];
            [minX, maxX] = [-maxY, -minY];
            [minY, maxY] = [tempX, tempY];
        } 
        vertices.forEach(v => {v.x -= minX;  v.y -= minY;});

        return vertices;
    }

}









