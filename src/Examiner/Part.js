/**
 * @classdesc
 * A Part is a joint-list, together with a set of labels.
 * 
 */
class Part
{
    /**
     * @constructor
     * 
     * @param {Joint[]} jointList - The joints that make up the part.
     * @param {Label[]} [labels=[]] - Labels for the part. 
     */
    constructor(jointList, labels=[]) 
    { 
        this.jointList = jointList.map(jt => (jt instanceof Joint) ? jt : new Joint(jt[0], jt[1]));
        this.labels = labels;
        this.quantaIds = Utils.Linearize([...new Set(this.jointList.flatMap(jt => jt.getQids()))]);
        this.quanta = this.quantaIds.map(qid => QuantaList[qid]);
        this.qidStr = '(' + this.quantaIds.join(",") + ')';
        this.color = '#000000';

        // Make immutable, except for color
        [this.jointList, this.quantaIds, this.quanta].forEach(obj => Object.freeze(obj));
        Object.keys(this).forEach(key => {
            if (key !== 'color') {Object.defineProperty(this, key, {writable: false, configurable: false});}
        });
        Object.preventExtensions(this);
    }

    
    /**
     * Returns a list of all (unique) quanta in the part.
     * 
     */
    getQuanta() 
    { 
        return this.quanta; 
    }


    /**
     * Returns a list of all (unique) quanta-ids in the part.
     * 
     */
    getQuantaIds() 
    { 
        return this.quantaIds; 
    }


    /**
     * Returns the number of quanta in the part.
     */
    numQuanta() 
    { 
        return this.quantaIds.length; 
    }


    /**
     * Returns the number of labels that the part has.
     */
    numLabels() 
    { 
        return this.labels.length; 
    }


    /**
     * Returns the number of tips that the part has.
     */
    numTips() 
    { 
        return Utils.GetTips(this).length; 
    }


    /**
     * Indicates whether the part contains a given quantum.
     * 
     * @param {Number} qid - The quantum id to look for. 
     *  
     */
    hasQid(qid)
    {
        if (!qid && qid !== 0) { return false; }
        return this.jointList.some(jt => (jt.qidA === qid) || (jt.qidB === qid));
    }


    /**
     * Indicates whether the part contains a given joint. (Does not compare glue.)
     * 
     * @param {Joint} joint - The joint to look for. 
     * 
     */
    containsJoint(joint)
    {
        return this.jointList.some(jt => jt.valueEquals(joint));
    }


    /**
     * Indicates whether the part has the same joints as another part. (Does not compare glue.)
     * 
     * @param {Part} that - The part to compare with.
     * 
     */
    hasSameJointsAs(that) 
    { 
        if (that === this) { return true; }

        return this.jointList.every(jt => that.containsJoint(jt)) && 
               that.jointList.every(jt => this.containsJoint(jt));
    } 


    /**
     * Indicates whether the part has a given label.
     * 
     * @param {string} labelText - The label text to look for. 
     * 
     */
    hasLabel(labelText)
    {
        return this.labels.some(l => l.text == labelText);
    }


    /**
     * Gets a label with the given text.
     * 
     * @param {string} labelText - The label text to look for. 
     * 
     */
    getLabel(labelText)
    {
        return this.labels.find(l => l.text == labelText);
    }


    /**
     * Adds a label to the part. (Removes any existing label with the same text.)
     * 
     * @param {Object} label - The label to add. 
     * 
     */
    addLabel(label)
    {
        this.removeLabel(label.text);
        this.labels.push(label);
    }


    /**
     * Removes a label.
     * 
     * @param {string} labelText - The text of the label to remove. 
     */
    removeLabel(labelText)
    {
        const idx = this.labels.findIndex(l => l.text == labelText);
        if (idx !== -1) { this.labels.splice(idx, 1); }
    }


    /**
     * Returns the whine value of the part.
     */
    getWhine() 
    { 
        return this.getLabel('**whine')?.data || 0; 
    }


    /**
     * Returns a string representation of the part's quantum-id list.
     */
    qidString()
    {
        return this.qidStr;
    }

};
