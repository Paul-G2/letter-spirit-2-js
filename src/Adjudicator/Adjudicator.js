/**
 * @classdesc
 * This class implements the Letter Spirit Adjudicator, whose purpose is to build a representation
 * of the style of a set of GridLetters.
 * 
 */
 class Adjudicator 
 {
    /**
     * @constructor
     * @param {App} app - The Letter Spirit app instance that owns this Adjudicator.
     */
    constructor(app) 
    { 
        this.name               = 'Adjudicator';
        this.app                = app;
        this.randGen            = app.randGen;
        this.completionCallback = null;

        // Workspace data        
        this.temperature     = 50;
        this.phase           = 1;
        this.input           = {gridLetter: new GridLetter([]), wholeName:'', roleFillers: []}; // role-filler ~ [roleName, qids]
        this.failed          = false;
        this.styProps        = new StyProps();
        this.bridges         = [];
        this.promotions      = [];    
    }


    /**
     * Resets the Adjudicator to its initial state
     */
    reset()
    {
        this.temperature        = 50; 
        this.phase              = 1;  
        this.input              = {gridLetter: new GridLetter([]), wholeName:'', roleFillers: []}; 
        this.failed             = false;
        this.bridges            = [];
        this.promotions         = [];
        this.styProps.clear();
    }
 
    
    /**
     * Sets the completion callback function.
     */
    setCompletionCallback(callback) 
    { 
        this.completionCallback = callback; 
    }


    /**
     * Starts running the Adjudicator with given inputs.
     */
    start(inputGridLetter, exmrSolution)
    {
        this.reset();
        this.app.coderack.reset();
        this.app.activeModule = this;

        // Organize the inputs
        this.input = {gridLetter: inputGridLetter.clone(), wholeName:exmrSolution.wholeName, roleFillers: []};  
        if (exmrSolution.isGuess) {
            this.app.reporter.info(`Adjudicator short-circuiting due to unusable input from Examiner.`);
            this.failed = true;
            this.phase = 3;
            this.temperature = 100;
            window.setTimeout( () => this.completionCallback(this), 0 ); 
            return;
        } 
        else {
            // Extract role-fillers from the Examiner solution
            for (const [part, roleInfo] of exmrSolution.partRoleMap) {
                const qids = (roleInfo.flip == 'normal') ? part.quantaIds.slice() : part.quantaIds.slice().reverse(); 
                this.input.roleFillers.push( [roleInfo.role.name, qids] );
            }
            // Start executing codelets
            this.postInitialCodelets();
            this.codeletLoop();
        }
    }


    /**
     * Posts the initial set of codelets to the coderack.
     */ 
    postInitialCodelets()
    {
        const randGen = this.randGen;
        const fillers = this.input.roleFillers;
        const coderack = this.app.coderack;

        if (fillers.length > 0) {
            for (let i = 0; i < 100; i++) {
                coderack.post(1, 'comparer',     Params.MediumUrgency, 1, [randGen.choice(fillers), randGen.choice(NormViols.NvTypes)]);
                coderack.post(1, 'stenographer', Params.MediumUrgency, 1, [randGen.choice(fillers), randGen.choice(NormViols.NvTypes)]);
            }
        }
        for (let i = 0; i < 50; i++) {
            coderack.post(1, 'constable', Params.MediumUrgency, 1, [randGen.choice(Rules.RuleTypes)]);
        }
        for (let i = 0; i < 100; i++) {
            coderack.post(1, 'worm', Params.MediumUrgency, 1, [randGen.weightedChoice(Motif.Types, Motif.Weights)]); 
        }
    }


    /**
     * Runs the current codelet and schedules a subsequent one.
     * @private
     */
    async codeletLoop()
    {
        const app = this.app;
        const rptr = app.reporter;
        const randGen = this.randGen;
        const coderack = app.coderack;
        const tf = app.thematicFocus;
        const tfLevelNames = ThematicFocus.LevelNames;
        
        try 
        {
            // Check for empty coderack
            if ( (coderack.codelets.length === 0) && (this.phase === 1) ) {
                const numToPost = 500; //(tf.numNonEmptyLevels() > 1) ? 150 : 100;
                coderack.post(numToPost, 'bridge-ahead', Params.MediumUrgency, 1);
                const tfLevelWts = tfLevelNames.map((levelName, i) => tf.styProps[levelName].isEmpty() ? 0 : Math.pow(5, i+1));
                for (let i = 0; i < numToPost; i++) {
                    coderack.post(1, 'bridge-back', Params.MediumUrgency, 1, [randGen.weightedChoice(tfLevelNames, tfLevelWts)]);
                }
                rptr.trace("Adjudicator going to phase 2.");
                this.phase = 2;
            }  
            else if ( (coderack.codelets.length === 0) && (this.phase === 2) ) {
                coderack.post(150, 'promoter', Params.MediumUrgency, 1);
                rptr.trace("Adjudicator going to phase 3.");
                this.phase = 3;
            }  
            else if ((coderack.codelets.length == 0 || this.bridges.length == 0) && (this.phase === 3)) {
                rptr.info(`Adjudicator is done.`);
                this.evaluateFillers();
                this.promotions.reverse();  // Make FIFO
                this.completionCallback(this);
                return;
            }

            // Run a codelet
            await coderack.chooseAndRunCodelet();
            
            // Check for pause request
            if (app.pausePending) {
                if (app.exeState == 'running') { 
                    app.exeState = 'paused'; 
                    app.pausePending = false;
                }
            }
            
            // Maybe schedule the next codelet
            if (app.exeState == 'running') {
                app.stepTimerId = window.setTimeout( async () => 
                    { app.stepTimerId = undefined; await this.codeletLoop(); }, app.stepDelay );
            }   
        }
        catch (e) {
            rptr.error(e.stack);
            alert("Oops, an error occurred in Adjudicator.codeletLoop.\n\nPlease try reloading the page.");
        }       
    }


    /**
     * Checks whether the workspace's fillers are consistent with what's in the library.
     */
    evaluateFillers()
    {
        this.input.roleFillers.forEach( (filler) => {
            const roleName = filler[0];
            const wkspFillerQids = Utils.CanonicalizeLoops(filler[1]).toSorted();
            const libFillers = this.app.library.lookupRoleFillers(roleName);
            if (libFillers.some(lf => Utils.ArraysEqual(lf[1].toSorted(), wkspFillerQids))) { 
                this.updateTemperature(-50, 150);
            } else {
                this.updateTemperature(100, 5);
            }
        });
    }


    /*
     * Updates the current temperature. (Bridge building success and failure is the sole 
     * determinant of temperature in the Adjudicator.)
     */
    updateTemperature(aim, rate) 
    {
        const step = 0.001 * rate;
        const newTemp = ((1 - step) * this.temperature) + (step * aim);
        this.temperature = Math.min(100, Math.max(0, newTemp));
    }


    /**
     * Adds a bridge to the workspace.
     */
    addBridge(newBridge)
    {
        if (!this.bridges.some(b => Utils.ArraysEqual(b, newBridge))) { 
            this.bridges = [newBridge, ...this.bridges];
        }
    }

    
    /*
     * Updates the Thematic Focus and returns the new library entry.
     */
    updateTf()
    {
        const tf = this.app.thematicFocus;

        // Add Library entry
        this.app.library.addEntry({
            letterCategory : this.input.wholeName[0],
            wholeName      : this.input.wholeName,
            qids           : this.input.gridLetter.quantaIds.slice(),
            fillers        : structuredClone(this.input.roleFillers),
            styProps       : structuredClone(this.styProps)
        });   
            
        // Handle promotions
        this.promotions.forEach( (bridge) => 
        {
            const promoType = bridge[0];
            const spType = bridge[1];   
            const tfLevel = (promoType == 'add') ? null : bridge[2];
            const styProp = (promoType == 'add') ? bridge[2] : bridge[3];

            switch (promoType) {
                case 'add':
                    if (!(StyProps.IsMotifType(spType) && styProp.includes('no_move'))) {
                        tf.addStyProp('letter_rows', spType, styProp);
                    }
                    break;

                case 'promote':
                    const match = bridge[4];
                    const promoteProb = ThematicFocus.PromoteProb(tfLevel, spType);
                    if (this.randGen.nSidedDie(1000)/1000 < promoteProb) {
                        tf.promote(spType, tfLevel, styProp, match);
                    }
                    break;

                case 'demote':
                    const demoteProb = ThematicFocus.DemoteProb(tfLevel, spType);
                    if (this.randGen.nSidedDie(1000)/1000 < demoteProb) {
                        tf.demote(spType, tfLevel, styProp);
                    }
                    break;

                default:
                    throw new Error(`Unknown promotion type in Adjudicator.updateTf: ${promoType}`);
            }
        });
    }
};