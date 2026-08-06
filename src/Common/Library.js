/**
 * @classdesc
 * This class stores ...
 * 
 */
class Library 
{
    /**
     * @constructor
     */
    constructor(app) 
    { 
        this.app = app;
        this.entries = []; // Each entry is an object: {letterCategory, qids, wholeName, fillers, styProps}; 
    }


    /**
     * Empties the library.
     */
    clear()
    {
        this.entries = [];
    }


    /**
     * Returns the number of entries in the library.
     */
    length()
    {
        return this.entries.length;
    }


    /**
     * Adds a library entry to the library.
     */
    addEntry(libraryEntry)
    {
        this.entries = this.entries.filter(e => e.letterCategory != libraryEntry.letterCategory);
        this.entries.unshift(libraryEntry);
    }

    
    /**
     * Returns all the letter-categories in the library.
     */
    categories()
    {
        return this.entries.map(e => e.letterCategory);
    }


    /**
     * Returns the library entry for a given letter-category.
     */
    getEntry(cat)
    {
        return this.entries.find(e => e.letterCategory == cat);
    }


    /**
     * Returns all role-fillers in the library for a given role.
     */
    lookupRoleFillers(roleName)
    {
        const roleFillers = [];
        this.entries.forEach(entry => 
            roleFillers.push(...entry.fillers.filter(filler => filler[0] == roleName))
        );
        return roleFillers;
    }

};
