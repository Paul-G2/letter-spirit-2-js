/**
 * @classdesc
 * The Coderack class manages a set of Codelets and their execution.
 * 
 */
class Coderack
{
    /**
     * @constructor
     * @param {App} app - The App instance that owns this coderack.
     */
    constructor(app) 
    { 
        this.app = app;
        this.codelets = [];
        this.codeletFactory = new CodeletFactory(app);
        this.numCodeletsRun = 0;
        this.numCodeletsGrandTotal = 0;
        this.currentCodelet = null;
        this.lastRunCodelet = null;
    }


    /**
     * Empties the coderack and sets the 
     * run counter to zero.
     */
    reset()
    {
        this.codelets = [];
        this.numCodeletsRun = 0;
        this.currentCodelet = null;
        this.lastRunCodelet = null;
    }


    /**
     * Adds one or more codelets to the coderack. 
     * 
     * @param {number} count - The number of codelets to add.
     * @param {string} codeletName - The name of the codelets to add.
     * @param {number} urgency - The urgency of the codelet(s).
     * @param {number} generation - The generation that the codelet(s) belong(s) to.
     * @param {Array} args - Arguments to pass to the codelet(s).
     */
    post(count, codeletName, urgency, generation, args=[]) 
    {
        if (urgency !== 0) {
            urgency = Math.round(urgency / Math.pow(Params.GenerationGapConstant, generation));
            for (let i = 0; i < count; i++) {
                this.codelets.push( this.codeletFactory.create(codeletName, urgency, generation, args) );
            }
        } 
        else {
            this.app.reporter.warn(`Zero-urgency codelet ignored, in Coderack.post()`);
        }
    }


    /**
     * Runs a randomly chosen codelet from the coderack.
     * (The choice is weighted by urgency.)
     */
    async chooseAndRunCodelet()
    {
        if (this.codelets.length === 0) {
            this.app.reporter.warn(`Coderack is empty!, in Coderack.chooseAndRunCodelet()`);
            return;
        }

        // Choose a codelet to run
        this.currentCodelet = this.app.randGen.weightedChoice(this.codelets.map(c => [c, c.urgency]));
        this.codelets = this.codelets.filter(c => c != this.currentCodelet);
        
        // Run it
        await this.currentCodelet.run();
        this.numCodeletsRun += 1;
        this.numCodeletsGrandTotal += 1;
        this.lastRunCodelet = this.currentCodelet;
    }
};
