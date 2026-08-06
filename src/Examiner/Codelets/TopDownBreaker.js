/**
 * @classdesc
 * This Examiner codelet breaks a part into smaller parts.
 * 
 */
 Codelets.TopDownBreaker = class extends Codelets.CodeletBase
 {
    static Name = 'top-down-breaker';
    static Text = 'Top-down/breaker';

    
    /**
     * @constructor
     * 
     * @param {Examiner} owner - The codelet's owner.
     * @param {Number} urgency - The urgency of the codelet.
     * @param {Number} generation - The generation that the codelet belongs to.
     * @param {Array} args - Arguments to pass to the codelet.
     */
    constructor(owner, urgency, generation, args) 
    { 
        super(Codelets.TopDownBreaker.Name, owner, urgency, generation);
        this.part = args[0];
    }


    /**
     * Runs the codelet.
     */
    run()
    {
        // Just run a breaker codelet
        const exmr = this.owner;
        (new Codelets.Breaker(exmr, this.urgency, this.gen, [this.part])).run();
        this.titleText = 'Top-down-breaker codelet from generation ' + this.gen;   
        exmr.app.reporter.trace(this.titleText); 
    }

};
