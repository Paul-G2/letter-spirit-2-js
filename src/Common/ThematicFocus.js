/**
 * @classdesc
 * The ThematicFocus is a container for Stylistic Properties (SPs), that collectively 
 * characterize a gridfont's style.
 * 
 */
class ThematicFocus 
{
    static LevelNames = ['letter_rows', 'two_time_sps', 'occasional_sps', 'common_sps', 'frequent_sps', 'universal_sps'];
    static { Object.freeze(ThematicFocus.LevelNames); }


    /**
     * @constructor
     * 
     * @param {App} app - The LetterSpirit App instance.
     */
    constructor(app) 
    { 
        this.app = app;

        // Stylistic Properties at 6 levels
        this.styProps = Object.fromEntries(ThematicFocus.LevelNames.map(levelName => [levelName, new StyProps()]));
    }


    /**
     * Clears all the Stylistic Properties.
     */
    reset()
    {
        Object.values(this.styProps).forEach(styProps => styProps.clear());
    }


    /**
     * Adds a Stylistic Property at a given level.
     */
    addStyProp(level, spType, newStyProp)
    {
        this.styProps[level][spType] = this.styProps[level][spType].filter(sp => !Utils.ArraysEqual(sp, newStyProp));
        this.styProps[level][spType].unshift(newStyProp);
    }


    /**
     * Demotes a Stylistic Property to a lower level.
     */
    demote(spType, oldLevel, spToDemote) 
    {
        if ((oldLevel != 'letter_rows') && (oldLevel != 'two_time_sps')) {
            const LevelNames = ThematicFocus.LevelNames;
            const newLevel = LevelNames[LevelNames.indexOf(oldLevel) - 1];
            this.styProps[oldLevel][spType] = this.styProps[oldLevel][spType].filter(sp => !Utils.ArraysEqual(sp, spToDemote));
            this.addStyProp(newLevel, spType, spToDemote);
        }
    };


    /**
     * Promotes a Stylistic Property to a higher level.
     */
    promote(spType, oldLevel, spToPromote, match)
    {
        if (oldLevel != 'universal_sps') 
        {
            const LevelNames = ThematicFocus.LevelNames;
            const newLevel = LevelNames[LevelNames.indexOf(oldLevel) + 1];
            if (!StyProps.IsMotifType(spType) || (spToPromote.length == match.length) || (spToPromote.length > 2)) {
                // Don't remove old multi-quanta motifs from early levels; they may form the basis for multiple promotions.
                this.styProps[oldLevel][spType] = this.styProps[oldLevel][spType].filter(sp => !Utils.ArraysEqual(sp, spToPromote));
            }
            this.addStyProp(newLevel, spType, match);
        }
    }


    /**
     * Returns the Stylistic Properties of a given type at a given level.
     */
    getStyProps(spType, levelName)
    {
        return this.styProps[levelName][spType];
    }


    /*
     * Returns a score for given level, which is just its index in the LevelNames array, plus one.
     */
    static LevelScore(levelName)
    {
        return 1 + ThematicFocus.LevelNames.indexOf(levelName);
    }
  

    /*
     * Returns the number of non-empty levels in the ThematicFocus.
     */
    numNonEmptyLevels()
    {
        return Object.values(this.styProps).reduce((acc, sp) => acc + (sp.isEmpty() ? 0 : 1), 0);
    }
  

    /*
     * Returns name of the maximum occupied level.
     */
    maxNonEmptyLevel()
    {
        for (let i=5; i>=0; i--) {
            if (!this.styProps[ThematicFocus.LevelNames[i]].isEmpty()) {
                return i;
            }
        }
        return null;
    }
  

    /*
     * Returns a probability value for given Stylistic Property.
     */
    static SpProb(spType, sp) 
    {
        switch (spType) {
            case 'abstract_rules': 
                return 0.25;
            case 'val_to_val_nvs': 
                return 0.08;
            case 'relative_nvs': 
                return 0.25;
            case 'literal_motifs': 
                return Math.pow(0.35, sp.length);
            case 'translate_motifs': 
                return Math.pow(0.42, sp.length);
            case 'turn_180_motifs': 
                return Math.pow(0.6, sp.length);
            case 'turn_90_motifs': 
                return Math.pow(0.7, sp.length);
            default: 
                return Math.pow(0.9, sp.length - 1);
        }
    }


    /*
     * Returns an importance value for given Stylistic Property.
     */
    spImportance(spType, level, sp, failed=false)
    {
        let perSp;
        const Lsq = sp.length * sp.length;
        
        switch (spType) {
            case 'abstract_rules':
            case 'val_to_val_nvs':
                perSp = 5.0; 
                break;
            case 'relative_nvs':
                perSp = 0.6; 
                break;
            case 'literal_motifs':
                perSp = 0.6 * Lsq; 
                break;
            case 'translate_motifs':
                perSp = 0.3 * Lsq; 
                break;
            case 'turn_180_motifs':
                perSp = 0.2 * Lsq; 
                break;
            case 'turn_90_motifs':
                perSp = 0.1 * Lsq; 
                break;
            default:
                perSp = 0.05 * Lsq;
        }
        const score = this.draftLevelScore(spType, level, sp);
        return failed ? score/perSp : score*perSp;
    }


    /*
     * Returns a probability for promoting a Stylistic Property in a given level.
     */
    static PromoteProb(levelName, spType) 
    {
        let multiplier;
        switch (spType) {
            case 'literal_motifs':   multiplier = 3.0;  break;
            case 'relative_nvs':     multiplier = 1.4;  break;
            case 'abstract_rules':   multiplier = 1.4;  break;
            case 'translate_motifs': multiplier = 1.0;  break;
            case 'val_to_val_nvs':   multiplier = 0.45; break;
            default: multiplier = 0.3;
        }
        return multiplier * Math.max(0, (6.0 - ThematicFocus.LevelScore(levelName)) / 5);
    };


    /*
     * Returns a probability for demoting a Stylistic Property in a given level.
     */
    static DemoteProb(levelName, spType) 
    {
        const multiplier = (spType === 'abstract_rules') ? 10 : 1;
        return multiplier * Math.max(0, (ThematicFocus.LevelScore(levelName) - 2) / 4);
    };


    /*
     * Returns a level score for the drafter.
     */
    draftLevelScore(spType, levelName, sp)
    {
        const levelExpect = Math.round((this.numNonEmptyLevels() - 1.45) * ThematicFocus.SpProb(spType, sp) + 1.55);
        return Math.max(0, ThematicFocus.LevelScore(levelName) - levelExpect);
    }
};
