/**
 * @description
 * This file contains Letter Spirit's configuration parameters.
 * 
 */

// Diagnostics flags
Params.PrintTraceMessages = false;
Params.PrintTraceDetailMessages = false;

// The pause between codelet runs, in msec
Params.InitialStepDelay = 0; 

// Codelet urgencies
Params.VeryHighUrgency = 100;
Params.HighUrgency = 50;
Params.MediumUrgency = 25;
Params.LowUrgency = 10;

// Factor for suppressing later-generation codelets (1 means no suppression)
Params.GenerationGapConstant = 1;

// Number of codelets to run in the Examiner phase
Params.NumExamPhaseCodelets = 800;

// Maximum number of codelets to run overall
Params.MaxExaminerCodelets = 10 * Params.NumExamPhaseCodelets;

// Whether to use GlueAnt and Shaker codelets
Params.AntsEnabled = true;

// The number of glue-placing iterations in GlueAnt
Params.RedundantC = 500; 

// Amount of glue to put down for given angle-values
Params.GlueByAngle = {0:6, 45:4, 90:3, 135:1};

// Avg number of quanta in a part (Shaker) 
Params.ShakePartSize = 2.7;

// Probability of dissolving one unit of glue (Shaker)
Params.SolventStrength = 0.90;

// Reduction factor for sparking, applied after phase
Params.SparkerReductionFactor = 0.9;

// Number of labels attached to "finished" part
Params.LabelTotal = 16;

// Value of each label
Params.LabelValue = 100 / Params.LabelTotal;

// Number of labeler codelets add at a time
Params.LabelerBatchSize = 10;

// Number of gestalt codelets to add at a time
Params.GestaltBatchSize = 1;

// Urgency of the initial gestalt codelets
Params.InitialGestaltCodeletUrgency = Params.VeryHighUrgency;

// Delta-whine for overlooked parts
Params.WhineIncrement = 10;

// Activations above this value count towards temperature adjustments
Params.WholeThreshold = 51;

// rRoleScore penalty incurred if not all roles in the whole are filled
Params.FilledPenalty = 50;

// rRoleScore penalty incurred if some parts don't fill a role
Params.CoveredPenalty = 50;

// rRoleScore penalty incurred if the parts don't touch in the right way
Params.TouchPenalty = 50;

// Penalty for feature mis-match
Params.InitialPunish = -25;

// Harsh penalty for feature mis-match
Params.InitialPunishHard = -40;

// Score threshold for assigning a role to a part
Params.InitialSparkThreshold = 50;

// Scale factore for normalizing feature scores
Params.MaxFeatureScore = 70;

// Scale factor for normalizing topology scores
Params.MaxTopoScore = {segment:210, bisegment:220, loop:80, dot:80};

// Scale factor for normalizing gestalt scores
Params.GestaltPerk = 20;

// Weight used when spreading activations
Params.LinkWeight = 0.6;

// Maximum number of drafter draws
Params.MaxTotalDrafterDraws = 300;

// Whether to use the tough promotion threshold
Params.ToughPromotion = true;

// Number of codelets to initially post in the Drafter phase
Params.NumDrafterCodelets = 15;

// Punishment values for drafter codelets
Params.DrafterPunish = -5000;
Params.DrafterPunishHard = -6000;


