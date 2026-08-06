/**
 * @classdesc
 * This class draws the Drafter workspace.
 * 
 */
Ui.DrafterWorkspaceUi = class 
{
    static LevelNames = ['one-time', 'two-time', 'occasional', 'common', 'frequent', 'universal'];


    /**
     * @constructor
     * 
     * @param {MainUi} parentUi - The parent Ui.
     * @param {HTMLElement} hostDiv - The html div that hosts this ui.
     */
    constructor(parentUi, hostDiv) 
    { 
        this.parentUi = parentUi;
        this.hostDiv = hostDiv;
        this.bgColor = '#fffbcc';
        this.sepColor = '#eadc99';
        this.tfLevelUis = [];
        this.drawParams = {};

        this._buildUi(hostDiv);  
    }


    /**
     * Creates the ui elements.
     * @private
     */
    _buildUi()
    {
        this.mainDiv = Ui.Utils.CreateElement('div', 'drafter-workspace-div', this.hostDiv, 
            {position:'absolute', top:'0%', left:'0%', width:'100%', height:'100%', background:this.bgColor});   
            
        this.letterGridDiv = Ui.Utils.CreateElement('div', 'drafter-lettergridDiv', this.mainDiv,
            {position:'absolute', top:'0%', left:'0%', width:'100%', height:'38%', background:this.bgColor});

        this.letterGridArray = new Ui.OutputLetterArray(this, this.letterGridDiv, [13,13]);         

        this.tfTitleDiv = Ui.Utils.CreateElement('div', 'drafter-tf-title-div', this.mainDiv, 
            {position:'absolute', top:'38%', height:'3.5%', left:'0%', right:'0%', background:this.bgColor,
             display:'flex', alignItems:'end', justifyContent:'center', color:'#707070', fontFamily:'Arial', 
             fontWeight:'bold', fontStyle:'italic', fontSize: '2.0vh'}, {innerHTML:'Stylistic Properties'});     

        Ui.Utils.CreateElement('hr', 'drafter-tf-hline', this.mainDiv, 
            {position:'absolute', top:'42%', left:'0%', width:'100%', height:'2px', border:'none', background:this.sepColor}); 

        this.tfDiv = Ui.Utils.CreateElement('div', 'drafter-tf-div', this.mainDiv, 
            {position:'absolute', top:'43%', left:'0%', bottom:'0%', right:'0%', background:this.bgColor,
            overflowX:'scroll', overflowY:'scroll'});     

        // Create the TF LevelUis
        let topPct = 0;
        let heightPct = 32;
        let fontSizeFactor = 1.0;
        const shrinkFactor = 0.82;
        for (let i = 0; i < 6; i++) {
            const div = Ui.Utils.CreateElement('div', 'drafter-tf-leveldiv' + i, this.tfDiv, 
                {position:'absolute', top:''+topPct+'%', left:'0%', width:'800%', height:''+heightPct+'%'});
            this.tfLevelUis.push(new Ui.TfLevelUi(this, div, fontSizeFactor, this.parentUi.app.thematicFocus));

            Ui.Utils.CreateElement('hr', 'drafter-tf-hline', this.tfDiv, 
                {position:'absolute', top:''+(topPct+heightPct+1.5)+'%', left:'0%', width:'800%', height:'2px', 
                border:'none', background:this.sepColor}); 

            topPct += heightPct + 3;
            heightPct *= shrinkFactor;
            fontSizeFactor /= Math.sqrt(shrinkFactor);
        }
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
        // Redraw the letter grid
        this.letterGridArray.redraw();

        // Set the TF level for each tfLevelUi, and redraw
        const tf = this.parentUi.app.thematicFocus;
        const maxTfLevel = tf.maxNonEmptyLevel();
        for (let i = 0; i < 6; i++) {
            this.tfLevelUis[i].tfLevel = maxTfLevel - i;
            this.tfLevelUis[i].redraw();
        }
    }
};
