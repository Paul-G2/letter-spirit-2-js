/**
 * @classdesc
 * This class implements the Letter Spirit Drafter. 
 * 
 */
 class Drafter 
 {
    /**
     * @constructor
     * @param {App} app - The Letter Spirit app.
     */
    constructor(app) 
    { 
        this.name                = 'Drafter';
        this.app                 = app;
        this.randGen             = app.randGen;
        this.draftUtils          = new DraftUtils(this);
        this.setup               = new DraftSetup(this);
        this.completionCallback  = null;
        this.codeletLoopCallback = null;

        // Workspace data
        this.theWholeName    = '';  // The whole being drafted
        this.theRoleName     = '';  // The role being drafted
        this.ownStuff        = [];  // Quanta of the role-filler that is currently being drafted
        this.otherStuff      = [];  // Quanta of previouly drafted role-fillers in the current letter
        this.qidList         = [];  // Quanta of the whole being drafted
        this.approved        = {};  // Scores of letters that have been drafted. {a:score, c:score, ...}
        this.midTouch        = false;
        this.t2Touch         = false;
        this.altMidTouch     = false;
        this.altT2Touch      = false;
        this.otherTouchNorm  = '';
        this.touchPoints     = [];  // Points that previously-drafted parts' norms say should be in contact with other role-fillers
        this.avoidPoints     = [];  // Points that previously-drafted parts' norms say should not be in contact with other role-fillers
        this.avoidQuanta     = [];  // Quanta that previously-drafted parts' norms say should not be in contact with other role-fillers
        this.normCurve       = '';  // The curvature that is the norm for the role being drafted
        this.tip1            = -1;
        this.tip2            = -1;
        this.actualTip2      = -1;
        this.tip2Choices     = [];
        this.roleTraits      = {};
        this.choiceWeights   = {};
        this.draftMode       = 'normal';
        this.flipFlag        = false;
        this.quitDrawing     = false;
        this.quitConsider    = 0;
        this.currentPoint    = 0; // The point on the grid from which the next step will be taken
        this.lastPoint       = 'none';  // The previous cuurentPoint 
        this.drawnFrom       = '';
        this.totalDraws      = 0;
        this.styleKnob       = 1.0;
        this.chooseRand      = 25.0;
        this.tipRandomness   = 2.0;
        this.candidates      = [];  // Candidates for the next quantum that the Drafter will draw.
        this.sampledStyProps = new StyProps();
        this.numExmrRuns     = 0;
        this.borrowList      = {...DraftUtils.BaseBorrowList}; // NB: this is a shallow copy
        this.scratchSpace    = Object.fromEntries(Knowledge.LetterCategories.map(cat => [cat, {cat:cat, qidList:[], scores:[299.99], losers:[], tries:0, isSeed:false}]));
    }


    /**
     * Resets the Drafter to its initial state
     */
    reset()
    {
        this.theWholeName   = '';
        this.theRoleName    = '';
        this.ownStuff       = [];
        this.otherStuff     = [];
        this.qidList        = [];
        this.approved       = {};
        this.midTouch       = false;
        this.t2Touch        = false;
        this.altMidTouch    = false;
        this.altT2Touch     = false;
        this.otherTouchNorm = '';
        this.touchPoints    = [];
        this.avoidPoints    = [];
        this.avoidQuanta    = [];
        this.normCurve      = ''; 
        this.tip1           = -1;
        this.tip2           = -1;
        this.actualTip2     = -1;
        this.tip2Choices    = [];
        this.roleTraits     = {};
        this.choiceWeights  = {};
        this.draftMode      = 'normal';
        this.flipFlag       = false;
        this.quitDrawing    = false;
        this.quitConsider   = 0;
        this.currentPoint   = 0;
        this.lastPoint      = 'none'; 
        this.drawnFrom      = '';
        this.totalDraws     = 0;
        this.styleKnob      = 1.0;
        this.chooseRand     = 25.0;
        this.tipRandomness  = 2.0;
        this.candidates     = [];
        this.sampledStyProps.clear();
        this.numExmrRuns    = 0;
        this.borrowList     = {...DraftUtils.BaseBorrowList}; // NB: this is a shallow copy
        this.scratchSpace   = Object.fromEntries(Knowledge.LetterCategories.map(cat => [cat, {cat:cat, qidList:[], scores:[299.99], losers:[], tries:0, isSeed:false}]));
    }

    
    /**
     * Sets the completion callback function.
     */
    setCompletionCallback(callback) 
    { 
        this.completionCallback = callback; 
    }
    
    
    /**
     * Starts a run of the Drafter.
     */
    async start(inputSeedLetters)
    {
        const app = this.app;

        this.reset();
        app.coderack.reset();
        app.activeModule = this;
        inputSeedLetters.forEach(ltr => { this.addScratchSpaceEntry(ltr.cat, ltr.qidList, [0.0], [], 0, true); });
         
        const rptr = app.reporter;
        const ssp = this.scratchSpace;
        const Avg3 = Utils.AverageR3;
        const Consolidate = Drafter.Consolidate;
        while ((this.totalDraws < Params.MaxTotalDrafterDraws) && (this.totalAvgScratchSpaceScore() > 0))
        {
            // Choose a letter to work on (random, but weighted by scratch-space score)
            const cat = this.randGen.weightedChoice(Knowledge.LetterCategories.map(c => [c, this.avgScratchSpaceScore(c)]));
            app.subject = "drafted letter '" + cat + "'";
            const oldQids = ssp[cat].qidList.slice();
            const oldLosers = ssp[cat].losers.slice();
            const oldScores = ssp[cat].scores.slice();
            const oldScore = oldScores.reduce((a, b) => a + b, 0) / Math.max(1, oldScores.length); 
            const tries = ssp[cat].tries + 1;

            // Update the letter
            this.styleKnob = Math.max(0, 1.0 - Math.round(tries/3)/10);
            this.qidList = [];
            await this.begBorrowOrDraw(cat);
            const drafted = this.qidList.toSorted((a, b) => a - b);
            if (!drafted.length) { continue; }

            // Evaluate the updated letter
            const newTest = await this.checkGridletter(cat, drafted);
            const margin = (oldScore < 299) ? Math.abs(newTest.score - oldScore) : 200;
            rptr.trace(`Trying ${cat} by ` + ((this.drawnFrom == cat) ? 'drafting' : 'borrowing'));
            const newScores = [newTest.score];
            const oldScores2 = [...oldScores];
            if (margin < 15) { 
                let chk1 = await this.checkGridletter(cat, drafted);  
                let chk2 = await this.checkGridletter(cat, oldQids);  
                newScores.push(chk1.score);
                oldScores2.unshift(chk2.score);
            }
            const allComers = Consolidate([[drafted, newScores], [oldQids, oldScores2], ...oldLosers]);

            if (allComers.length == 0) {
                rptr.trace(`No comers for ${cat} ${oldQids} ${drafted}`);
            }

            const newChampInfo = allComers.reduce((a, b) => (Avg3(a[1]) < Avg3(b[1])) ? a : b);
            const newChamp = newChampInfo[0];
            const champScores = newChampInfo[1];
            const losers = allComers.filter(a => !Utils.ArraysEqual(a[0], newChamp));
            this.totalDraws += 1;
            this.chooseRand *= 0.99;
            this.tipRandomness *= 0.99;
            
            if (Utils.ArraysEqual(newChamp, drafted) && Utils.ArraysEqual(drafted, oldQids)) {
                if (this.catKeep(cat, Avg3([...newScores, ...oldScores2]))) {
                    rptr.trace(`Seedified as ${cat} on re-election: ${Avg3(champScores)} ${drafted}`);
                    this.addScratchSpaceEntry(cat, drafted, [0], [], 0);
                    this.approved = {};
                    app.adjudicator.updateTf();
                } else {
                    rptr.trace(`Reelected as ${newTest.cat}, score ${Avg3([...newScores, ...oldScores2])} ${drafted}`);
                    this.addScratchSpaceEntry(cat, drafted, [...newScores, ...oldScores2], oldLosers, tries-1);
                }
            } else if (Utils.ArraysEqual(newChamp, drafted)) {
                if (this.catKeep(cat, Avg3(newScores))) {
                    rptr.trace(`Seedified as ${newTest.cat}, score ${Avg3(newScores)} beat ${Avg3(oldScores2)} ${drafted}`);
                    this.addScratchSpaceEntry(cat, drafted, [0], [], 0);
                    this.approved = {};
                    app.adjudicator.updateTf();
                } else {
                    rptr.trace(`Accepted as ${newTest.cat}, score ${Avg3(newScores)} beat ${Avg3(oldScores2)} ${drafted}`);
                    this.addScratchSpaceEntry(cat, drafted, newScores, Consolidate([[oldQids, oldScores2], ...oldLosers]), tries-1);
                }
            } else if (Utils.ArraysEqual(newChamp, oldQids)) {
                rptr.trace(`Rejected as ${newTest.cat}, score ${Avg3(newScores)} ${drafted}`);
                this.addScratchSpaceEntry(cat, oldQids, oldScores2, Consolidate([[drafted, newScores], ...oldLosers]), tries);
            } else {
                rptr.trace(`Promoted as ${cat}, score ${Avg3(champScores)} ${newChamp}`);
                this.addScratchSpaceEntry(cat, newChamp, champScores, losers, tries-1);
            }

            await new Promise(resolve => setTimeout(resolve, (this.app.ui ? 1500 : 0)));
        }
        this.theWholeName = this.theRoleName = '';
        if (this.completionCallback) { this.completionCallback(this); }
    }


    /**
     * Drafts a letter of the given category, by either borrowing or drawing.
     */
    async begBorrowOrDraw(cat) 
    {
        const library = this.app.library;
        const randGen = this.randGen;

        this.theWholeName = randGen.weightedChoice(Knowledge.LetterConcepts[cat]);
        const borrowChoices = Utils.Intersection(this.borrowList[cat].map(b => b[1]), library.categories());
        const catToBorrowFrom = randGen.choice(borrowChoices);
        if (catToBorrowFrom && randGen.coinFlip(0.85)) // Borrow the whole letter (and modify it)
        {    
            this.drawnFrom = catToBorrowFrom;
            const [op, opCat, operand] = this.borrowList[cat].find(b => b[1] == catToBorrowFrom);
            this.borrowList[cat] = this.borrowList[cat].filter(b => b[1] != catToBorrowFrom); // Remove it from the borrowList
            const oldQids = library.getEntry(opCat).qids; 
            this.qidList = (op == 'steal') ? oldQids.map(q => operand[q] || q) : oldQids.filter(q => !operand.includes(q));
            this.ownStuff = []; this.otherStuff = this.qidList; // Just for rendering
            await new Promise(resolve => setTimeout(resolve, (this.app.ui ? 2000 : 0)));
        } 
        else // Draft the letter
        { 
            // Motif.ClearSublistsCache();
            this.otherStuff = [];
            this.touchPoints = [];
            this.avoidPoints = [];
            this.avoidQuanta = [];

            const roleNames = randGen.choice( Utils.GetPermutations(Wholes[this.theWholeName].roleSet.map(r => r.name)) );
            const fillers = [];
            for (let roleName of roleNames) { 
                // Borrow or draft the role-filler
                this.theRoleName = roleName;
                const borrowOptions = DraftUtils.RoleBorrowList[roleName].flatMap(r => this.app.library.lookupRoleFillers(r).map(f => f[1]));
                if (borrowOptions.length && randGen.coinFlip(0.75)) { // Borrow
                    this.ownStuff = randGen.choice(borrowOptions);
                } 
                else 
                { // Draft
                    await this.draft( Roles[roleName].topology );
                    if (this.flipFlag) { this.flipFlag = false; this.ownStuff.reverse(); }
                } 
                this.draftUtils.recordTouchingInfo();
                fillers.push(this.ownStuff);
                this.otherStuff = [...new Set([...this.ownStuff, ...this.otherStuff])];
                await new Promise(resolve => setTimeout(resolve, (this.app.ui ? 2000 : 0)));
            };
            this.qidList = [...new Set(fillers.flat())];
        }
    }


    /**
     * Runs the Examiner and Adjudicator on a drafted letter, to get a score.
     */
    checkGridletter(cat, qidList) 
    {
        return new Promise((resolve, reject) => {
            const app = this.app;
            const exmr = app.examiner;
            const adj = app.adjudicator;

            exmr.setCompletionCallback(() => {
                if (!exmr.solution.isGuess) {
                    const exmrCat = exmr.solution.wholeName[0];
                    if ((exmrCat == cat) && !exmr.solution.isGuess) {
                        adj.setCompletionCallback(() => {
                            app.activeModule = this;
                            resolve({cat:exmrCat, score:Utils.Round3(adj.temperature + 100 - exmr.goodness())});
                        }); 
                        adj.start(exmr.inputGridLetter, exmr.solution);
                    } else {
                        app.activeModule = this;
                        resolve({cat:exmrCat, score:300});
                    }
                } else {
                    adj.failed = true;
                    app.activeModule = this;
                    resolve({cat:'failed', score:300});
                }     
            })
            this.numExmrRuns++;
            exmr.start(new GridLetter(qidList));
        });
    }

    
    /**
     * Invokes the appropriate draft function for a given topology.
     */
    async draft(topo)
    {
        switch (topo) {
            case 'segment':
                this.setup.segmentDraftInit();
                await this.segmentDraftStep(); 
                break;

            case 'bisegment':
                this.setup.bisegmentDraftInit();
                await this.bisegmentDraftStep();
                break;

            case 'dot':
                this.setup.loopDotDraftInit();
                await this.dotDraftStep();
                break;

            case 'loop':   
                this.setup.loopDotDraftInit();
                await this.loopDraftStep(); 
                break;

            default:
                throw new Error(`Unknown topology: ${topo}`);
        }
    }


    /**
     * Performs a single segment-draft step.
     */
    async segmentDraftStep()
    {
        while (!this.quitDrawing) { 
            this.stepInit();
            await new Promise((resolve, reject) => { 
                this.codeletLoopCallback = resolve;
                this.codeletLoop(); 
            });
         }

    }


    /**
     * Performs a single bisegment-draft step.
     */
    async bisegmentDraftStep()
    {
        const Dist = Utils.DistanceBetweenPointIds

        while (!this.quitDrawing) { 
            this.stepInit();
            await new Promise((resolve, reject) =>{ 
                this.codeletLoopCallback = resolve;
                this.codeletLoop(); 
            });

            if ((Dist(this.currentPoint, this.actualTip2) <= Dist(this.currentPoint, this.tip1)) || (this.currentPoint == this.midpoint)) {
                this.quitDrawing = false;
                this.tip1 = this.tip2;
                this.tip2 = this.actualTip2;
                this.normCurve = this.flipFlag ? Knowledge.TipFlipMap[this.setup.getNormCurve()[1]] : this.setup.getNormCurve()[0];
                await this.segmentDraftStep();
            }
        }        
    }


    /**
     * Performs a single dot-draft step.
     */
    async dotDraftStep()
    {
        while (!this.quitDrawing && (this.currentPoint != this.tip2)) { 
            this.stepInit();
            await new Promise((resolve, reject) => { 
                this.codeletLoopCallback = resolve;
                this.codeletLoop(); 
            });
            if (this.currentPoint == this.tip2) {
                this.quitDrawing = false;
            } 
        }
    }


    /**
     * Performs a single loop-draft step.
     */
    async loopDraftStep()
    {;
        while (!this.quitDrawing && (this.currentPoint != this.tip2)) { 
            this.stepInit();
            await new Promise((resolve, reject) => { 
                this.codeletLoopCallback = resolve;
                this.codeletLoop(); 
            });

            if (this.currentPoint == this.tip2) {
                this.quitDrawing = false;
                this.tip2 = this.tip1;
                this.tip2Choices = this.setup.loopStartPoints();
                this.tip1 = this.currentPoint;
                this.touchPoints = [[this.tip2], ...this.touchPoints];
                this.draftMode = 'loop_finish';
                await this.loopFinishDraftStep();
                return;
            } 
        }
    }


    /*
     * Performs a single loop-finish-draft step.
     */
    async loopFinishDraftStep()
    {;
        while (!this.quitDrawing && (this.currentPoint != this.tip2)) { 
            this.stepInit();
            await new Promise((resolve, reject) => { 
                this.codeletLoopCallback = resolve;
                this.codeletLoop(); 
            });
            if (this.currentPoint !== this.tip2) { this.quitConsider = 0; }
        }
    }


    /**
     * Initializes the next step.
     */
    stepInit()
    {
        const app = this.app;
        const randGen = this.randGen;
        const coderack = app.coderack;
        const setup = this.setup;
        const pointsFromCurrentPt = setup.pointsFromPoint(this.currentPoint);

        switch (this.draftMode) {
            case 'loop_finish':
                if (Knowledge.PointIdNeighbors[this.currentPoint].includes(this.tip2)) {
                    this.candidates = setup.candidatesFromPoints(this.currentPoint, [this.tip2, ...pointsFromCurrentPt]);
                } else {
                    this.candidates = setup.candidatesFromPoints(this.currentPoint, pointsFromCurrentPt);
                }
                break;

            case 'loop_begin':
                this.candidates = setup.candidatesFromPoints(this.currentPoint, pointsFromCurrentPt);
                break;

            case 'dot':
                if (Knowledge.PointIdNeighbors[this.currentPoint].includes(this.tip1)) {
                    this.candidates = setup.candidatesFromPoints(this.currentPoint, [this.tip1, ...pointsFromCurrentPt]);
                } else {
                    this.candidates = setup.candidatesFromPoints(this.currentPoint, pointsFromCurrentPt);
                }
                break;

            default:
                this.candidates = setup.candidatesFromPoints(this.currentPoint, pointsFromCurrentPt);
                break;
        }
        
        this.candidates = this.candidates.filter(cand => !this.ownStuff.includes(cand.qid) && !this.otherStuff.includes(cand.qid));
        this.choiceWeights = Object.fromEntries(this.candidates.map(cand => [cand.qid, [cand.qid, 0,0,0,0,0,0,0,0,0]]));
        coderack.reset();

        // Post initial codelets
        for (let i = 0; i < Params.NumDrafterCodelets; i++) { coderack.post(1, 'breadcrumb', Params.MediumUrgency, 1); }
        for (let i = 0; i < Params.NumDrafterCodelets; i++) { coderack.post(1, 'touching',   Params.MediumUrgency, 1); }
        for (let i = 0; i < Params.NumDrafterCodelets; i++) { coderack.post(1, 'homing',     Params.MediumUrgency, 1); }
        for (let i = 0; i < Params.NumDrafterCodelets; i++) { coderack.post(1, 'finisher',   Params.MediumUrgency, 1); }

        const draftDimensions = ['Height', 'Width', 'Weight', 'Left_Edge', 'Right_Edge', 'Floor', 'Roof']
        for (let i = 0; i < Params.NumDrafterCodelets; i++) { 
            coderack.post(1, 'trait-met-reward', Params.MediumUrgency, 1, [randGen.choice(draftDimensions)]); 
        }

        for (let i = 0; i < Params.NumDrafterCodelets; i++) { 
            coderack.post(1, 'trait-progress-reward', Params.MediumUrgency, 1, [randGen.choice(draftDimensions)]); 
        } 

        const styProps = this.sampledStyProps;
        for (let i = 0; i < Math.floor(6*this.styleKnob * Params.NumDrafterCodelets); i++) {
            const mtfType = randGen.choice(Motif.Types) + '_motifs';
            if (styProps[mtfType].length > 0) { 
                const mtfInfo = randGen.choice(styProps[mtfType]);
                coderack.post(1, 'motif-rewarder', Params.MediumUrgency, 1, [mtfType, mtfInfo[1], mtfInfo[0]]);
            }
        }

        if (styProps.abstract_rules.length > 0) {
            for (let i = 0; i < Math.floor(this.styleKnob*Params.NumDrafterCodelets); i++) { 
                coderack.post(1, 'rule-enforcer', Params.MediumUrgency, 1, [randGen.choice(styProps.abstract_rules)]); 
            }
        }       
    }


    /**
     * Runs the current codelet and schedules a subsequent one.
     */
    async codeletLoop()
    {
        const app = this.app;
        const coderack = app.coderack;
        
        try 
        {
            // Check for empty coderack
            if (coderack.codelets.length == 0) {
                this.lastPoint = this.currentPoint;
                
                const winner = this.draftWinner();
                const choiceInfo = winner ? this.choiceInfo()[winner.qid] : null;
                if (!winner || ((this.ownStuff.length > 0) && (250 + this.quitConsider > choiceInfo.maxScore))) {
                    this.quitDrawing = true; 
                } else {
                    this.quitConsider = choiceInfo.quitScore;
                    this.currentPoint = winner.pid;
                    this.ownStuff.push(winner.qid); 
                }
                this.codeletLoopCallback();
                return;
            }  
            else {
                await coderack.chooseAndRunCodelet();
                this.pruneCandidates();
            }

            // Check for pause request
            if (app.pausePending) {
                if (app.exeState == 'running') { 
                    app.exeState = 'paused'; 
                    app.pausePending = false;
                }
            }
            
            // Maybe schedule the next codelet
            if (app.exeState == 'running') {
                app.stepTimerId = window.setTimeout( () => 
                    { app.stepTimerId = undefined; this.codeletLoop(); }, app.stepDelay );
            }   
        }
        catch (e) {
            app.reporter.error(e.stack);
            alert("Oops, an error occurred in Drafter.codeletLoop.\n\nPlease try reloading the page.");
        }      
    }


    /** 
     * Selects a candidate quantum (at random, but heavy-weighted by score).
     */
    draftWinner()
    {
        if (this.candidates.length == 0) { return null; }

        // Get a list of choices: [{qid, score}, ...]
        const choices = Object.entries(this.choiceInfo()).map(([qid, scores]) => {return {qid:qid, score:Math.max(0, scores.maxScore/1e6)}});

        // Get the highest-scoring choice, and boost its score
        const champChoice = choices.reduce((a, b) => (b.score > a.score) ? b : a);
        choices.find(c => (c.qid == champChoice.qid)).score += 25;

        // Randomly select a winner, weighted heavily by score
        const wChoices = choices.map(c => [c.qid, Math.pow(c.score, this.chooseRand)]);
        const winnerQid = this.randGen.weightedChoice(wChoices);
        return this.candidates.find(c => c.qid == winnerQid);        
    }


    /**
     * Removes candidates whose scores are too low.
     */
    pruneCandidates()
    {
        if (!this.candidates.length) { return; }

        const choiceInfo = this.choiceInfo();
        const scoreDict = Object.fromEntries( this.candidates.map(c => [c.qid, choiceInfo[c.qid].maxScore]) );
        const veryBest = Math.max(...Object.values(scoreDict));
        this.candidates = this.candidates.filter(c => veryBest - scoreDict[c.qid] <= 4000);
    }
    

    /**
     * Computes a dictionary of continue/quit score for each candidate qids.
     */
    choiceInfo()
    {
        const result = {};
        this.candidates.forEach(cand => {
            const qid = cand.qid;
            const vals = this.choiceWeights[qid];
            const quitScore = Utils.Round3(vals[1] + vals[2] + vals[3] + vals[4] + vals[6] + vals[7] + vals[9]);
            const contScore = Utils.Round3(vals[1] - 0.025*vals[2] + vals[3] + vals[5] + vals[6] + vals[7] + vals[8]);
            result[qid] = {contScore:contScore, quitScore:quitScore, maxScore:Math.max(contScore, quitScore)};
        });

        return result;
    }


    /**
     * Combines a list of [[qidList1, scores1],  [qidList2, scores2], ...], combining common qidLists.
     */
    static Consolidate(list)
    {
        let result = [];
        list.forEach(entry => {    
            const existing = result.find(r => Utils.ArraysEqual(entry[0], r[0]));
            if (existing) {
                existing[1].push(...entry[1]);
            } else {
                if (entry[0].length > 0) { result.push(structuredClone(entry)); }
            }
        });
        return result;
    }


    /**
     * Determines whether promotion should occur for a given category.
     */
    catKeep(cat, score)
    {
        let promotionCutoff;
        const libLength = this.app.library.length();
        if (libLength == 0) {
            promotionCutoff = 68;
        } 
        else if (libLength == 1) {
            promotionCutoff = 52;
        } 
        else {
            const otherScores = Object.entries(this.approved).filter(e => e[0] != cat).map(e => e[1]);
            if (Params.ToughPromotion) {
                promotionCutoff = 15 + 0.33*Utils.AverageR3([110, ...otherScores]);
            } else {
                promotionCutoff = Utils.AverageR3([70, ...(otherScores.filter(e => e > 0))]) - 12;
            }
        }
        return (score < Utils.Round3(promotionCutoff));
    }


    /**
     * Adds an entry to the scratch space.
     */
    addScratchSpaceEntry(cat, qidList, scores, losers, tries, isSeed=false)
    {
        this.scratchSpace[cat] = {cat:cat, qidList:qidList.slice(), scores:scores.slice(), losers:losers.slice(), tries:tries, isSeed:isSeed};
        if (qidList.length > 0) { this.approved[cat] = Utils.AverageR3(scores); }
    }

    
    /**
     * Calculates the average scratch space score for a given letter category.
     */
    avgScratchSpaceScore(cat) 
    { 
        const catSS = this.scratchSpace[cat];
        return catSS.scores.reduce((a, b) => a + b, 0) / Math.max(1, catSS.scores.length); 
    }

    
    /**
     * Calculates the total avearge scratch space score over all letter categories.
     */
    totalAvgScratchSpaceScore() 
    { 
        return Object.values(this.scratchSpace).reduce((a, b) => a + this.avgScratchSpaceScore(b.cat), 0); 
    }


    /**
     * Adds a value the nth choiceWeight for a given candidate.
     */
    addChoice(candidate, toAdd, n)
    {
        const weights = this.choiceWeights[candidate.qid]; 
        weights[n] = Utils.Round3(weights[n] + toAdd);
    }
};