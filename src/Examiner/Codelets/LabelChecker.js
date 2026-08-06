/**
 * @classdesc
 * This Examiner codelet checks a part chosen at random from the workspace to see if it 
 * has enough labels to justify sparking some activations.
 * 
 */
Codelets.LabelChecker = class extends Codelets.CodeletBase
{
    static Name = 'label-checker';
    static Text = 'Label/checker';

    
    /**
     * @constructor
     * 
     * @param {Examiner} owner - The codelet's owner.
     * @param {Number} urgency - The urgency of the codelet.
     * @param {Number} generation - The generation that the codelet belongs to.
     */
    constructor(owner, urgency, generation) 
    { 
        super(Codelets.LabelChecker.Name, owner, urgency, generation);
    }


    /**
     * Runs the codelet.
     */
    run()
    {
        // Display codelet info
        const exmr = this.owner;
        this.titleText    = 'Label-checker codelet from generation ' + this.gen; 
        this.messageText1 = '';
        this.messageText2 = '';    
        exmr.app.reporter.trace(this.titleText);
        
        const part = exmr.randGen.choice(exmr.parts);
        const coderack = exmr.app.coderack;

        let enoughLabels = Params.LabelTotal;
        if (part.numTips() == 0) { enoughLabels -= 2; }
        if (coderack.numCodeletsRun >= Params.NumExamPhaseCodelets) { enoughLabels -= 1; }

        const urgency = 20 + (5 * (part.numLabels() - enoughLabels + 4));

        this.messageText1 = `Checking part ${part.qidString()}`; 
        if (part.numLabels() >= enoughLabels) {
            this.messageText2 = `Part passed inspection ... adding sparker.`;
            coderack.post(1, 'sparker', urgency, this.gen+1, [part]);
        } else {
            this.messageText2 = `Not enough labels ... >>>fizzle<<<`;
        }
    }
};
