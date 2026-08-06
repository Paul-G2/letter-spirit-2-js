/**
 * @classdesc
 * This class draws the contents of a single level of the Thematic Focus.
 * 
 */
Ui.TfLevelUi = class 
{
    /**
     * @constructor
     * 
     * @param {DrafterWorkspaceUi} parentUi - The parent Ui.
     * @param {HTMLElement} hostDiv - The html div that hosts this ui.
     * @param {Number} fontSizeFactor - A scale factor for font size.
     * @param {ThematicFocus} tf - The Thematic Focus.
     */
    constructor(parentUi, hostDiv, fontSizeFactor, tf) 
    { 
        this.parentUi = parentUi;
        this.hostDiv = hostDiv;
        this.fontSizeFactor = fontSizeFactor;
        this.tf = tf;
        this.tfLevel = -1;
        this.drawParams = {};

        this._buildUi(hostDiv);  
    }


    /**
     * Creates the ui elements.
     * @private
     */
    _buildUi()
    {   
        this.canvas = Ui.Utils.CreateElement('canvas', 'tfLevel-canvas', this.hostDiv, 
            {position:'absolute', top:'0%', left:'0%', width:'100%', height:'100%'});
    }
    

    /*
     * Shows or hides the ui.
     */
    setShown(val) 
    {
        this.hostDiv.style.display = val ? 'block' : 'none';
    }


    /**
     * Redraws the ui.
     */
    redraw()
    {
        const dp = this.drawParams;
        const canvas = this.canvas;
        const ctx = canvas.getContext('2d');

        // // Maybe update the drawParams
        if ( !Ui.Utils.RightsizeCanvas(canvas) ) { return; }
        if ( Ui.Utils.NeedToRescale(dp, ctx) && !this.updateDrawParams(ctx)) { return; }

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let xOffset = this.redrawColumName(ctx);
        if (this.tfLevel >= 0) { 
            xOffset = this.redrawLiteralMotifs(ctx, xOffset);
            xOffset = this.redrawNonLiteralMotifs('translate_motifs', ctx, xOffset); 
            xOffset = this.redrawNonLiteralMotifs('turn_180_motifs', ctx, xOffset);
            xOffset = this.redrawNonLiteralMotifs('turn_90_motifs', ctx, xOffset);
            xOffset = this.redrawNonLiteralMotifs('turn_45_motifs', ctx, xOffset);
            xOffset = this.redrawRules(ctx, xOffset);
            xOffset = this.redrawNormViolations(ctx, xOffset);
        }
    }


    /**
     * Draws the column name.
     */
    redrawColumName(ctx)
    {
        const dp = this.drawParams;
        ctx.font = dp.levelNameFont;
        ctx.fillStyle = 'black';
        ctx.textAlign = 'left';

        const text = (this.tfLevel >= 0) ? Ui.DrafterWorkspaceUi.LevelNames[this.tfLevel] : '-';
        ctx.fillText(text, 0.8*dp.levelNameFontSize, dp.levelNameY);
        return dp.levelNameColWidth + 0.8*dp.levelNameFontSize;
    }


    /**
     * Draws the literal motifs.
     */
    redrawLiteralMotifs(ctx, xStart)
    {
        const dp = this.drawParams;
        const mtfSpan = 2*dp.mtfCellSize + dp.litMtfXSpacing;
        const yTop = dp.mtfYTop;        
        let xOffset = xStart;

        const litMotifs = this.tf.styProps[ThematicFocus.LevelNames[this.tfLevel]]['literal_motifs'];
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

        return xOffset + dp.litMtfXSpacing;
    }


    /**
     * Draws the non-literal motifs.
     */
    redrawNonLiteralMotifs(motifType, ctx, xStart)
    {
        const dp = this.drawParams;
        const styProps = this.tf.styProps[ThematicFocus.LevelNames[this.tfLevel]];
        const motifs = (motifType == 'turn_45_motifs') ? styProps[motifType].map(m => Ui.AdjudicatorWorkspaceUi.GetTurn45MotifVertices(m)) : 
            styProps[motifType].map(m => Ui.AdjudicatorWorkspaceUi.GetNonLiteralMotifVertices(m));
        const text = (motifType == 'turn_45_motifs') ? '45' : (motifType == 'turn_180_motifs') ? '180' : (motifType == 'turn_90_motifs') ? '90' : 'T';
        const yTop = dp.mtfYTop;  

        const prevLineCap = ctx.lineCap;
        ctx.lineCap = 'round';
        ctx.lineWidth = dp.quantaLineWidth;
        ctx.strokeStyle = 'blue';
        ctx.font = dp.mtfFont;
        ctx.fillStyle = '#707070';
        ctx.textAlign = 'center';

        const seen = new Set();
        motifs.slice().reverse().forEach((motif, i) => {
            // Avoid duplicates
            const qids = [];
            for (let j = 0; j < motif.length-1; j++) { qids.push(Quantum.FromPoints(motif[j], motif[j+1]).id); }
            const sortedQidStr = [...new Set(qids)].sort().join(',');
            if (seen.has(sortedQidStr) ) { return; }
            seen.add(sortedQidStr);

            const yVals = motif.map(p => p.y);
            const motifHeight = Math.max(...yVals) - Math.min(...yVals);
            const yStart = yTop + (4 - motifHeight)*dp.mtfCellSize/2;
            let xMax = xStart;
            let yMax = yStart;
            for (let j = 0; j < motif.length-1; j++) {
                const startPoint = motif[j];
                const endPoint = motif[j+1];
                const [xs, ys] = [xStart + dp.mtfCellSize*startPoint.x, yStart + dp.mtfCellSize*startPoint.y];
                const [xe, ye] = [xStart + dp.mtfCellSize*endPoint.x,   yStart + dp.mtfCellSize*endPoint.y];
                Ui.Utils.DrawLine(ctx, xs, ys, xe, ye);
                xMax = Math.max(xMax, xe, xs);
                yMax = Math.max(yMax, ye, ys);
            };
            ctx.fillText(text, (xStart + xMax)/2, yMax + dp.mtfCellSize*0.5 + dp.mtfFontSize);

            xStart = xMax + 2.5*dp.litMtfXSpacing;
        });
        ctx.lineCap = prevLineCap;

        return xStart;
    }


    /**
     * Draws the rules text.
     */
    redrawRules(ctx, xStart)
    {
        const dp = this.drawParams;
        const rules = this.tf.styProps[ThematicFocus.LevelNames[this.tfLevel]]['abstract_rules'].slice().reverse();  
        const lineHeight = dp.ruleFontSize * 1.2;     

        ctx.font = dp.ruleFont;
        ctx.textAlign = 'center';
        ctx.fillStyle = '#d70000';
        ctx.lineWidth = 1;
        ctx.strokeStyle = ctx.fillStyle;

        const yStart = dp.mtfYTop + dp.mtfCellSize*3 - lineHeight + dp.ruleFontSize/2;  
        for (let i = 0; i < rules.length; i++) {
            const ruleLines = Rules.RuleStrings[rules[i]];
            const maxChars = Math.max(...ruleLines.map(l => l.length));
            const textWidth = dp.ruleFontSize*maxChars;
            xStart += textWidth/2;
            for (let j = 0; j < ruleLines.length; j++) {
                ctx.fillText(ruleLines[j], xStart, yStart + j*lineHeight);
            }
            ctx.strokeRect(xStart-0.4*textWidth, yStart-lineHeight, 0.8*textWidth, 3.5*lineHeight);
            xStart += textWidth/2;
        }
        return xStart;
    }


    /**
     * Draws the norm-violation descriptions.
     */
    redrawNormViolations(ctx, xStart)
    {
        const dp = this.drawParams;
        const relNvs = this.tf.styProps[ThematicFocus.LevelNames[this.tfLevel]]['relative_nvs'].slice().reverse();  
        const v2vNvs = this.tf.styProps[ThematicFocus.LevelNames[this.tfLevel]]['val_to_val_nvs'].slice().reverse();  
        const lineHeight = dp.ruleFontSize * 1.1;     

        ctx.font = dp.nvFont;
        ctx.textAlign = 'center';
        ctx.fillStyle = '#008000';
        ctx.lineWidth = 1;
        ctx.strokeStyle = ctx.fillStyle;

        let yStart = dp.mtfYTop + dp.mtfCellSize*3 - lineHeight + dp.ruleFontSize/2;  
        relNvs.forEach((nv, i) => { 
            const lines = Array.isArray(nv[2]) ? [nv[0], nv[2][0], nv[2][1]] : [nv[0], nv[1], nv[2]];
            const maxChars = Math.max(...lines.map(l => l.toString().length));
            const textWidth = dp.nvFontSize*maxChars;
            xStart += textWidth/2;
            for (let j = 0; j < lines.length; j++) {
                ctx.fillText(lines[j], xStart, yStart + j*lineHeight);
            }
            ctx.strokeRect(xStart-0.4*textWidth, yStart-lineHeight, 0.8*textWidth, 3.5*lineHeight);
            xStart += textWidth/2;
        }); 

        ctx.fillStyle = '#8000ff';
        ctx.strokeStyle = ctx.fillStyle;
        yStart -= 0.5*lineHeight;
        v2vNvs.forEach((nv, i) => { 
            const lines = Array.isArray(nv[2][1]) ? [nv[0], nv[2][0], nv[2][1][0], nv[2][1][1]] : [nv[0], nv[1], nv[2][0], nv[2][1]];
            const maxChars = Math.max(...lines.map(l => l.toString().length));
            const textWidth = dp.nvFontSize*maxChars;
            xStart += textWidth/2;
            for (let j = 0; j < lines.length; j++) {
                ctx.fillText(lines[j], xStart, yStart + j*lineHeight);
            }
            ctx.strokeRect(xStart-0.4*textWidth, yStart-0.9*lineHeight, 0.8*textWidth, 4.3*lineHeight);
            xStart += textWidth/2;
        }); 
    }


    updateDrawParams(ctx)
    {
        const dp = this.drawParams;
        let [w, h] = [ctx.canvas.width, ctx.canvas.height];
        if ((w < 1) || (h < 1)) { return false; }

        dp.levelNameColWidth = 0.011*w;
        dp.levelNameFontSize = Math.max(6, Math.round(0.0016*w));
        dp.levelNameFont = 'normal ' + dp.levelNameFontSize + 'px Arial';
        dp.levelNameY = h/2 + dp.levelNameFontSize/2;

        dp.litMtfGridLineWidth = 1; ////////Math.max(1, 0.030*Math.min(w, h));
        dp.quantaLineWidth = 3*dp.litMtfGridLineWidth;

        dp.mtfCellSize = h/8; 
        dp.mtfXStart = dp.mtfCellSize;
        dp.litMtfXSpacing = dp.mtfCellSize;

        dp.mtfYTop = dp.mtfCellSize;
        dp.litMtfYTop = dp.mtfCellSize;

        dp.ruleFontSize = Math.round(0.9*dp.mtfCellSize) * this.fontSizeFactor;
        dp.ruleFont = 'normal ' + dp.ruleFontSize.toString() + 'px Courier New';

        dp.nvFontSize = Math.round(0.9*dp.mtfCellSize) * this.fontSizeFactor;
        dp.nvFont = 'normal ' + dp.nvFontSize.toString() + 'px Courier New';

        dp.mtfFontSize = Math.round(0.9*dp.mtfCellSize) * this.fontSizeFactor;
        dp.mtfFont = 'normal ' + dp.mtfFontSize.toString() + 'px Courier New';

        return true;
    }

}









