/**
 * @classdesc
 * A Joint is a pair of neighboring quanta with glue, or a single quantum.
 * 
 */
 class Joint
 {
    /**
     * @constructor
     * 
     * @param {Number} qidA - The id of the first quantum.
     * @param {Number} [qidB=undefined] - The id of the second quantum (can be undefined).
     * @param {Number} [glue=0] - The glue between the two quanta.
     */
    constructor(qidA, qidB, glue) 
    { 
        this.qidA = qidA;
        this.qidB = qidB;
        this.glue = glue || 0;

        // Validation check
        if (this.qidB || (this.qidB === 0)) {
            if (!Knowledge.QuantaNeighbors[this.qidA].includes(this.qidB)) { throw new Error('Joint: input quanta must be neighbors.'); }
        }
    }

    /**
     * Returns a copy of the joint.
     */
    clone() 
    { 
        return new Joint(this.qidA, this.qidB, this.glue); 
    }


    /**
     * Returns joint with quanta reversed.
     */
    reverse() 
    { 
        return (this.qidB === undefined) ? this.clone() : new Joint(this.qidB, this.qidA, this.glue); 
    }


    /**
     * Returns whether the joint is equal-by-value to another joint.
     * NB: The glue-values, and the order of the quanta are not considered.
     * 
     */
    valueEquals(that) 
    {
        if (that.numQuanta() === 1) { 
            return (this.numQuanta() === 1) && (this.qidA === that.qidA);
        }
        else {
            return (this.numQuanta() === 2) && (((this.qidA === that.qidA) && (this.qidB === that.qidB)) ||
                ((this.qidA === that.qidB) && (this.qidB === that.qidA)));
        }
    }


    /**
     * Returns the ids of the quanta in the joint.
     * 
     */
    getQids() 
    { 
        return (this.qidB || (this.qidB === 0)) ? [this.qidA, this.qidB] : [this.qidA];
    }


    /**
     * Returns whether the joint contains a given quantum.
     * 
     */
    hasQid(qid) 
    { 
        return ((this.qidA === qid) || (this.qidB === qid));
    }


    /**
     * Returns whether the joint is a single-quantum joint.
     * 
     */
    isSinglet() 
    { 
        return (!this.qidB && (this.qidB !== 0));
    }


    /**
     * Returns the number of quanta in the joint.
     * 
     */
    numQuanta() 
    { 
        return (this.qidB || (this.qidB === 0)) ? 2 : 1; 
    }


    /**
     * Returns a string representation of the joint.
     * 
     * @param {Boolean} includeGlue - Whether to include the glue value in the string.s
     * 
     */
    toString(includeGlue=false)
    {
        const jointStr = `(${this.qidA}` + ((this.qidB || (this.qidB === 0)) ? `,${this.qidB}` : '') + ')';
        return includeGlue ? `[${jointStr}, ${this.glue}]` : jointStr;
    }

};
