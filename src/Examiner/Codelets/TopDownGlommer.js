/**
 * @classdesc
 * This Examiner codelet tries to combine a part with one of its neighboring parts.
 * 
 */
 Codelets.TopDownGlommer = class extends Codelets.CodeletBase
 {
    static Name = 'top-down-glommer';
    static Text = 'Top-down/glommer';

    
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
        super(Codelets.TopDownGlommer.Name, owner, urgency, generation);
        this.part = args[0];
    }


    /**
     * Runs the codelet.
     */
    run()
    {
        // Display codelet info
        const exmr = this.owner;
        this.titleText    = 'Top-down-glommer codelet from generation ' + this.gen; 
        this.messageText1 = '';
        this.messageText2 = '';  
        exmr.app.reporter.trace(this.titleText);  
        
        // Bail if the part is no longer around
        const randGen = exmr.randGen;
        const part = exmr.getUpdatedPart(this.part);
        if (!part) {
            this.messageText1 = "Part is no longer around ... >>>fizzle<<<";
            return; 
        }
        else {
            const partQids = part.getQuantaIds();
            const nbrQids = [ ...new Set(partQids.flatMap(qid => Knowledge.QuantaNeighbors[qid])) ].filter(qid => !partQids.includes(qid));  
            const nbrs = exmr.parts.filter(p => (p != part) && p.getQuantaIds().some(q => nbrQids.includes(q))); 
            const randNbr = randGen.choice(nbrs);
            const worst = randGen.weightedChoice(nbrs, nbrs.map(p => 100 - exmr.calcPartGoodness(p)));
            const nbr = randGen.choice([randNbr, worst]);
            
            if ((nbr !== null) && Codelets.Pacifier.CombinePartsAndTest(part, nbr, [], exmr)) {
                this.messageText1 = "Glomming " + part.qidString() + " to neighbor " + nbr.qidString();
                this.messageText2 = "Adding looker codelets";
                exmr.app.coderack.post(2, 'looker', Params.MediumUrgency, this.gen+1);                
                Utils.Dampen(exmr);
            } 
            else {
                this.messageText1 = "Nobody to glom to ... >>>fizzle<<<";
            }
        }
    }

};
