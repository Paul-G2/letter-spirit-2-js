/**
 * @classdesc
 * A GridLetter is a set of quanta that represents a letter.
 * 
 */
class GridLetter
{
    /**
     * @constructor
     * 
     * @param {Quantum[]|number[]} [quanta] - The quanta or quanta-ids that make up the letter.
     */
    constructor(quanta) 
    {
        this.quanta = (quanta || []).map(q => Number.isInteger(q) ? QuantaList[q] : q);
        this.quantaIds = this.quanta.map(q => q.id);
        this.bitVec = [...Array(56).keys()].map(i => this.quantaIds.includes(i) ? 1 : 0);
        this.numQuanta = this.quanta.length;

        // Make immutable
        [this.quanta, this.quantaIds, this.bitVec].forEach(arr => Object.freeze(arr));
        Object.freeze(this);
    }


    /**
     * Creates a clone of the letter.
     */
    clone() 
    { 
        return new GridLetter(this.quanta); 
    }


    /**
     * Indicates whether the letter has no quanta.
     */
    isEmpty() 
    { 
        return this.quanta.length === 0; 
    }  


    /**
     * Indicates whether the letter has at least one pair of touching quanta. 
     */
    hasAdjacentQuanta() 
    { 
        return this.quanta.some(q => q.neighbors.some(
            nb => ((nb !== null) && this.quantaIds.includes(nb))));
    } 


    /**
     * Indicates whether the letter is equal by value to another letter.
     * @param {GridLetter} that - The letter to compare with.
     */
    valueEquals(that) 
    { 
        // Compare string representations
        return ( this.quantaIds.toSorted().join(',') === that.quantaIds.toSorted().join(',') ); 
    }


    /**
     * Computes a measure of the distance between this letter and another.
     * @param {GridLetter} that - The letter to compare with.
     */
    distanceTo(that) 
    { 
        return this.bitVec.reduce( (absdiff, bit, i) => absdiff + Math.abs(bit - that[i]), 0 );
    }

};