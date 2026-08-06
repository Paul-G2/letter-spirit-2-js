/**
 * @classdesc
 * This Adjudicator codelet compares a role-filling part with an expected norm and 
 * updates the workspace's relative_nvs list accordingly. For example, it may 
 * add ['Height', 'more'] to the relative_nvs list if a height norm violation is found.
 * 
 */
Codelets.Comparer = class extends Codelets.CodeletBase
{
    static Name = 'comparer';
    static Text = 'Comparer';

    
    /**
     * @constructor
     * 
     * @param {Adjudicator} adjudicator - The owner of the codelet.
     * @param {Number} urgency - The urgency of the codelet.
     * @param {Number} generation - The generation that the codelet belongs to.
     * @param {Array} args - Arguments to pass to the codelet.
     */
    constructor(adjudicator, urgency, generation, args) 
    { 
        super(Codelets.Comparer.Name, adjudicator, urgency, generation);
        this.roleFiller = structuredClone(args[0]); // [roleName, qid-list]
        this.nvType = args[1]; // One of NormViols.NvTypes ('Height', 'Width', 'Weight', etc.)
    }


    /**
     * Runs the codelet.
     */
    run()
    {
        const adj = this.owner;
        const relative_nvs = adj.styProps['relative_nvs'];
        const randGen = adj.randGen;
        const roleName = this.roleFiller[0];
        const topo = Roles[roleName].topology;

        // Display codelet info
        this.titleText    = 'Comparer codelet from generation ' + this.gen; 
        this.messageText1 = `Looking for ${this.roleFiller[0]} ${this.nvType}-norm violation`;
        this.messageText2 = '';    
        adj.app.reporter.trace(this.titleText);

        // Get an NV description, eg: [roleName, 'Height', 'more'], or [roleName, 'Tips', ['up_tip','w']], etc.
        let nvDescr = NormViols.RelativeNvType(this.roleFiller, this.nvType, adj.input.gridLetter.quantaIds, adj.input.wholeName, randGen); 
        
        // Maybe add it to the relative_nvs list
        let skip = (nvDescr == 'same') || (nvDescr == 'none') || relative_nvs.some(x => Utils.ArraysEqual(x, [roleName, this.nvType, nvDescr]));
        if (this.nvType == 'Tips') {
            skip = skip || (topo == 'loop') || (topo == 'dot') || (nvDescr[1] == 'no_move');
        }
        if (!skip) {
            adj.styProps['relative_nvs'] = [[roleName, this.nvType, nvDescr], ...relative_nvs];
        }
        
        // Maybe post a new comparer codelet
        if (randGen.coinFlip()) {
            adj.app.coderack.post(1, 'comparer', Params.MediumUrgency, this.gen+1, [randGen.choice(adj.input.roleFillers), randGen.choice(NormViols.NvTypes)]);
            this.messageText2 = 'Comparer codelet spun';
        }
    }
};

