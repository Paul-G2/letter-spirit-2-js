/**
 * @classdesc
 * This class draws the codelet banner.
 * 
 */
Ui.CodeletBannerUi = class {

    /**
     * @constructor
     * 
     * @param {MainUi} mainUi - The parent Ui.
     * @param {HTMLElement} parentDiv - The html div that hosts this ui.
     */
    constructor(mainUi, parentDiv) 
    { 
        this.mainUi = mainUi;
        this.parentDiv = parentDiv;
        this.app = mainUi.app;

        this.drawParams = {};
        this.bkgndColor = '#dddddd';
        
        // Create the main div
        this.mainDiv = Ui.Utils.CreateElement('div', 
            'input-div', parentDiv, {top:'0%', left:'0%', width:'100%', height:'100%',
            border:'1px solid black', background:this.bkgndColor}); 

        this.canvas = Ui.Utils.CreateElement('canvas', 'banner-canvas', 
            parentDiv, {position:'absolute', top:'0%', left:'0%', width:'100%', height:'100%', 
            border: '1px solid', background:this.bkgndColor});
    }


    /**
     * Updates the UI.
     */
    redraw()
    {
        const canvas = this.canvas;
        const ctx = canvas.getContext("2d");
        const dp = this.drawParams;

        // Maybe update the drawParams
        if ( !Ui.Utils.RightsizeCanvas(canvas) ) { return; }
        if ( Ui.Utils.NeedToRescale(dp, ctx) && !this.updateDrawParams(ctx)) { return; }

        // Re-draw all the graphics
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Thermometer
        this.drawThermometer(ctx, dp);

        // Header text
        let headerText = '';
        const currentCodelet = this.app.coderack.currentCodelet;
        if (currentCodelet) {
            headerText = currentCodelet.owner.name.slice(0,-2) + 'ing ' + this.app.subject;
            if (currentCodelet.owner.name == 'Drafter') { headerText = headerText.replace('drafted ', ''); }
        }
        ctx.font = dp.headerFont;
        ctx.textAlign = "center";
        ctx.fillStyle = '#000000';
        ctx.fillText(headerText, ...dp.headerTextLoc);

        // Codelet title
        ctx.font = dp.codeletTitleFont;
        ctx.fillStyle = '#000000';
        ctx.fillText((currentCodelet?.titleText || ''), ...dp.titleTextLoc);

        // Codelet message 1
        ctx.font = dp.codeletMsg1Font;
        ctx.fillStyle = '#000000';
        ctx.fillText((currentCodelet?.messageText1 || ''), ...dp.codeletMsg1TextLoc);

        // Codelet message 2;
        ctx.font = dp.codeletMsg2Font;
        ctx.fillStyle = '#000000';
        ctx.fillText((currentCodelet?.messageText2 || ''), ...dp.codeletMsg2TextLoc);

        const [cw, ch] = [canvas.width, canvas.height];
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
        Ui.Utils.DrawLine(ctx, 0, ch-1, cw-1, ch-1);        
    }

    /**
     * Draws the thermometer.   
     * 
     */
    drawThermometer(ctx, dp)
    {
        if (this.app.stage !== 'buildingTF') { return; }
        const temperatureVal = Math.max(0, Math.min(100, this.app.activeModule.temperature.toFixed(0)));

        // Bulb
        ctx.lineWidth = 1;
        ctx.fillStyle = "#ff8080";
        ctx.strokeStyle = 'black';
        ctx.beginPath();
        ctx.arc(dp.bulbCtr.x, dp.bulbCtr.y, dp.bulbRadius, 0, 2*Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(dp.bulbCtr.x, dp.bulbCtr.y, dp.bulbRadius, 4.249, 5.176, true);
        ctx.stroke();

        // Stem
        ctx.fillStyle = '#ff8080';
        ctx.strokeStyle = 'black';
        ctx.clearRect(...dp.hgRect);
        const ht = (dp.hgRect[3]-1)*(temperatureVal/100);
        ctx.fillRect(dp.hgRect[0], dp.hgRect[1]+dp.hgRect[3]-ht, dp.hgRect[2], ht);
        Ui.Utils.DrawLine(ctx, ...dp.hgLeftLine);
        Ui.Utils.DrawLine(ctx, ...dp.hgRightLine);
               
        // Value
        ctx.font = dp.tempFont;
        ctx.textAlign = 'left';
        ctx.fillStyle = 'black';
        ctx.fillText(temperatureVal.toString(), ...dp.tempTextLoc);         
        
        // Endcap
        ctx.beginPath();
        ctx.arc(dp.bulbCtr.x, dp.bulbCtr.y-dp.stemLength, dp.stemRadius, 0, Math.PI, true);
        ctx.stroke();

        // Tick marks
        dp.tickMarks.forEach(t => Ui.Utils.DrawLine(ctx, ...t));
    }


    /** 
     * Recalculates the drawing parameters for this object.
     * @private
     */
    updateDrawParams(ctx)
    {
        const [cw, ch] = [ctx.canvas.width, ctx.canvas.height];
        if ((cw < 1) || (ch < 1)) { return false; }

        const dp = this.drawParams;
        [dp.canvWidth, dp.canvHeight] = [cw, ch];
  
        // Bulb
        dp.bulbRadius = 0.07*ch;
        dp.bulbCtr = {x:3*dp.bulbRadius, y:0.85*ch};
        dp.stemLength = 0.74*ch;
        dp.stemRadius = dp.bulbRadius/2;

        // Thermometer tickmarks
        let y = dp.bulbCtr.y - 1.5*dp.bulbRadius;
        let dy = (dp.stemLength - 1.5*dp.bulbRadius)/8;
        let xa = dp.bulbCtr.x + dp.stemRadius;
        let xb1 = xa + dp.stemRadius;
        let xb2 = xa + 1.7*dp.stemRadius;
        dp.tickMarks = [];
        for (let i=0; i<9; i++) {
            dp.tickMarks.push([xa, y, ((i%4 == 0) ? xb2 : xb1), y]);
            y -= dy;
        }

        // Thermometer stem
        y = dp.bulbCtr.y;
        let x = dp.bulbCtr.x - dp.stemRadius;
        dp.hgRect = [x, y-dp.stemLength, 2*dp.stemRadius, dp.stemLength];
        dp.hgLeftLine = [x, y-0.866*dp.bulbRadius, x, y-dp.stemLength];
        x += 2*dp.stemRadius;
        dp.hgRightLine = [x, y-0.866*dp.bulbRadius, x, y-dp.stemLength];  

        // Thermometer text
        const tempFontSize = Math.round(Math.min(0.028*cw, 0.14*ch));
        dp.tempFont = 'italic ' + tempFontSize.toString() + 'px Arial';
        dp.tempTextLoc = [dp.bulbCtr.x + 1.5*dp.bulbRadius, ch/2 + 0.5*tempFontSize]; 

        // Info bar
        let textCenterX = cw/2; //(cw + dp.bulbCtr.x + 2.5*dp.bulbRadius)/2;
        let fontSize = Math.round(Math.min(0.036*cw, 0.20*ch));
        dp.headerTextLoc = [textCenterX, 0.20*ch];        
        dp.headerFont ='bold ' + fontSize.toString() + 'px Courier New';
        
        // Codelet title
        fontSize = Math.round(0.85 * fontSize);
        dp.titleTextLoc = [textCenterX, 0.43*ch];        
        dp.codeletTitleFont ='normal ' + fontSize.toString() + 'px Courier New';

        // Codelet message1
        fontSize = Math.round(0.95 * fontSize);
        dp.codeletMsg1TextLoc = [textCenterX, 0.66*ch];        
        dp.codeletMsg1Font ='normal ' + fontSize.toString() + 'px Courier New';

        // Codelet message2
        dp.codeletMsg2TextLoc = [textCenterX, 0.89*ch];        
        dp.codeletMsg2Font ='normal ' + fontSize.toString() + 'px Courier New';      

        return true;
    }

};
