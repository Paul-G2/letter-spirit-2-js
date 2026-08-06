/**
 * @classdesc
 * This Adjudicator codelet compares a role-filling part with an expected norm and 
 * updates the workspace's val_to_val_nvs list accordingly. (For example, it may 
 * add ['Height', ['short', 'tall']] to the val_to_val_nvs list if a height norm violation is found.)
 * 
 */
Codelets.Stenographer = class extends Codelets.CodeletBase
{
    static Name = 'stenographer';
    static Text = 'Stenographer';

    
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
        super(Codelets.Stenographer.Name, adjudicator, urgency, generation);
        this.roleFiller = structuredClone(args[0]); // [roleName, qid-list]
        this.nvType = args[1]; // One of NormViols.NvTypes ('Height', 'Width', 'Weight', etc.)
    }


    /**
     * Runs the codelet.
     */
    run()
    {
        const adj = this.owner;
        const val_to_val_nvs = adj.styProps['val_to_val_nvs'];
        const randGen = adj.randGen;
        const roleName = this.roleFiller[0];
        const topo = Roles[roleName].topology;

        // Display codelet info
        this.titleText    = 'Stenographer codelet from generation ' + this.gen; 
        this.messageText1 = `Looking for ${this.roleFiller[0]} ${this.nvType}-norm violation`;
        this.messageText2 = '';    
        adj.app.reporter.trace(this.titleText);
        
        // Get an NV description, eg: [roleName, 'Height', ['short', 'tall']] or  [roleName, 'Tips', ['up_tip', [3,4]]
        const nvDescr = NormViols.ValToValNvType(this.roleFiller, this.nvType, adj.input.gridLetter.quantaIds, adj.input.wholeName, randGen); 
        
        // Maybe add it to the val_to_val_nvs list
        let skip = (nvDescr == 'none') || val_to_val_nvs.some(x => Utils.ArraysEqual(x, [roleName, this.nvType, nvDescr]));
        if (this.nvType == 'Tips') {
            skip = skip || (topo == 'loop') || (topo == 'dot') || (Array.isArray(nvDescr[1]) && (nvDescr[1][0] == nvDescr[1][1]));
        } else {
            skip = skip || (nvDescr[0] == nvDescr[1]);
        }
        if (!skip) {
            adj.styProps['val_to_val_nvs'] = [[roleName, this.nvType, nvDescr], ...val_to_val_nvs];
        }
        
        
        // Maybe post a new stenographer codelet
        if (randGen.coinFlip()) {
            adj.app.coderack.post(
                1, 'stenographer', Params.MediumUrgency, this.gen+1, [randGen.choice(adj.input.roleFillers), randGen.choice(NormViols.NvTypes)]);
            this.messageText2 = 'Stenographer codelet spun';
        }
    }
};

