/**
 * @classdesc
 * This Examiner codelet probabilistically picks a whining part and tries to either combine it
 * with a neighboring part or add labels to it.
 * 
 */
 Codelets.Pacifier = class extends Codelets.CodeletBase
 {
    static Name = 'pacifier';
    static Text = 'Pacifier';

    
    /**
     * @constructor
     * 
     * @param {Examiner} owner - The codelet's owner.
     * @param {Number} urgency - The urgency of the codelet.
     * @param {Number} generation - The generation that the codelet belongs to.
     */
    constructor(owner, urgency, generation) 
    { 
        super(Codelets.Pacifier.Name, owner, urgency, generation);
    }


    /**
     * Runs the codelet.
     */
    run()
    {
        // Display codelet info
        const exmr = this.owner;
        this.titleText    = 'Pacifier codelet from generation ' + this.gen; 
        this.messageText1 = '';
        this.messageText2 = '';    
        exmr.app.reporter.trace(this.titleText);
     
        const coderack = exmr.app.coderack;
        const randGen  = exmr.randGen;

        // Get whiners
        const whiners = exmr.parts.filter(p => p.hasLabel('**whine')); 
        if (whiners.length === 0) { 
            this.messageText1 = 'There are no whiners ... >>>fizzle<<<';
            return;
        }

        // Pick a random whiner, weighted by whininess
        const crybaby = randGen.weightedChoice(whiners, whiners.map(p => p.getWhine()));
        if (crybaby && Codelets.Looker.IsWeird(crybaby)) {
            coderack.post(1, 'breaker', Params.HighUrgency, this.gen+1, [crybaby]); 
            this.messageText1 = 'Whiny part is weird ... >>>fizzle<<<';
            return;
        } 

        // Get a neighbor of the crybaby, preferring small ones
        const [smallNeighbor, allNeighbors] = Codelets.Pacifier.GetSmallNeighbor(crybaby, exmr);
        const neighbor = smallNeighbor ? randGen.choice([smallNeighbor, randGen.choice(allNeighbors)]) : null;
        const others = allNeighbors.filter(p => p != neighbor);
        
        // Decide whether to accept (and hence silence) the crybaby, or glom it with a neighboring part
        const crybabyPasses = crybaby ? Codelets.Looker.InspectPart(crybaby, exmr.inputGridLetter, randGen) : false;
        if (crybabyPasses || !neighbor || !Codelets.Pacifier.CombinePartsAndTest(crybaby, neighbor, others, exmr)) {
            // Add labeler codelets
            this.messageText1 = (`${crybaby.qidString()} passed, adding labelers`);
            crybaby.removeLabel('**whine');
            crybaby.addLabel( new Label('quanta', Utils.Linearize(crybaby.getQuantaIds(), randGen)) );
            coderack.post(Params.LabelerBatchSize, 'labeler', Params.MediumUrgency, this.gen+1, [crybaby]);
        } else {            
            // Successfully glommed
            this.messageText1 = `Glomming ${crybaby.qidString()} to neighbor ${neighbor.qidString()}`; 
            this.messageText2 = 'Adding looker codelets';
            coderack.post(2, 'looker', Params.MediumUrgency, this.gen+1);
            Utils.Dampen(exmr);
        }
    }


    /**
     * Finds a part's smallest neighbor, with some heuristic tie-breaking.
     * Returns a list of the form [smallest, [allNeighbors]] so that procesing can 
     * continue if smallest neighbor doesn't pan out.
     */
    static GetSmallNeighbor(crybaby, exmr)
    {
        if (!crybaby) { return [null, []]; }
        
        // Get all parts that are neighbors of crybaby
        const cbQids = crybaby.getQuantaIds();
        const neighboringQids = [ ...new Set(cbQids.flatMap(qid => Knowledge.QuantaNeighbors[qid])) ].filter(qid => !cbQids.includes(qid));  
        const allNeighbors = exmr.parts.filter(p => (p != crybaby) && p.getQuantaIds().some(q => neighboringQids.includes(q)));
        if (allNeighbors.length === 0) { return [null, []]; }

        // Find a smallest neighbor
        let smallestNbr = null;
        const minPartSize = allNeighbors.reduce((a,b) => Math.min(a, b.getQuantaIds().length), Number.MAX_SAFE_INTEGER);
        const smallestNbrs = allNeighbors.filter(p => p.getQuantaIds().length === minPartSize);
        if (smallestNbrs.length === 1) {
            smallestNbr = smallestNbrs[0];
        } 
        else { // Break ties by first looking at whininess    
            smallestNbr = exmr.randGen.choice( smallestNbrs.filter(p => p.hasLabel('**whine')) );
            if (!smallestNbr) { // If there are no whiners, look at goodness
                const minGoodness = smallestNbrs.reduce((a,b) => Math.min(a, exmr.calcPartGoodness(b)), Number.MAX_SAFE_INTEGER);
                smallestNbr = exmr.randGen.choice( smallestNbrs.filter(p => exmr.calcPartGoodness(p) === minGoodness) ); 
            }
        }
        return [smallestNbr, allNeighbors];
    }


    /**
     * Tries to combine two parts into a new, non-weird one.
     * 
     */
    static CombinePartsAndTest(partA, partB, fallbacks, exmr) 
    {
        const qidsA = partA.getQuantaIds();
        let success = false;
        let fallbackIndex = -1;

        while (fallbackIndex < fallbacks.length) {
            const toGlom = (fallbackIndex < 0) ? partB : fallbacks[fallbackIndex];
            const qidsG = toGlom.getQuantaIds();
            const newJointCandidates = [];
            qidsA.forEach(qidA => {
                qidsG.forEach(qidG => {
                    if (Knowledge.QuantaNeighbors[qidA].includes(qidG)) { newJointCandidates.push(new Joint(qidA, qidG)); }
                });
            });
            if (newJointCandidates.length > 0) {
                const newJoint = exmr.randGen.choice(newJointCandidates);
                let newJointList = [...partA.jointList, ...toGlom.jointList, newJoint];
                if (newJointList.length > 1) { // Remove former singlets
                    const newJointQids = newJointList.flatMap(jt => [jt.qidA, jt.qidB]);
                    newJointList = newJointList.filter(jt => !jt.isSinglet() ||
                        newJointQids.indexOf(jt.qidA) === newJointQids.lastIndexOf(jt.qidA) ); 
                }
                const newPart = new Part( newJointList, [new Label('**whine',15)] );
                
                // Accept the new part only if it is not too weird
                if (newPart.numTips() <= 2) {
                    exmr.removePart(partA);
                    exmr.removePart(toGlom);
                    exmr.parts.push(newPart);
                    success = true; 
                    break; 
                }
            }
            fallbackIndex++;
        }
        return success;
    }

};
