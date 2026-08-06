/**
 * @classdesc
 * This class draws the input widgets.
 * 
 */
Ui.InputUi = class {

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
        this.app = parentUi.app;

        this.inputGrids = [];
        this.drawParams = {};
        this.bgDark  = '#98d1ba';
        this.bgColor = '#b3ddcc';
        this.bgLight = '#cde9de';
        
        this._buildUi();

        this.sampleInputs = [
            [Fonts.StandardSquare.b, Fonts.StandardSquare.c, Fonts.StandardSquare.e, Fonts.StandardSquare.f, Fonts.StandardSquare.g],
            [Fonts.Boat.b, Fonts.Boat.c, Fonts.Boat.e, Fonts.Boat.f, Fonts.Boat.g],
            [Fonts.BenzeneRight.b, Fonts.BenzeneRight.c, Fonts.BenzeneRight.e, Fonts.BenzeneRight.f, Fonts.BenzeneRight.g],
            [Fonts.Close.b, Fonts.Close.c, Fonts.Close.e, Fonts.Close.f, Fonts.Close.g],
            [Fonts.Snout.b, Fonts.Snout.c, Fonts.Snout.e, Fonts.Snout.f, Fonts.Snout.g],
            [[]] 
        ];
        this.setInputLetters(this.sampleInputs[0]);
    }


    /**
     * Creates the ui elements.
     * @private
     * 
     */
    _buildUi()
    {      
        // Create the main div
        this.mainDiv = Ui.Utils.CreateElement('div', 
            'input-div', this.parentDiv, {top:'0%', left:'0%', width:'100%', height:'100%',
            border:'1px solid black', borderLeft:'none', background:this.bgColor}); 

        this.titleSpan = Ui.Utils.CreateElement('span', 'input-title-span', this.mainDiv, 
            {top:'0%', height:'4%', left:'0%', width:'100%', display:'flex', alignItems:'center', justifyContent:'center',
            color:'#666666', fontFamily:'Arial', fontWeight:'bold', fontStyle:'italic', fontSize:'1.9vh'}); 
        this.titleSpan.innerHTML = 'Input Letters';
        this.titleSpan.className += " noselect";
    
        this.inputGridsFrame = Ui.Utils.CreateElement('div', 'input-grids-frame', this.mainDiv, 
            {top:'4%', left:'3%', right:'3%', height: '60%', background:this.bgLight, border: '4px solid '+ this.bgDark,
            overflowX:'scroll', overflowY:'auto', boxSizing:'border-box'}); 
        
        const numGridsPerRow = 13;
        const numGridsPerRowVisible = 3;
        const hGapFrac = 1/4;
        const lgwBase = 100/(numGridsPerRowVisible + (numGridsPerRowVisible+1)*hGapFrac);
        const hGapBase = lgwBase * hGapFrac;
        const divWidth = lgwBase*numGridsPerRow + hGapBase*(numGridsPerRow+1);
        this.inputGridsDiv = Ui.Utils.CreateElement('div', 'input-grids-div', this.inputGridsFrame, 
            {position:'absolute', top:'0%', left:'0%', width: divWidth + '%', height:'100%',  background:this.bgLight});

        const lgw = lgwBase*(100/divWidth);
        const hGap = lgw * hGapFrac;
        for (let row=0; row<2; row++) {
            for (let i=0; i<numGridsPerRow; i++) {
                const lgDiv = Ui.Utils.CreateElement('div', 'lgdiv', this.inputGridsDiv, {position:'absolute', margin:'0', 
                    padding:'0', top:(3 + row*50)+'%', left:hGap + i*(lgw+hGap)+'%', width:lgw+'%', height:'47%'});;
                this.inputGrids.push( new Ui.InputLetterGrid(lgDiv, {editable:true, bkgndColor:this.bgLight}) );
            }
        }

        this.samplesDiv = Ui.Utils.CreateElement('div', 'samples-div', this.mainDiv, 
            {top:'65.5%', left:'3%', right:'3%', height:'8%', background:this.bgColor});

        this.sampleBtns = [];
        for (let i=0; i<6; i++) {
            const sampleBtn = Ui.Utils.CreateElement('button', 'sample' + (i+1) + '_btn', this.samplesDiv, {width:'14%', height:'50%', top:'5%', 
                left: 1+17*i + '%', border:'3px solid #666666', fontSize:'1.9vmin', fontWeight:'bold', color:'#666666', background:this.bgColor});
            sampleBtn.type = 'button';
            sampleBtn.innerHTML = (i+1).toString();
            sampleBtn.armedColor = this.bgDark;
            sampleBtn.onclick = function() { this.setInputLetters(this.sampleInputs[i]); }.bind(this);
            sampleBtn.onmousedown = function() { this.style.backgroundColor = this.armedColor; }.bind(sampleBtn);
            sampleBtn.onmouseup = function() { this.style.backgroundColor = this.parentNode.style.backgroundColor; }.bind(sampleBtn);
            sampleBtn.onmouseleave = function() { this.style.backgroundColor = this.parentNode.style.backgroundColor; }.bind(sampleBtn);
            sampleBtn.className += " noselect";
            this.sampleBtns.push(sampleBtn);
        }

        this.samplesLabel = Ui.Utils.CreateElement('span', 'samples-label-span', this.samplesDiv, 
            {top:'60%', height:'35%', left:'0%', right:'0%', display:'flex', alignItems:'center', justifyContent:'center',
            color:'#666666', fontFamily:'Arial', fontWeight:'bold', fontStyle:'italic', fontSize:'1.8vmin'}); 
        this.samplesLabel.innerHTML = 'Samples';
        this.samplesLabel.className += " noselect";


        this.ctrlsDiv = Ui.Utils.CreateElement('div', 'ctrls-div', this.mainDiv, 
            {bottom:'1.5%', left:'3%', right:'3%', height: '16%', background:this.bgColor, border:'4px solid '+ this.bgDark}); 

        this.goPauseBtn = Ui.Utils.CreateElement('button', 'go_btn', this.ctrlsDiv, 
            {width:'30%', height:'40%', top:'10%', left:'4%', border:0, background:this.bgColor});
        this.goPauseBtn.innerHTML = '<img class="button-img" src="./btn_play.png" border="0" width="100% height="auto">';
        this.goPauseBtn.onclick = function() { this.app.onGoPauseBtnClick(); }.bind(this);
        this.goPauseBtn.className += " noselect";

        this.stepBtn = Ui.Utils.CreateElement('button', 'step_btn', this.ctrlsDiv, 
            {width:'30%', height:'40%', top:'10%', left:'35%', border:0, background:this.bgColor});
        this.stepBtn.innerHTML = '<img class="button-img" src="./btn_step.png" border="0" width="100% height="auto">';
        this.stepBtn.onclick = function() { this.app.onStepBtnClick(); }.bind(this);
        this.stepBtn.className += " noselect";

        this.resetBtn = Ui.Utils.CreateElement('button', 'reset_btn', this.ctrlsDiv, 
            {width:'30%', height:'40%', top:'10%', left:'66%', border:0, background:this.bgColor});
        this.resetBtn.innerHTML = '<img class="button-img" src="./btn_reset.png" border="0" width="100% height="auto">';
        this.resetBtn.onclick = function() { this.app.onResetBtnClick(); }.bind(this);
        this.resetBtn.className += " noselect";

        this.speedSlider = Ui.Utils.CreateElement('input', 'speed_slider', this.ctrlsDiv, 
            {width:'86%', height:'24%', top:'55%', left:'7%',accentColor:'black'}, {type:'range', min:1, max:100, value:100});
        this.speedSlider.draggable = true;
        this.speedSlider.ondragstart = function(e) { e.preventDefault(); e.stopImmediatePropagation(); };
        this.speedSlider.oninput = this._onSpeedSliderChange.bind(this);
        this.speedSlider.className += " noselect";

        this.speedSliderLabel = Ui.Utils.CreateElement('span', 'speed-slider-label', this.ctrlsDiv, 
            {width:'100%', height:'24%', top:'75%', left:'0%', display:'flex', alignItems:'center', justifyContent:'center', 
            fontStyle:'italic', fontWeight:'bold', fontFamily:'Arial', fontSize:'2vh', color:'#606060'});

        this.speedSliderLabel.innerHTML = 'Speed';
        this.speedSliderLabel.className += " noselect";
        this.mainDiv.className += " noselect";

        // Message area
        this.messageDiv = Ui.Utils.CreateElement('div','message-div', this.mainDiv,
            {bottom:'18%', left:'3%', right:'3%', height:'7%', display:'flex', alignItems:'center', justifyContent:'center', 
            fontFamily:'serif', fontWeight:'bold', fontStyle: 'italic', fontSize: '3vmin', color:'#d20000'}); 
        this.messageDiv.className += " noselect";   
    }


    /*
     * Sets the input letters.
     */
    setInputLetters(lettersAsQuanta) 
    { 
        this.inputGrids.forEach( lg => lg.setOnQuanta([]) );

        const numLetters = lettersAsQuanta.length;
        const halfNumLetters = Math.ceil(numLetters/2);
        for (let i=0; i<numLetters; i++) {
            const offset = (i >= halfNumLetters) ? 13 - halfNumLetters : 0;
            this.inputGrids[i+offset].setOnQuanta(lettersAsQuanta[i]);
        }
        this.inputGrids.forEach( lg => lg.redraw() );
    }

    
    /*
     * Gets the input letters from the UI, as a list of GridLetter objects.
     */
    getInputLetters() 
    { 
        const letters = [];
        for (let grid of this.inputGrids) {
            if (grid.onQuanta.length > 0) { 
                letters.push( new GridLetter(grid.onQuanta) );
            }
        }
        return letters;
    }

    

    /**
     * Displays a temporary message beneath the input widgets.
     */ 
    displayMessage(msg)
    {
        this.messageDiv.innerHTML = msg;
        setTimeout(() => {this.messageDiv.innerHTML = '';}, 2500);
    }


    /**
     * Updates the UI.
     * 
     */
    redraw()
    {
        // Redraw the input grids
        this.inputGrids.forEach( lg => lg.setExmrInfo('', []) );
        const numInputLetters = this.app.inputLetters.length;
        const halfNumInputLetters = Math.ceil(numInputLetters/2);
        
        let solnIndex = -1;
        for (let grid of this.inputGrids) {
            if (grid.onQuanta.length > 0) { 
                solnIndex += 1;
                const exmrSolution = this.app.exmrSolutions[solnIndex];
                const labelText = !exmrSolution ? '' : (exmrSolution.isGuess ? '?' : exmrSolution.wholeName[0]); 
                grid.setExmrInfo(labelText, exmrSolution?.parts);
            }
        }
        this.inputGrids.forEach( lg => {lg.redraw();} );

        // Enable/disable buttons
        const setEnabled = function(ctrl, enabled) { ctrl.disabled = !enabled;  ctrl.style.opacity = enabled ? '1.0' : '0.4'; };
        [this.stepBtn, this.goPauseBtn, this.resetBtn].forEach( ctrl => setEnabled(ctrl, true) );
        switch (this.app.exeState) {
            case 'ready':
                setEnabled(this.samplesLabel, true);
                this.sampleBtns.forEach(btn => setEnabled(btn, true));
                this.inputGrids.forEach(grid => grid.setEditable(true));
                this.goPauseBtn.children[0].src = './btn_play.png'; 
                break;
            case 'paused':
                setEnabled(this.samplesLabel, false);
                this.sampleBtns.forEach(btn => setEnabled(btn, false));
                this.inputGrids.forEach(grid => grid.setEditable(false));
                this.goPauseBtn.children[0].src = './btn_play.png'; 
                break;
            case 'running':
                setEnabled(this.stepBtn, false);
                setEnabled(this.resetBtn, false);
                setEnabled(this.samplesLabel, false);
                this.sampleBtns.forEach(btn => setEnabled(btn, false));
                this.inputGrids.forEach(grid => grid.setEditable(false));
                this.goPauseBtn.children[0].src = './btn_pause.png'; 
                break;
            case 'done':
                setEnabled(this.goPauseBtn, false);
                setEnabled(this.stepBtn, false);
                setEnabled(this.resetBtn, true);
                setEnabled(this.samplesLabel, false);
                this.sampleBtns.forEach(btn => setEnabled(btn, false));
                this.inputGrids.forEach(grid => grid.setEditable(false));
                this.goPauseBtn.children[0].src = './btn_play.png'; 
                break;
            default:
                break;
        }

        const buttonImgs = this.mainDiv.getElementsByClassName("button-img");
        const landscapey = (buttonImgs[0].parentNode.clientHeight < buttonImgs[0].parentNode.clientWidth);
        for (let img of buttonImgs) {               
            img.style.width  = landscapey ? 'auto' : '100%';
            img.style.height = landscapey ? '100%' : 'auto';
        }
    }


    /**
     * Handler for speed-slider changes.
     * @private
     */
    _onSpeedSliderChange()
    {
        const sv = this.speedSlider.value;
        const delay = (sv == this.speedSlider.max) ? 0 : 1000/(1 + sv*sv/100);
        this.app.stepDelay = delay;
    }
};
