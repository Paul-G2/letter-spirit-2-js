/**
 * @classdesc
 * This Examiner codelet updates the Whole-activations based on their gestalt scores.
 * 
 */
Codelets.Gestalt = class extends Codelets.CodeletBase
{
    static Name = 'gestalt';
    static Text = 'Gestalt';

    
    /**
     * @constructor
     * 
     * @param {Examiner} owner - The codelet's owner.
     * @param {Number} urgency - The urgency of the codelet.
     * @param {Number} generation - The generation that the codelet belongs to.
     */
    constructor(owner, urgency, generation) 
    { 
        super(Codelets.Gestalt.Name, owner, urgency, generation);
    }


    /**
     * Runs the codelet.
     */
    run()
    {
        // Display codelet info
        const exmr = this.owner;
        this.titleText    = 'Gestalt codelet from generation ' + this.gen;  
        this.messageText1 = 'Spinning activation-spreader';
        this.messageText2 = '';
        exmr.app.reporter.trace(this.titleText);

        // Update whole-activations
        Wholes.Names.forEach(wholeName =>{
            const whole = Wholes[wholeName];
            const oldActivation = exmr.wholeActivations[whole.name];
            const categoryScore = exmr.inputLetterGestalts[whole.name[0]];
            const newActivation = Math.max(-100, Math.min(100, oldActivation + categoryScore));
            exmr.wholeActivations[whole.name] = newActivation; 
        }); 

        // Post an activation-spreader codelet
        this.owner.app.coderack.post(1, 'spreader', Params.HighUrgency, this.gen+1);
    }
};
