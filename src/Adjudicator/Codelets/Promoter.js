/**
 * @classdesc
 * This Adjudicator codelet selects a bridge at random from the workspace, and adds
 * it to the workspace's promotions list.
 * 
 */
Codelets.Promoter = class extends Codelets.CodeletBase
{
    static Name = 'promoter';
    static Text = 'Promoter';

    
    /**
     * @constructor
     * 
     * @param {Adjudicator} owner - The owner of the codelet.
     * @param {Number} urgency - The urgency of the codelet.
     * @param {Number} generation - The generation that the codelet belongs to.
     */
    constructor(owner, urgency, generation) 
    { 
        super(Codelets.Promoter.Name, owner, urgency, generation);
    }


    /**
     * Runs the codelet.
     */
    run()
    {
        // Display codelet info
        const adj = this.owner;
        this.titleText    = 'Promoter codelet from generation ' + this.gen; 
        this.messageText1 = 'Promote SP in Thematic Focus';
        this.messageText2 = '';    
        adj.app.reporter.trace(this.titleText);
        
        if (adj.bridges.length === 0) {
            this.messageText2 = 'No bridges left!  >>>fizzle<<<';
        } else {
            const selectedBridge = adj.randGen.choice(adj.bridges);
            adj.bridges = adj.bridges.filter(b => b !== selectedBridge); 
            adj.promotions = [selectedBridge, ...adj.promotions];
        }
    }
};

