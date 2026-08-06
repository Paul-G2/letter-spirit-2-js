/**
 * @classdesc
 * This class implements the Letter Spirit Examiner. 
 * 
 */
 class Examiner 
 {
    /**
     * @constructor
     * @param {App} app - The Letter Spirit app instance that owns this Examiner.
     */
    constructor(app) 
    { 
        this.name                = 'Examiner';
        this.app                 = app;
        this.randGen             = app.randGen;
        this.smartParser         = new SmartParser(this);
        this.completionCallback  = null;
        this.inputGridLetter     = new GridLetter([]);

        // Workspace data
        this.temperature         = 100;
        this.solution            = null;
        this.parts               = [];  
        this.joints              = [];
        this.bindings            = [];  // [{role, part, flip}, ...]
        this.sparkThreshold      = Params.InitialSparkThreshold;
        this.punish              = Params.InitialPunish;
        this.punishHard          = Params.InitialPunishHard;
        this.inputLetterGestalts = {};
        this.roleActivations     = Object.fromEntries( Object.values(Roles).map(r => [r.name, 0]) );
        this.wholeActivations    = Object.fromEntries( Wholes.Names.map(wholeName => [wholeName, 0]) );
    }


    /**
     * Resets the Examiner to its initial state
     */
    reset()
    {
        this.temperature         = 100; 
        this.solution            = null;
        this.parts               = [];  
        this.joints              = [];
        this.bindings            = []; 
        this.sparkThreshold      = Params.InitialSparkThreshold;
        this.punish              = Params.InitialPunish;
        this.punishHard          = Params.InitialPunishHard;
        this.roleActivations     = Object.fromEntries( Object.values(Roles).map(r => [r.name, 0]) );
        this.wholeActivations    = Object.fromEntries( Wholes.Names.map(wholeName => [wholeName, 0]) );
    }


    /**
     * Sets the completion callback function.
     */
    setCompletionCallback(callback) 
    { 
        this.completionCallback = callback; 
    }


    /**
     * Starts running the Examiner with the current input grid letter.
     */
    start(inputGridLetter)
    {
        this.reset();
        this.app.coderack.reset();
        this.app.activeModule = this;

        this.inputGridLetter = inputGridLetter.clone();
        this.inputLetterGestalts = GestaltScorer.CalcGestalts(this.inputGridLetter);  
        if (Params.AntsEnabled  && this.inputGridLetter.hasAdjacentQuanta()) {
            this.app.coderack.post(1, 'glue-ant', Params.VeryHighUrgency, 0);
        } else {
            this.smartParser.run();
        }
        this.codeletLoop();
    }


    /**
     * Runs the next codelet and schedules a subsequent one.
     */
    async codeletLoop()
    {
        const app = this.app;
        const rptr = app.reporter;
        const coderack = app.coderack;
        
        try 
        {
            // Check for empty coderack
            if (coderack.codelets.length === 0) {
                rptr.trace("Coderack is empty...");
                if ( (this.temperature > 90) || this.parts.some(p => p.hasLabel('**whine')) ) {
                    if (this.parts.length == 0) { 
                        throw new Error("parts.length == 0, in Examiner.codeletLoop"); // Should never happen
                    } else {
                        coderack.post(2*this.parts.length, 'looker', Params.MediumUrgency, 1);
                    }
                } else {
                    rptr.info("PANIC. Breaking up all existing parts and reglomming quanta.");
                    if (Params.AntsEnabled && this.inputGridLetter.hasAdjacentQuanta()) {
                        this.reset();
                        coderack.post(1, 'glue-ant', Params.VeryHighUrgency, 0);
                    } else {
                        this.smartParser.run();
                    }
                }
            }  

            // Run a codelet
            await coderack.chooseAndRunCodelet();
            
            // Recalculate temperature
            this.updateTemperature();

            // Maybe adjust some parameters
            if ((coderack.numCodeletsRun % Params.NumExamPhaseCodelets) === 0) {
                this.easeSparkerParams();
            }
            
            // Check whether we are done
            this.solution = this.checkForSolution();
            if (this.solution) {
                rptr.info(`Examiner solution found after ${coderack.numCodeletsRun} codelets: ${this.solution.wholeName} (${this.solution.score})`);
                this.completionCallback(this);
                return;
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
                app.stepTimerId = window.setTimeout( async () => 
                    { app.stepTimerId = undefined; await this.codeletLoop(); }, app.stepDelay );
            }   
        }
        catch (e) {
            rptr.error(e.stack);
            alert("Oops, an error occurred in Examiner.codeletLoop.\n\nPlease try reloading the page.");
        }       
    }


    /**
     * Update the current temperature, which takes into account
     * the goodness of parts and the whole activations in the workspace.
     */
    updateTemperature()
    {
        // Calculate a goodness score
        let goodness = 0; 
        if (this.parts.length > 0) { 
            const partGoodnesses = this.parts.map(p => this.calcPartGoodness(p));
            const rawScore = partGoodnesses.reduce((sum, rating) => sum + rating, 0) / this.parts.length;
            goodness = Math.min(100.0, rawScore);  
            const anyWhining = this.parts.some(p => p.hasLabel('**whine'));
            if (anyWhining && (goodness > 20)) { goodness -= 20; }   // Lower the goodness if there are whiners
        }

        const memCount = Object.values(this.wholeActivations).filter(val => val >= Params.WholeThreshold).length;
        const memGoodness = (memCount === 0) ? 0 : 100/memCount; 
         
        const targetTemp = Math.abs(100 - (goodness + memGoodness)/2); 
        const diff = Math.abs(this.temperature - targetTemp);
        const newTemp = (targetTemp > this.temperature) ? (this.temperature + diff) : (this.temperature - diff);
        
        this.temperature = newTemp;
    }


    /** 
     * Checks whether a good solution has been found.
     */
    checkForSolution()
    {
        let solution = null;

        let bestWholeInfo = this.getBestWholeInfo();
        if (bestWholeInfo.score > 99) {
            solution = {wholeName:bestWholeInfo.wholeName, score:bestWholeInfo.score, isGuess:false};
        }
        else if (this.app.coderack.numCodeletsRun >= Params.MaxExaminerCodelets)
        {
            // Get the prototype that best matches the input letter. This will be our guess.
            this.app.reporter.info("Max codelets reached, forcing a guess.");
            const protoDists = Object.values(Knowledge.BlurredPrototypes).map(prot => this.inputGridLetter.distanceTo(prot));
            const indexOfBest = protoDists.reduce((iMin, val, i, arr) => (val < arr[iMin]) ? i : iMin, 0);
            solution = {wholeName: Knowledge.LetterCategories[indexOfBest]+'1', score: Utils.Round1(protoDists[indexOfBest]), isGuess: true}; 
        }
        else if (this.temperature < 30) 
        {
            // Try to solve things when the temperature is low
            this.rRoleCheckWholes();
            this.updateTemperature();
            if (this.temperature < 20) {
                this.app.reporter.info("Temperature very low, picking a winner.");
                bestWholeInfo = this.getBestWholeInfo()
                solution = {wholeName:bestWholeInfo.wholeName, score:bestWholeInfo.score, isGuess:false};
            }
        }
        
        if (solution) { 
            solution.parts = this.parts;
            solution.partRoleMap = this.getPartRoleMap(solution); 
        }
        return solution;
    }



    /**
     * Finds the Whole that has the highest activation.
     */
    getBestWholeInfo()
    {
        const wholeActivations = Object.entries(this.wholeActivations);
        let [bestWholeName, bestScore] = wholeActivations.reduce(function(a, b) {return (a[1] > b[1]) ? a : b;}); 

        if (bestScore > 99) {
            // Break ties and near-ties by looking at the sum of role activations
            const candidates = wholeActivations.filter(entry => entry[1] > 99);
            const roleActs = candidates.map(c => Wholes[c[0]].roleSet.reduce((sum, role) => sum + this.roleActivations[role.name], 0));
            const indexOfMax = roleActs.reduce((iMax, val, i, arr) => (val > arr[iMax]) ? i : iMax, 0);
            bestWholeName = candidates[indexOfMax][0];
            bestScore = candidates[indexOfMax][1];
        }
        
        return {wholeName: bestWholeName, score: Utils.Round3(bestScore)};
    }
    
    
    /**
     * Gets a joint contained in the workspace that has the same quanta as the given joint.
     */
    getUpdatedJoint(joint)
    {
        return this.joints.find(jt => jt.valueEquals(joint));
    }


    /**
     * Gets a part contained in the workspace that has the same joints as the given part.
     */
    getUpdatedPart(part)
    {
        return this.parts.find(p => p.hasSameJointsAs(part));
    }


    /**
     * Indicates whether the workspace contains a specified part.
     * The check is based only on matching part joints, not labels.
     */
    containsPart(part)
    {
        const matchingPart = this.parts.find(p => p.hasSameJointsAs(part));
        return !!matchingPart;
    }


    /**
     * Removes a specified part from the workspace.
     */
    removePart(part)
    {
        this.parts = this.parts.filter(p => !p.hasSameJointsAs(part));
    }


    /**
     * Removes a specified part from the list of bindings. 
     */
    unbindPart(part)
    {
        this.bindings = this.bindings.filter(b => !b.part.hasSameJointsAs(part));
    }

    
    /**
     * Calculates the current goodness of a given part.
     */
    calcPartGoodness(part)
    {
        // Check if the part is still in the workspace
        if (!this.containsPart(part)) { return 0; }

        const labelCount = part.hasLabel('**whine') ? 0 : part.numLabels();
        const partRoles = this.bindings.filter(b => b.part.hasSameJointsAs(part)).map(b => b.role);
        const partActs = partRoles.map(role => this.roleActivations[role.name]);
        const topAct = Math.max(...partActs, 0);
        return Math.min(100, (Params.LabelValue*labelCount + topAct)/2);
    }


    /**
     * Scales the sparker parameters.
     */
    easeSparkerParams()
    {
        this.sparkThreshold *= Params.SparkerReductionFactor;
        this.punish         *= Params.SparkerReductionFactor;
        this.punishHard     *= Params.SparkerReductionFactor;
    }


    /**
     * Calculates scores for all roles that have non-zero activations.
     */
    sparkedRoleInfos(part) 
    { 
        const activatedRoles = Object.values(Roles).filter(role => this.roleActivations[role.name] > 0);
        const allRolesInfo = activatedRoles.map(role => Utils.CalcRoleScoreForPart(part, role, this));
        return allRolesInfo.filter(item => item.score >= this.sparkThreshold);
    }


    /**
     * Calculates a score for the current workspace state.
     */
    goodness()
    {
        if (this.solution.isGuess) {
            return 300;
        } else {
            const subScores = this.parts.map(part => this.sparkedRoleInfos(part)).map(roleInfo => roleInfo[0]?.score || 0);
            const subScore = 0.8 * subScores.reduce((sum, score) => sum + score, 0)/Math.max(1, subScores.length);
            return Utils.Round3(Math.sqrt(this.punish/-25) * this.rRoleScore(this.solution.wholeName) + subScore); 
        }        
    }


    /**
     * Gets the best mapping of parts to roles in a given solution. 
     */
    getPartRoleMap(solution)
    {
        if (!solution) { return null; }
        
        // The number of parts must equal the roleSet length
        const numParts = this.parts.length;
        const bestWhole = Wholes[solution.wholeName];
        if (bestWhole.roleSet.length !== numParts) {
            return null;
        }

        // Get the part-to-roleInfo mapping that has the best score
        let bestScore = Number.NEGATIVE_INFINITY;
        let bestRoleInfo = null;
        for (let rolePerm of Utils.GetPermutations(bestWhole.roleSet)) {
            let validPerm = true;
            let roleInfo = [];
            for (let i = 0; (i < numParts) && validPerm; i++) {
                const role = rolePerm[i];
                const part = this.parts[i];
                validPerm = this.bindings.some(b => (b.role === role) && b.part.hasSameJointsAs(part));
                if (validPerm) {
                    roleInfo.push( Utils.CalcRoleScoreForPart(part, role, this) );
                }
            }
            if (validPerm) { 
                const score = roleInfo.reduce((acc, curr) => acc + curr.score, 0)
                if (score > bestScore) {
                    bestScore = score;
                    bestRoleInfo = roleInfo;
                }
            }
        }

        const partRoleMap = new Map();
        if (bestRoleInfo) {
            for (let i = 0; i < numParts; i++) {
                partRoleMap.set(this.parts[i], bestRoleInfo[i]);
            }
        }
        return partRoleMap;
    }


    /**
     * Updates the activation of currently-active wholes, based on
     * how well their roles are filled by the current parts.
     */
    rRoleCheckWholes()
    {
        // Loop over wholes
        Wholes.Names.forEach(wholeName =>
        {
            const currAct = this.wholeActivations[wholeName];
            if (currAct > 40) {
                const rRolesScore = this.rRoleScore(wholeName);
                const newAct = Math.min(100, Math.max(1, currAct + rRolesScore));
                this.wholeActivations[wholeName] = newAct;
            }
        });
    }


    /** 
     * Computes a score indicating how well a Whole's roles are filled by the current parts and their bindings.
     */
    rRoleScore(wholeName)
    {
        let rRolesScore = 0;
                
        // Penalize if any of the whole's roles are not filled by some part
        const boundRoles = this.bindings.map(b => b.role);
        const wRoleSet = Wholes[wholeName].roleSet;
        if (!wRoleSet.every(role => boundRoles.includes(role))) {
            rRolesScore -= Params.FilledPenalty; 
        }
        
        // Penalize if the current parts can't be mapped 1:1 to the whole's roles 
        if (this.parts.length !== wRoleSet.length) {
            rRolesScore -= Params.CoveredPenalty;
        } 
        else {
            const partBindings = this.parts.map(p => this.bindings.filter(b => b.part.hasSameJointsAs(p))); 
            const partRoleNames = partBindings.map(blist => blist.map(b => b.role.name)); 
            const cartProd = partRoleNames.reduce((acc, curr) => { return acc.flatMap(x => curr.map(y => [...x, y])); }, [[]]);
            const wRoleNames = wRoleSet.map(r => r.name).toSorted().toString();
            if (!cartProd.some(cp => cp.toSorted().toString() == wRoleNames)) { rRolesScore -= Params.CoveredPenalty; }
        }
        
        // Reward/penalize if the parts do/don't touch in the right way
        const roleTouchScores = wRoleSet.map(role => {
            const roleBindings = this.bindings.filter(b => b.role === role);
            const roleTouchTypes = roleBindings.map(b => b.part.labels).flat().filter(lbl => lbl.text == 'contact').map(lbl => lbl.data);
            const isNormal = roleBindings.map(b => b.flip).some(f => f == 'normal');
            const isBoth = isNormal && roleBindings.map(b => b.flip).some(f => f == 'flipped');
    
            const contactScores = role.norms.contact[wholeName] || {};
            const roleTouchScores2 = roleTouchTypes.map(touchType => {
                const normalScore = contactScores[touchType] || 0;
                const flippedScore = contactScores[ Knowledge.TipFlipMap[touchType] || touchType] || 0; 
                return isBoth ? Math.max(normalScore, flippedScore) : isNormal ? normalScore : flippedScore;
            });
            return Math.max(0, ...roleTouchScores2);
        });
        const wholeTouchScore = Math.min(...roleTouchScores);
        rRolesScore += (wholeTouchScore < 1) ? -Params.TouchPenalty : wholeTouchScore;

        return rRolesScore;        
    }

 };