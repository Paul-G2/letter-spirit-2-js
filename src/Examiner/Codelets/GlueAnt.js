/**
 * @classdesc
 * This Examiner codelet creates joints by probabilistically
 * adding glue between neighboring quanta.
 * 
 */
 Codelets.GlueAnt = class extends Codelets.CodeletBase
 {
    static Name = 'glue-ant';
    static Text = 'Glue Ant';

    // Amount of glue to put down for a given neighbor index 
    static GlueByNeighborIdx = Knowledge.NeighborAngles.map(x => Params.GlueByAngle[x]);



    /**
     * @constructor
     * 
     * @param {Examiner} owner - The codelet's owner.
     * @param {Number} urgency - The urgency of the codelet.
     * @param {Number} generation - The generation that the codelet belongs to.
     */
    constructor(owner, urgency, generation) 
    { 
        super(Codelets.GlueAnt.Name, owner, urgency, generation);
    }


    /**
     * Runs the codelet.
     */
    run()
    {
        // Display codelet info
        const exmr = this.owner;
        this.titleText    = 'Glue-ant codelet from generation ' + this.gen;
        this.messageText1 = '';
        this.messageText2 = '';    
        exmr.app.reporter.trace(this.titleText);      
        
        // Build bonds, repeatedly
        this.numRedundAnts = 0;
        while (this.numRedundAnts <= Params.RedundantC) {
            const bondedQuantum = this.bondQuanta();
            if (!bondedQuantum) { return false; } 
        } 

        // Post a shaker codelet and return
        exmr.app.coderack.post(1, 'shaker', Params.VeryHighUrgency, 0);
        return true;
    }


    /**
     * Bonds neighboring quanta into joints, with random amounts of glue.
     */
    bondQuanta() 
    {
        const exmr = this.owner;
        const app = exmr.app;
        const gridLetter = exmr.inputGridLetter;

        // Select a quantum at random from the letter 
        if ( !gridLetter.hasAdjacentQuanta() ) { return null; }
        const quantum = app.randGen.choice(gridLetter.quanta);

        // Get a random selection of its on-neighbors
        let onNbrs = [];
        quantum.neighbors.forEach((nbrId, i) => {
            if (gridLetter.quantaIds.includes(nbrId)) { onNbrs.push( {id:nbrId, glue:Codelets.GlueAnt.GlueByNeighborIdx[i]} ); } 
        });
        onNbrs = app.randGen.choice(onNbrs, onNbrs.length);

        // For each (quantum, neighbor) pair, either add it to our glued-joints list, 
        // or update its glue value if it's already there.
        onNbrs.forEach(nbr => { 
            const qids = (quantum.id < nbr.id) ? [quantum.id, nbr.id] : [nbr.id, quantum.id];
            const existingJoint = exmr.joints.find(jt => (jt.qidA === qids[0]) && (jt.qidB === qids[1]));

            if (existingJoint) {
                existingJoint.glue += nbr.glue;
                this.numRedundAnts++;
            } else {
                exmr.joints.push( new Joint(qids[0], qids[1], nbr.glue) );
            }
        });
            
        return quantum;
    }
};