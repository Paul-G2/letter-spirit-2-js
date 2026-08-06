/**
 * @classdesc
 * This class is responsible for drawing the Examiner workspace.
 * 
 */
Ui.ExaminerWorkspaceUi = class {

    static PartColors = ['#2538dd', '#e7298a', '#1b9e77', '#d95f02', '#7570b3', '#e6ab02', '#ff0000', '#404040'];

    /**
     * @constructor
     * @param {MainUi} parentUi - The parent Ui.
     * @param {HTMLElement} parentDiv - The html div that hosts this ui.
     */
    constructor(parentUi, parentDiv) 
    { 
        this.parentUi = parentUi;
        this.parentDiv = parentDiv;

        this.exmr = parentUi.app.examiner;
        this.labelDrawParams = {};
        this.gridDrawParams = {};
        this.activDrawParams = {};

        this.bkgndColor  = '#f6f6f6';
        this.gridAreaBkgndColor  = '#f6f6f6';
        this.roleBkgndColor = '#fffbcc';
        this.wholeBkgndColor = '#fff9a8';
        this.posActivColor = '#000070';
        this.negActivColor = '#ff0000';
        this.activTitleColor = '#707070';

        this.activNodeInfo = 
            Object.values(Roles).map(role => {return {id:role.name, shortName:role.shortName};} ).concat(
            Wholes.Names.map(wholeName => {return {id:wholeName, shortName:wholeName};} ));

        this.buildUi(parentDiv);  
    }


    /**
     * Creates the ui elements.
     * @private
     */
    buildUi()
    {
        this.mainDiv = Ui.Utils.CreateElement('div', 'exmr-workspace-main-div', this.parentDiv, 
            {position:'absolute', top:'0%', left:'0%', width:'100%', height:'100%', background:this.bkgndColor});     

        this.topDiv = Ui.Utils.CreateElement('div', 'exmr-workspace-top-div', this.mainDiv, 
            {position:'absolute', top:'0%', left:'0%', width:'100%', height:'52%', background:this.bkgndColor});     

        this.bottomDiv = Ui.Utils.CreateElement('div', 'exmr-workspace-btm-div', this.mainDiv, 
            {position:'absolute', bottom:'0%', left:'0%', width:'100%', height:'48%', background:this.bkgndColor});     

        this.labelsDiv = Ui.Utils.CreateElement('div', 'exmr-labels-div', this.topDiv, 
            {position:'absolute', top:'0%', left:'0%', width:'81.25%', height:'100%',
            border: '1px solid', borderTop:'none', borderRight:'none', zIndex:1, overflowX:'scroll', overflowY:'auto'});

        this.labelsCanvas = Ui.Utils.CreateElement('canvas', 'exmr-labels-canvas', this.labelsDiv, 
            {position:'absolute', top:'0%', left:'0%', width:'200%', height:'100%', background:this.bkgndColor}
        );

        this.gridCanvas = Ui.Utils.CreateElement('canvas', 'exmr-grid-canvas', this.topDiv, 
            {position:'absolute', top:'0%', left:'81.25%', width:'18.75%', height:'100%', 
            border: '1px solid', borderTop:'none', background:this.bkgndColor, zIndex:1}
        );

        this.activCanvas = Ui.Utils.CreateElement('canvas','acts-canvas', this.bottomDiv, 
            {position:'absolute', margin:'0', padding:'0', top:'0%', left:'0%', width:'100%', height:'100%', 
            border: '1px solid', background:this.roleBkgndColor}
        ); 
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
        const ExUi = Ui.ExaminerWorkspaceUi;
        const sortedParts = Utils.SortPartsByGridPosition(this.exmr.parts);
        for (let i = 0; i < sortedParts.length; i++) { sortedParts[i].color = ExUi.PartColors[i%ExUi.PartColors.length]; }

        this.redrawLabelArea(sortedParts);
        this.redrawGridArea(sortedParts);
        this.redrawActivationsArea();
    }


    /**
     * Updates the label area.
     */
    redrawLabelArea(parts)
    {
        const canvas = this.labelsCanvas;
        const ctx = canvas.getContext("2d");
        const exmr = this.exmr;
        const dp = this.labelDrawParams;
        
        // Maybe update the drawParams
        if ( !Ui.Utils.RightsizeCanvas(canvas) ) { return; }
        if ( Ui.Utils.NeedToRescale(dp, ctx) && !this.updateLabelDrawParams(ctx)) { return; }

        // Start fresh
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = this.bkgndColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.textAlign = "left";
        parts = parts.filter(part => part.numLabels() > 1).concat(parts.filter(part => part.numLabels() <= 1)); // Labeled parts first
        for (let i = 0; i < parts.length; i++) { 
            let j;
            const part = parts[i];
            ctx.font = dp.labelFont;
            ctx.fillStyle = part.color;
            const labels = part.labels.toSorted((a,b) => a.text.localeCompare(b.text));
            for (j=0; j<labels.length; j++) {
                ctx.fillText(labels[j].toString(), dp.textStart[0] + dp.columnSkip*i, dp.textStart[1] + dp.lineSkip*j);
            }
            if (exmr.solution) {
                const partRoleName = exmr.solution?.partRoleMap?.get(part)?.role.name || '?';
                ctx.font = dp.partRoleFont;
                ctx.fillText(partRoleName.replaceAll('_', '-'), dp.textStart[0] + dp.columnSkip*i, dp.textStart[1] + dp.lineSkip*(j+1.5)); 
            }
            else {
                const activatedRoles = Object.values(Roles).filter(role => exmr.roleActivations[role.name] > 0);
                let roleScores = activatedRoles.map(role => Utils.CalcRoleScoreForPart(part, role, exmr));
                roleScores = roleScores.filter(item => item.score > 0).toSorted((a,b) => b.score - a.score);
                ctx.font = dp.tentativePartRoleFont;
                for (let k=0; k<Math.min(roleScores.length, 3); k++) {
                    ctx.fillStyle = Ui.Utils.ChangeColor(part.color, 40*(k+1));
                    const roleStr = roleScores[k].role.name.replaceAll('_', '-') + '?';
                    ctx.fillText(roleStr, dp.textStart[0] + dp.columnSkip*i, dp.textStart[1] + dp.lineSkip*(j+k+1));
                }
            }
        }
    }

    
    /** 
     * Recalculates the drawing parameters for the labels area.
     * @private
     */
    updateLabelDrawParams(ctx)
    {
        const [cw, ch] = [ctx.canvas.width, ctx.canvas.height];
        if ((cw < 1) || (ch < 1)) { return false; }

        const dp = this.labelDrawParams;
        [dp.canvWidth, dp.canvHeight] = [cw, ch];        
        
        let fontSize = Math.round(Math.min(0.009*cw, 0.036*ch));
        dp.textStart = [0.0125*cw, 0.065*ch];    
        dp.lineSkip = fontSize*1.3;    
        dp.columnSkip = fontSize*17;   
        dp.labelFont ='normal ' + fontSize.toString() + 'px Courier New';
        dp.partRoleFont ='italic bold ' + Math.round(1.5*fontSize).toString() + 'px Arial';
        dp.tentativePartRoleFont ='italic bold ' + Math.round(1.25*fontSize).toString() + 'px Arial';

        return true;
    }

    
    /**
     * Updates the Activations area.
     * 
     */
    redrawActivationsArea()
    {
        const canvas = this.activCanvas;
        const ctx = canvas.getContext("2d");
        const dp = this.activDrawParams;
        const roleActs = this.exmr.roleActivations;
        const wholeActs = this.exmr.wholeActivations;

        // Maybe update the draw parameters
        if ( !Ui.Utils.RightsizeCanvas(canvas) ) { return; } 
        if ( Ui.Utils.NeedToRescale(dp, ctx) && !this.updateActivDrawParams(ctx)) { return; }
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw the title 
        ctx.font = dp.titleFont;
        ctx.textAlign = "center";
        ctx.fillStyle = this.activTitleColor;
        ctx.fillText(dp.title, dp.titleX, dp.titleY);
        
        // Draw the blobs and their labels
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'black'; 
        ctx.textAlign = "center";
        
        for (let r=0; r<dp.nRows; r++) {
            for (let c=(r==0 ? dp.initialSkip : 0); c<dp.nCols; c++) {
                const n = r*dp.nCols + c - dp.initialSkip;
                const node = this.activNodeInfo[n];     
                if (!node) { continue; }      

                // Erase the previous blob and draw the new one
                const cc = dp.circleCoords[c][r];
                const sq = dp.squareCoords[c][r];
                const act = (node.id.length === 2) ? wholeActs[node.id] : roleActs[node.id];
                const radius = Math.max(2, dp.maxRadius * Math.abs(act)/100);    
                ctx.fillStyle = (node.id.length === 2) ? this.wholeBkgndColor : this.roleBkgndColor;           
                ctx.fillRect(sq.x, sq.y, sq.w, sq.h);
                ctx.fillStyle = (act >= 0) ? this.posActivColor : this.negActivColor; 
                ctx.beginPath();
                ctx.arc(cc.x, cc.y, radius, 0, 2*Math.PI);
                ctx.fill();

                // Draw the label
                ctx.font = 'italic ' + dp.labelFontSize.toString() + 'px serif';
                ctx.fillStyle = '#101010';
                const tc = dp.textCoords[c][r];
                ctx.fillText(node.shortName, tc.x, tc.y);
            }
            
        }

        // Draw the grid
        for (let r=0; r<dp.nRows; r++) {
            const y = Math.round(dp.cellHeight*(r+1)) + 0.5;
            Ui.Utils.DrawLine(ctx, 0, y, dp.canvasWidth, y);
            for (let c=(r==0 ? dp.initialSkip : 0); c<dp.nCols; c++) {
                const x = Math.round(dp.cellWidth*(c+1)) + 0.5;
                Ui.Utils.DrawLine(ctx, x, (c < dp.initialSkip-1) ? dp.cellHeight : 0, x, dp.canvasHeight);
            }
        }
    }


    /** 
     * Recalculates the drawing parameters for the activations area.
     * @private
     */
    updateActivDrawParams(ctx)
    {
        const [w, h] = [ctx.canvas.width, ctx.canvas.height];
        if ((w < 1) || (h < 1)) { return false; }

        const dp = this.activDrawParams;
        dp.canvasWidth = w;  dp.canvasHeight = h;
    
        // Grid params
        const nRows = dp.nRows = 5;
        const nCols = dp.nCols = 16;
        dp.cellHeight = h/nRows;
        dp.cellWidth = w/nCols;
        const mr = dp.maxRadius = 0.5*Math.min(dp.cellWidth, 0.7*dp.cellHeight) - 1;
        dp.initialSkip = nRows * nCols - this.activNodeInfo.length;

        // Title params
        const title = dp.title ='Activations';
        dp.titleFontSize = Math.min(0.9*dp.cellHeight, 1.7*(dp.initialSkip*dp.cellWidth/title.length));
        dp.labelFontSize = Math.min(0.7*(dp.cellHeight - 2*mr), 0.21*dp.cellWidth);
        dp.titleFont = 'italic bold ' + dp.titleFontSize.toString() + 'px Arial';
        ctx.font = dp.titleFont;
        let titleHeight = ctx.measureText(title).actualBoundingBoxAscent;
        dp.titleX = (dp.initialSkip/2) * dp.cellWidth;
        dp.titleY = dp.cellHeight/2 + 0.5*titleHeight;

        dp.circleCoords = new Array(nCols);
        dp.squareCoords = new Array(nCols);
        dp.textCoords = new Array(nCols);
        for (let c=0; c<nCols; c++) { 
            dp.circleCoords[c] = new Array(nRows); 
            dp.squareCoords[c] = new Array(nRows);
            dp.textCoords[c] = new Array(nRows);
        }

        for (let r=0; r<nRows; r++) {
            for (let c=0; c<nCols; c++) {
                const tx = c*dp.cellWidth;
                const ty = r*dp.cellHeight;
                const cx = (c + 0.5) * dp.cellWidth;
                const cy = r*dp.cellHeight + dp.maxRadius + 2;
                dp.circleCoords[c][r] = {x:cx, y:cy};
                dp.squareCoords[c][r] = {x:tx, y:ty, w:dp.cellWidth, h:dp.cellHeight};
                dp.textCoords[c][r] = {x:cx, y:(r+1)*dp.cellHeight - dp.labelFontSize/2}; 
            }
        }
        return true;
    }


    /**
     * Updates the letter grid.
     */
    redrawGridArea(parts)
    {
        const canvas = this.gridCanvas;
        const ctx = canvas.getContext("2d");
        const dp = this.gridDrawParams;

        // Maybe update the drawParams
        if ( !Ui.Utils.RightsizeCanvas(canvas) ) { return; }
        if ( Ui.Utils.NeedToRescale(dp, ctx) && !this.updateGridDrawParams(ctx)) { return; }

        if (Object.keys(dp).length == 0) { return; }

        // Clear the canvas
        ctx.fillStyle = this.gridAreaBkgndColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw grid lines
        ctx.lineWidth = "3";
        ctx.strokeStyle = "#c8c8c8"; 
        const gap = dp.gridSpacing;
        Array.from({length: 56}, (e, i)=> i).forEach( iq => {
            const q = QuantaList[iq];
            const [xs, ys] = [dp.gridStartX + gap*q.startPoint.x, dp.gridStartY + gap*q.startPoint.y];
            const [xe, ye] = [dp.gridStartX + gap*q.endPoint.x,   dp.gridStartY + gap*q.endPoint.y];
            Ui.Utils.DrawLine(ctx, xs, ys, xe, ye);
        });

        // Draw quanta
        const prevLineCap = ctx.lineCap;
        ctx.lineWidth = Math.max(1, Math.round(4*dp.gridDotRadius));
        ctx.lineCap = 'round';
        parts.forEach( part => {
            ctx.strokeStyle = part.color;
            part.getQuanta().forEach( q => {
                let pa = [dp.gridStartX + gap*q.startPoint.x, dp.gridStartY + gap*q.startPoint.y];
                let pb = [dp.gridStartX + gap*q.endPoint.x,   dp.gridStartY + gap*q.endPoint.y];
                Ui.Utils.DrawLine(ctx, pa[0], pa[1], pb[0], pb[1]);
            });
        });
        ctx.lineCap = prevLineCap;
    }


    /** 
     * Recalculates the drawing parameters for the letter grid.
     * @private
     */
    updateGridDrawParams(ctx)
    {
        const [cw, ch] = [ctx.canvas.width, ctx.canvas.height];
        if ((cw < 1) || (ch < 1)) { return false; }

        const dp = this.gridDrawParams;
        [dp.canvWidth, dp.canvHeight] = [cw, ch];

        // Grid 
        dp.gridLetterRect = [0, 0, cw, ch];
        dp.gridSpacing = Math.round( Math.min(dp.gridLetterRect[2]/2.5, dp.gridLetterRect[3]/6.5) );
        dp.gridStartX = Math.round(dp.gridLetterRect[0] + dp.gridLetterRect[2]/2 - dp.gridSpacing);
        dp.gridStartY = Math.round(dp.gridLetterRect[1] + dp.gridLetterRect[3]/2 - 3*dp.gridSpacing);
        dp.gridDotRadius = Math.max(1, Math.round(dp.gridSpacing/25));

        return true;
    }


};
