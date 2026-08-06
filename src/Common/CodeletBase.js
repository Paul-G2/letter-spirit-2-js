/**
 * @classdesc
 * This is the base class for all codelets.
 * 
 */
Codelets.CodeletBase = class
 {
    /**
     * @constructor
     * 
     * @param {string} name - The name of the codelet.
     * @param {Object} ownwer - The owner of the codelet.
     * @param {Number} urgency - The urgency of the codelet.
     * @param {Number} generation - The generation that the codelet belongs to.
     */
    constructor(name, owner, urgency, generation) 
    { 
        this.name = name;
        this.owner = owner;
        this.urgency = urgency || 0;
        this.gen = generation || 0;

        this.titleText = ''; 
        this.messageText1 = '';
        this.messageText2 = ''; 
    }
};
