/**
 * @classdesc
 * This Drafter codelet adds points to both sugar scores of each candidate, based on how well
 * the candidate would make the role-filler that is being drafted match the given motif.
 * (Motifs that are higher in the Thematic Focus award more points.)
 * 
 */
Codelets.MotifRewarder = class extends Codelets.CodeletBase
{
    static Name = 'motif-rewarder';
    static Text = 'Motif/Rewarder';

    
    /**
     * @constructor
     * 
     * @param {Drafter} owner - The owner of the codelet.
     * @param {Number} urgency - The urgency of the codelet.
     * @param {Number} generation - The generation that the codelet belongs to.
     * @param {Array} args - Arguments to pass to the codelet.
     */
    constructor(owner, urgency, generation, args) 
    { 
        super(Codelets.MotifRewarder.Name, owner, urgency, generation);
        this.spType = args[0];
        this.motif = args[1];
        this.tfLevelName = args[2];
    }


    /**
     * Runs the codelet.
     */
    run()
    {
        // Display codelet info
        const drafter = this.owner;
        const tf = drafter.app.thematicFocus;
        this.titleText    = 'MotifRewarder from generation ' + this.gen; 
        this.messageText1 = '';
        this.messageText2 = '';    
        drafter.app.reporter.trace(this.titleText);
        
        this.messageText1 = '(' + drafter.currentPoint + ') --> ';
        drafter.candidates.forEach(cand => {
            const score = this.motifScore(cand);
            drafter.addChoice(cand, score, 7);
            this.messageText1 += '(' + cand.pid + ')' + Math.round(score) + '  ';
        });
    }


    /**
     * Calculates a motif score.
     */
    motifScore(cand)
    {
        const drafter = this.owner;
        const tf = this.owner.app.thematicFocus;
        const spType = this.spType;
        
        const already = Codelets.MotifRewarder.QuantaToMotif(spType, drafter.ownStuff);
        const sublists = Motif.MotifSublists(spType, this.motif);
        const noOverlapScore = Utils.SublistsInclude(sublists, already).length;
        const motifBonus = (spType == 'literal_motifs') ? 1.5 : (spType == 'translate_motifs') ? 0.32 : 
            (spType == 'turn_180_motifs') ? 0.21 : (spType == 'turn_90_motifs') ? 0.16 : 0.12;

        const match = Utils.SublistsInclude(sublists, Codelets.MotifRewarder.QuantaToMotif(spType, [...drafter.ownStuff, cand.qid]));
        const matchSize = match.length;
        return (matchSize <= noOverlapScore) ? 0 :
            100 * tf.draftLevelScore(spType, this.tfLevelName, match) * matchSize*motifBonus*(matchSize - noOverlapScore);
    }


    /**
     * Converts a list of quanta to a motif.
     */
    static QuantaToMotif(spType, qList)  
    {
        const threshold = (spType == 'turn_45_motifs') ? 2 : 1;
        if (qList.length < threshold) { return []; }

        switch (spType) {
            case 'literal_motifs':
                return qList;
            case 'turn_45_motifs':
                return Utils.QuantaToAngles(qList);
            default:
                return Utils.QuantaToCompass(qList);
        }
    };
};

