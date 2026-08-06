/**
 * @classdesc
 * This class represents a set of Stylistic Properties.
 * 
 */
class StyProps 
{
    static SpTypes    = ['relative_nvs', 'val_to_val_nvs', 'abstract_rules', 'literal_motifs','translate_motifs', 'turn_180_motifs', 'turn_90_motifs', 'turn_45_motifs'];
    static SpWeights  = [15, 15, 10, 8, 4, 4, 3, 3];

    static 
    {
        Object.freeze(StyProps.SpTypes);
        Object.freeze(StyProps.SpWeights);
    }


    /**
     * @constructor
     */
    constructor() 
    { 
        for (const spType of StyProps.SpTypes) { 
            this[spType] = [];
        }
    }


    /**
     * Creates a deep copy of this StyProps object.
     */
    clone()
    {
        const clone = new StyProps();
        for (const spType of StyProps.SpTypes) { 
            clone[spType] = structuredClone(this[spType]);
        }
        return clone;
    }

    
    /**
     * Resets all data.
     */
    clear()
    {
        for (const spType of StyProps.SpTypes) { 
            this[spType] = [];
        }
    }


    /**
     * Returns the Stylistic Properties of a given type at a given level.
     */
    isEmpty()
    {
        return StyProps.SpTypes.every(spType => this[spType].length == 0);
    }


    /**
     * Checks if a given stylistic property is of motif type.
     * @param {String} spName 
     */
    static IsMotifType(spName) 
    { 
        return spName.endsWith('_motifs');
    }


    /**
     * Checks if a given stylistic property is of norm-viloation type.
     * @param {String} spName 
     */
    static IsNvType(spName) 
    { 
        return spName.endsWith('_nvs');
    }

};
