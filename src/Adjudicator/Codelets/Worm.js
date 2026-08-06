/**
 * @classdesc
 * This Adjudicator codelet finds a shape that is part of the input by crawling
 * randomly through its quanta. The shape is added to the Workspace as a motif.
 */
Codelets.Worm = class extends Codelets.CodeletBase
{
    static Name = 'worm';
    static Text = 'Worm';

    
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
        super(Codelets.Worm.Name, owner, urgency, generation);
        this.motifType = args[0];
    }


    /**
     * Runs the codelet.
     */
    run()
    {
        // Display codelet info
        const adj = this.owner;
        this.titleText    = 'Worm codelet from generation ' + this.gen; 
        this.messageText1 = `Looking for ${this.motifType} motif`;
        this.messageText2 = '';    
        adj.app.reporter.trace(this.titleText);
        
        const randGen = adj.randGen;
        const qids = adj.input.gridLetter.quantaIds; 
        const rehash = Motif.LazyNeighborRandomRehash([randGen.choice(qids)], qids, randGen);
        const path = Utils.CanonicalizeLoops(rehash);

        const styProps = adj.styProps;
        const propType = this.motifType + '_motifs';
        switch (this.motifType) 
        {
            case 'literal':
                if (!styProps[propType].some(x => Utils.ArraysEqual(x, path))) { styProps[propType].unshift(path); }
                break;

            case 'translate':
            case 'turn_180':
            case 'turn_90':
                const q2c = Utils.QuantaToCompass(path);
                if (!styProps[propType].some(x => Utils.ArraysEqual(x, q2c))) { styProps[propType].unshift(q2c); }
                break;
   
            case 'turn_45':
                const q2a = (path.length > 1) ? Utils.QuantaToAngles(path) : ['no_angle']
                if (!styProps[propType].some(x => Utils.ArraysEqual(x, q2a))) { styProps[propType].unshift(q2a); }
                break;

            default:
                throw new Error(`Codelets.Worm.run: no such motif type: ${motifType}`);
        }
        
        // Maybe post a new worm codelet
        if (randGen.coinFlip()) {
            adj.app.coderack.post(1, 'worm', Params.MediumUrgency, this.gen+1, [randGen.choice(Motif.Types)]);
            this.messageText2 = 'Worm codelet spun';
        }
    }
};

