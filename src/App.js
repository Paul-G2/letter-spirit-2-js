/**
 * @classdesc
 * This is the main class for the Letter Spirit II app. 
 * 
 */
 class App 
 {
    /**
     * @constructor
     * @param {Number} [randSeed=42] - A seed value for the random number generator.
     * @param {Boolean} [omitGui=false] - Whether to omit the GUI. (Set to true during unit tests.)
     */
    constructor(args = {randSeed:42, omitGui:false}) 
    { 
        this.randGen       = new RandGen(args.randSeed);
        this.reporter      = new Reporter();
        this.coderack      = new Coderack(this);
        this.thematicFocus = new ThematicFocus(this);
        this.library       = new Library(this);
        this.examiner      = new Examiner(this);
        this.adjudicator   = new Adjudicator(this);
        this.drafter       = new Drafter(this);
        this.exmrSolutions = [];
        this.adjSolutions  = [];
        this.inputLetters  = [];
        this.inputLetterIndex = 0;

        // Exe-state management
        this.stage        = 'buildingTF'; 
        this.subject      = '';
        this.exeState     = 'ready'; // 'ready, 'running', 'paused', or 'done'
        this.activeModule = this.examiner;
        this.pausePending = false;
        this.stepTimerId  = undefined;
        this.stepDelay    = Params.InitialStepDelay;

        // Maybe create a UI and start its animation loop
        if (!args.omitGui) {
            this.ui = new Ui.MainUi(this); 
            this.infoDialog = new Ui.InfoDialog(document.getElementById('app_area')); 
            this.ui.startAnimationLoop();            
        }
    }


    /**
     * Resets the app to its initial state
     */
    reset()
    {
        // Reset sub-objects 
        this.examiner.reset();
        this.adjudicator.reset(); 
        this.drafter.reset();
        this.coderack.reset();
        this.coderack.numCodeletsGrandTotal = 0;
        this.thematicFocus.reset();
        this.library.clear();
        this.exmrSolutions = [];
        this.adjSolutions  = [];
        this.inputLetters  = [];
        this.inputLetterIndex = 0;
        Motif.ClearSublistsCache();

        this.stage        = 'buildingTF';
        this.subject      = '';
        this.activeModule = this.examiner;
        this.exeState     = 'ready';
        this.pausePending = false;
        clearTimeout(this.stepTimerId);
        this.stepTimerId  = undefined;
    }
    
    
    /**
     * Handler for go/pause button clicks.
     */
    onGoPauseBtnClick()
    {
        this.infoDialog?.hide();
        if (this.exeState == 'ready')
        { 
            // ready -> running
            this.reset(); 
            this.exeState = 'running';
            this.inputLetters = this.ui?.inputUi.getInputLetters() || [];
            const firstLetter = this.inputLetters[0];
            if (firstLetter && !firstLetter.isEmpty()) {
                this.subject = 'input letter #1';
                this.examiner.setCompletionCallback(this.onExaminerDone.bind(this));
                this.examiner.start(firstLetter);
            } else {
                this.stage = 'drafting';
                this.drafter.setCompletionCallback(this.onDrafterDone.bind(this));
                this.drafter.start(this.adjSolutions);
            }
        }
        else if (this.exeState == 'running') 
        { 
            // running -> paused
            this.pausePending = true;
        }
        else if (this.exeState == 'paused') 
        { 
            // paused -> running
            this.exeState = 'running';
            this.pausePending = false;
            this.activeModule.codeletLoop();
        }   
    }

    
    /**
     * Handler for single-step button clicks.
     */
    onStepBtnClick()
    {
        this.infoDialog?.hide();
        if (this.exeState == 'ready') { 
            this.reset();
            this.exeState = 'running';
            this.pausePending = true;
            this.inputLetters = this.ui? this.ui.inputUi.getInputLetters() : [[]];
            const firstLetter = this.inputLetters[0] || null;
            if (firstLetter && !firstLetter.isEmpty()) {
                this.subject = 'input letter #1';
                this.examiner.setCompletionCallback(this.onExaminerDone.bind(this));
                this.examiner.start(firstLetter);
            } else {
                this.stage = 'drafting';
                this.drafter.setCompletionCallback(this.onDrafterDone.bind(this));
                this.drafter.start(this.adjSolutions);
            }
        }
        else if (this.exeState == 'paused') 
        {
            this.exeState = 'running';
            this.pausePending = true;
            this.activeModule.codeletLoop();            
        }
    }
    
    
    /**
     * Handler for reset button clicks.
     */
    onResetBtnClick()
    {
        this.infoDialog?.hide();
        this.reset();
    }


    /**
     * Handler for examiner completion.
     */
    async onExaminerDone(examiner)
    {
        // Cache the Examiner solution
        this.exmrSolutions.push(this.examiner.solution);
        await new Promise(resolve => setTimeout(resolve, (this.ui ? 1500 : 0))); 

        // Proceed to adjudicating
        this.adjudicator.setCompletionCallback(this.onAdjudicatorDone.bind(this));
        this.adjudicator.start(this.examiner.inputGridLetter, this.examiner.solution);
    }


    /**
     * Handler for adjudicator completion.
     */ 
    onAdjudicatorDone(adj)
    {
        if (!adj.failed) {
            // Cache the Adjudicator solution
            this.adjSolutions.push({cat:adj.input.wholeName[0], qidList:adj.input.gridLetter.quantaIds.slice()});

            // Update the Thematic Focus
            adj.updateTf();
        }
 
        // Examine the next input letter or proceed to drafting
        const idx = ++this.inputLetterIndex;
        if (idx < this.inputLetters.length) {  
            this.subject = 'input letter #' + (idx + 1);
            this.examiner.setCompletionCallback(this.onExaminerDone.bind(this));
            this.examiner.start(this.inputLetters[idx]);
        }
        else {  
            this.stage = 'drafting';
            this.drafter.setCompletionCallback(this.onDrafterDone.bind(this));
            this.drafter.start(this.adjSolutions);
        }
    }


    /**
     * Handler for drafter completion.
     */
    onDrafterDone(drafter)
    {
        // Go to the 'done' state
        this.exeState = 'done';
        this.coderack.reset();
        this.reporter.info('Done drafting.'); 
        this.infoDialog?.show(['Done!'], 30, 12);
    }

};
