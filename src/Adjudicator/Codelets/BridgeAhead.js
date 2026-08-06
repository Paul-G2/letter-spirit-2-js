/**
 * @classdesc
 * This Adjudicator codelet selects a SP at rendom from the workspace, and checks
 * if there is a match for it in the Thematic Focus. If so, a bridge is created.
 * 
 */
Codelets.BridgeAhead = class extends Codelets.CodeletBase
{
    static Name = 'bridge-ahead';
    static Text = 'Bridge/ahead';


    /**
     * @constructor
     * 
     * @param {Adjudicator} owner - The owner of the codelet.
     * @param {Number} urgency - The urgency of the codelet.
     * @param {Number} generation - The generation that the codelet belongs to.
     */
    constructor(owner, urgency, generation) 
    { 
        super(Codelets.BridgeAhead.Name, owner, urgency, generation);
    }


    /**
     * Runs the codelet.
     */
    run()
    {
        const adj = this.owner;
        const tf = adj.app.thematicFocus;
        const randGen = adj.randGen;
        const rptr = adj.app.reporter;

        // Display codelet info
        this.titleText    = 'Bridge-ahead codelet from generation ' + this.gen; 
        this.messageText1 = 'Bridge from current letter';
        this.messageText2 = '';    
        rptr.trace(this.titleText);
        
        const spType = randGen.weightedChoice(StyProps.SpTypes, StyProps.SpWeights);
        let nearChoices = adj.styProps[spType];
        if ((spType == 'relative_nvs') || (spType == 'val_to_val_nvs')) {
            const roleName = randGen.choice(adj.input.roleFillers)[0];
            nearChoices = adj.styProps[spType].filter(x => x[0] == roleName);
        }
        
        if (!nearChoices || !nearChoices.length) {
            this.messageText2 = `There are no SPs of type ${spType}`;
        } 
        else {
            let nearEnd = randGen.choice(nearChoices);  // A Stylistic Property: eg [roleName, 'Height', 'less'] or 'ban_rightedge' or [0,1,16]
            let farMatch;  // Will have the form [bestLevel, sp, longestMatch]
            if (StyProps.IsMotifType(spType)) {
                farMatch = this.bestTfMotifMatch(spType, nearEnd);  
            } else {
                farMatch = this.bridgeHighestFarMatch(spType, nearEnd);
            }
            
            if (!farMatch) {
                adj.addBridge( ['add', spType, nearEnd] );
                adj.updateTemperature(20 + (80/3)*tf.numNonEmptyLevels(), 3*ThematicFocus.SpProb(spType, nearEnd));
                this.messageText2 = 'SP not in Thematic Focus yet.';
                rptr.traceDetail(`ahead_not_found ${spType} ${JSON.stringify(nearEnd)}`);
            } 
            else {
                let farLevel = farMatch[0];
                let farSp = farMatch[1];
                let match = farMatch[2];
                adj.addBridge( ['promote', spType, farLevel, farSp, match] );
                adj.updateTemperature(-25, 1.2*tf.spImportance(spType, farLevel, match));
                rptr.traceDetail(`ahead_found ${spType} ${farLevel} ${JSON.stringify(farSp)}`);
            }
        }
    }

    
    /**
     * Of all the longest matches, takes the one from the highest level
     */
    bestTfMotifMatch(spType, mtf)
    {
        const tf = this.owner.app.thematicFocus;
        const mtfSubLists = Motif.MotifSublists(spType, mtf);

        let longestMatch = [];
        let bestLevel = ThematicFocus.LevelNames[0];
        let bestSp = null;
        for (const levelName of ThematicFocus.LevelNames) {
            const spMotifs = tf.getStyProps(spType, levelName);
            for (const spMotif of spMotifs) {
                for (const motifSubList of mtfSubLists) {
                    const match = Utils.FindLongestMatchingSequence(spMotif, motifSubList);
                    if (match.length >= longestMatch.length) { // Higher levels will be favored, because of >=
                        longestMatch = match; 
                        bestLevel = levelName;
                        bestSp = spMotif;
                    } 
                }
            }
        }
        return (longestMatch.length < 2) ? null : [bestLevel, bestSp, longestMatch]; 
    }


    /** 
     * Of all motifs in the TF which match the near-end,
     * returns the longest one at the highest level
     */
    bridgeHighestFarMatch(spType, spToMatch) 
    {
        const tf = this.owner.app.thematicFocus;
        const randGen = this.owner.randGen;
        const allLevelsDescending = ThematicFocus.LevelNames.slice().reverse();

        for (const levelName of allLevelsDescending) {
            const tfSpOptions = tf.getStyProps(spType, levelName);
            const optionMatches = tfSpOptions.filter( tfsp => Utils.ArraysEqual(tfsp, spToMatch) );
            if (optionMatches.length > 0) {
                const match = randGen.choice(optionMatches);
                return [levelName, spToMatch, match];
            }
        }
        return null;
    }
};
