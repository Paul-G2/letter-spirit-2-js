/**
 * @classdesc
 * This Adjudicator codelet selects a SP at rendom from a given level of the Thematic Focus and checks
 * if there is a match for it in the workspace. If so, a bridge is created.
 * 
 */
Codelets.BridgeBack = class extends Codelets.CodeletBase
{
    static Name = 'bridge-back';
    static Text = 'Bridge/back';

    
    /**
     * @constructor
     * 
     * @param {Adjudicator} owner - The owner of the codelet.
     * @param {Number} urgency - The urgency of the codelet.
     * @param {Number} generation - The generation that the codelet belongs to.
     * @param {Array} args - Arguments to pass to the codelet.
     */
    constructor(owner, urgency, generation, args) 
    { 
        super(Codelets.BridgeBack.Name, owner, urgency, generation);
        this.tfLevelName = args[0]; // Thematic Focus level
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
        this.titleText    = 'Bridge-back codelet from generation ' + this.gen; 
        this.messageText1 = `Bridge from ${this.tfLevelName} to current letter`;
        this.messageText2 = '';    
        rptr.trace(this.titleText);
                
        const spType = randGen.weightedChoice(StyProps.SpTypes, StyProps.SpWeights);
        const farEnd = randGen.choice( tf.getStyProps(spType, this.tfLevelName) );
        if (!farEnd ||!farEnd.length || ((spType == 'abstract_rules') && (!Wholes.CategoryNorms[adj.input.wholeName[0]].includes(farEnd)))) {
            // Fizzle if we find no SP there at all, or if we find an abstract-rule that doesn't apply to our letter
            this.messageText2 = `Bridge-back fizzled on level ${this.tfLevelName} -- no relevant SP`;
            return;
        } 
        else {
            let nearChoices = adj.styProps[spType];
            if ((spType == 'relative_nvs') || (spType == 'val_to_val_nvs')) {
                const roleName = randGen.choice(adj.input.roleFillers)[0];
                nearChoices = adj.styProps[spType].filter(x => x[0] == roleName);
            }

            const validNearEnds = nearChoices?.map(c => this.spMatch(spType, c, farEnd)).filter(x => x.length > 0);
            if (!validNearEnds || !validNearEnds.length) {
                adj.addBridge( ['demote', spType, this.tfLevelName, farEnd] );
                adj.updateTemperature(150, 0.9*tf.spImportance(spType, this.tfLevelName, farEnd, true));
                this.messageText2 = `Letter lacks SP from Thematic Focus`;
                rptr.traceDetail(`back_not_found ${spType} ${ this.tfLevelName} ${JSON.stringify(farEnd)}`);
            } else {
                const match = randGen.weightedChoice(validNearEnds, validNearEnds.map(e => e.length));
                adj.addBridge( ['promote', spType, this.tfLevelName, farEnd, match] );
                adj.updateTemperature(-25, 2.7*tf.spImportance(spType, this.tfLevelName, match));
                rptr.traceDetail(`back-found ${spType} ${this.tfLevelName} ${JSON.stringify(match)}`);
            }
        }
    }


    /*
     * Returns the longest match between two stylistic properties.
     */
    spMatch(spType, sp1, sp2) 
    {
        if (StyProps.IsMotifType(spType)) {
            const mtfSubLists = Motif.MotifSublists(spType, sp2);
            return Utils.SublistsInclude(mtfSubLists, sp1);
        } else {
            return Utils.ArraysEqual(sp1, sp2) ? sp2 : [];
        }
    }

};

