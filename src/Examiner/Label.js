/**
 * @classdesc
 * A label is a (text, data) pair that describes a feature of a Part.
 * 
 */
 class Label 
 {
    /**
     * @constructor
     * 
     * @param {String} text - The label text.
     * @param {Object} [data] - The label data.
     */
    constructor(text, data) 
    { 
        this.text = text;
        this.data = data;
        this.stringRep = this._getStringRep();
        
        [this.data, this.text, this.stringRep, this].forEach(obj => Object.freeze(obj));
    }


    /**
     * Indicates whether the label has any associated data.
     * 
     */
    hasData() 
    { 
        return ((this.data !== undefined) && (this.data !== null));
    }

    
    /**
     * Creates a label for a Part whose quanta 
     * are in the reverse order of this label's quanta. 
     * 
     */
    toFlipped() 
    { 
        const TipFlipMap = Knowledge.TipFlipMap;
 
        switch (this.text) {
            case 'curve': 
            case 'curve1':
            case 'curve2': 
            case 'contact':
                return new Label((TipFlipMap[this.text] || this.text), (TipFlipMap[this.data] || this.data));

            case 'ends': 
            case 'tips': 
            case 'quanta':
                return new Label(this.text, this.data.slice().reverse());

            default:
                return new Label(this.text, this.data);
        }   
    }


    /**
     * Returns a string representation of the label.
     * 
     */
    toString() 
    { 
        return this.stringRep; 
    }


    /**
     * Computes a string representation of the label.
     * @private
     * 
     */
    _getStringRep()
    {
        let str = this.text;

        switch (this.text) {
            case 'curve': 
            case 'curve1':
            case 'curve2': 
            case 'contact':
            case 'shape':
                return str + ': ' + this.data;

            case 'ends': 
            case 'tips': 
                return str + ': (' + this.data[0].join(',') + ') (' + this.data[1].join(',') + ')';

            case 'neighborhood':
                return ('nbrs' + ': (' + this.data.join(',') + ')').replaceAll('eq','e');

            case 'quanta':
                return str + ': (' + this.data.join(',') + ')';

            default:
                return str;
        }   
    }

};
