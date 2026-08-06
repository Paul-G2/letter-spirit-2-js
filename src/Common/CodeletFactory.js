/**
 * @classdesc
 * This class is responsible for creating codelets.
 * 
 */
 class CodeletFactory
 {
    /**
     * @constructor
     * 
     * @param {App} app - The App instance that owns this factory.
     */
    constructor(app) 
    { 
        this.app = app;
    }


    /**
     * Creates a codelet given its name and construction arguments.
     * 
     * @param {string} name - The name of the codelet.
     * @param {Number} urgency - The urgency of the codelet.
     * @param {Number} generation - The generation that the codelet belongs to. 
     * @param {Array} codeletArgs - Arguments to pass to the codelet.
     * 
     */
    create(name, urgency, generation, codeletArgs)
    {
        const app = this.app;
        const ctorArgs = [urgency, generation, codeletArgs];

        let result = null;
        switch (name) 
        {
            // Examiner codelets
            case 'breaker':
                result = new Codelets.Breaker(app.examiner, ...ctorArgs);
                break;

            case 'gestalt':
                result = new Codelets.Gestalt(app.examiner, ...ctorArgs);
                break;

            case 'glue-ant':
                result = new Codelets.GlueAnt(app.examiner, ...ctorArgs);
                break;

            case 'label-checker':
                result = new Codelets.LabelChecker(app.examiner, ...ctorArgs);
                break;

            case 'labeler':
                result = new Codelets.Labeler(app.examiner, ...ctorArgs);
                break;

            case 'looker':
                result = new Codelets.Looker(app.examiner, ...ctorArgs);
                break;

            case 'pacifier':
                result = new Codelets.Pacifier(app.examiner, ...ctorArgs);
                break;  

            case 'shaker':
                result = new Codelets.Shaker(app.examiner, ...ctorArgs);
                break;    
        
            case 'sparker':
                result = new Codelets.Sparker(app.examiner, ...ctorArgs);
                break;    
        
            case 'spreader':
                result = new Codelets.Spreader(app.examiner, ...ctorArgs);
                break;    
            
            case 'top-down-breaker':
                result = new Codelets.TopDownBreaker(app.examiner, ...ctorArgs);
                break;    
                    
            case 'top-down-glommer':
                result = new Codelets.TopDownGlommer(app.examiner, ...ctorArgs);
                break;


            // Adjudicator codelets
            case 'bridge-ahead':
                result = new Codelets.BridgeAhead(app.adjudicator, ...ctorArgs);
                break;

            case 'bridge-back':
                result = new Codelets.BridgeBack(app.adjudicator, ...ctorArgs);
                break;

            case 'comparer':
                result = new Codelets.Comparer(app.adjudicator, ...ctorArgs);
                break;

            case 'constable':
                result = new Codelets.Constable(app.adjudicator, ...ctorArgs);
                break;

            case 'promoter':
                result = new Codelets.Promoter(app.adjudicator, ...ctorArgs);
                break;

            case 'stenographer':
                result = new Codelets.Stenographer(app.adjudicator, ...ctorArgs);
                break;

            case 'worm':
                result = new Codelets.Worm(app.adjudicator, ...ctorArgs);
                break;


            // Drafter codelets
            case 'breadcrumb':
                result = new Codelets.Breadcrumb(app.drafter, ...ctorArgs);
                break;
            
            case 'finisher':
                result = new Codelets.Finisher(app.drafter, ...ctorArgs);
                break;

            case 'homing':
                result = new Codelets.Homing(app.drafter, ...ctorArgs);
                break;

            case 'motif-rewarder':
                result = new Codelets.MotifRewarder(app.drafter, ...ctorArgs);
                break;

            case 'rule-enforcer':
                result = new Codelets.RuleEnforcer(app.drafter, ...ctorArgs);
                break;

            case 'touching':
                result = new Codelets.Touching(app.drafter, ...ctorArgs);
                break;

            case 'trait-met-reward':
                result = new Codelets.TraitMetReward(app.drafter, ...ctorArgs);
                break;

            case 'trait-progress-reward':
                result = new Codelets.TraitProgressReward(app.drafter, ...ctorArgs);
                break;


            default:
                    throw new Error('Unknown codelet name, in CodeletFactory.create: ' + name);
        }
        return result;
    }
};