/**
 * @classdesc
 * A Quantum is a single segment of a letterform.
 * 
 */
class Quantum
{
    static quantaListInitialized = false;

    /**
     * @constructor
     * 
     * @param {number} id - The id of the quantum (0-55).
     * @param {number} startPointId - The id of the quantum's start point (1-21)
     * @param {number} endPointId - The id of the quantum's end point (1-21)
     */
    constructor(id, startPointId, endPointId)  
    {
        // Check input 
        if ((id < 0) || (id > 55) || (startPointId < 1) || (startPointId > 21) || 
            (endPointId < 1) || (endPointId > 21) || (endPointId <= startPointId)) { 
            throw new Error("Invalid args, in Quantum constructor"); 
        }

        // Quanta are singletons, created for the static Quanta list below.
        if (Quantum.quantaListInitialized) { throw new Error("Quanta have already been created."); }

        // Cache inputs
        this.id = id;
        this.startPointId = startPointId;
        this.endPointId = endPointId;
        this.pointIds = [startPointId, endPointId];

        // Coordinates of the quantum ends. (x-range is 0-3, y-range is 0-6)
        this.startPoint = Utils.PointIdToXYCoords(startPointId);
        this.endPoint   = Utils.PointIdToXYCoords(endPointId);
        this.length = Math.sqrt((this.endPoint.x - this.startPoint.x)**2 + (this.endPoint.y - this.startPoint.y)**2);

        // Coordinates of the shortened-quantum ends (for drawing)
        let [dx, dy] = [this.endPoint.x - this.startPoint.x, this.endPoint.y - this.startPoint.y];
        this.startPointSh = {x: this.startPoint.x + 0.13*dx, y: this.startPoint.y + 0.13*dy};
        this.endPointSh   = {x: this.endPoint.x - 0.13*dx,   y: this.endPoint.y - 0.13*dy};

        // Center 
        this.center = {x:(this.startPoint.x + this.endPoint.x)/2, y:(this.startPoint.y + this.endPoint.y)/2};
        
        // Neighbors
        this.neighbors = Knowledge.QuantaNeighbors[id];

        // Make immutable
        [this.pointIds, this.startPoint, this.endPoint, this.startPointSh, this.endPointSh, this.center, this.neighbors, this].
            forEach(obj => Object.freeze(obj));

        if (id === 55) { Quantum.quantaListInitialized = true; }
    }


    /** 
     * Gets a Quantum given the ids of its end points.
     * 
     */ 
    static FromPointIds(id1, id2)
    {
        return QuantaList.find(q => 
            (q.startPointId === id1 && q.endPointId === id2) || (q.startPointId === id2 && q.endPointId === id1)
        );
    }

    /** 
     * Gets a Quantum given its end points.
     * 
     */ 
    static FromPoints(p1, p2)
    {
        return QuantaList.find(q => 
            ((q.startPoint.x === p1.x) && (q.startPoint.y === p1.y) && (q.endPoint.x === p2.x) && (q.endPoint.y === p2.y)) ||
            ((q.startPoint.x === p2.x) && (q.startPoint.y === p2.y) && (q.endPoint.x === p1.x) && (q.endPoint.y === p1.y))
        );
    }

};


 
/**
 * The static list of all 56 Quanta.
 * By convention, startPointId is always less than endPointId.
 * @readonly
 * 
 */
const QuantaList = 
[
    // Horizontal
    new Quantum(0,  1,8),
    new Quantum(1,  8,15),
    new Quantum(2,  2,9),
    new Quantum(3,  9,16),
    new Quantum(4,  3,10),
    new Quantum(5,  10,17),
    new Quantum(6,  4,11),
    new Quantum(7,  11,18),
    new Quantum(8,  5,12),
    new Quantum(9,  12,19),
    new Quantum(10, 6,13),
    new Quantum(11, 13,20),
    new Quantum(12, 7,14),
    new Quantum(13, 14,21),

    // Vertical
    new Quantum(14, 1,2),
    new Quantum(15, 8,9),
    new Quantum(16, 15,16),
    new Quantum(17, 2,3),
    new Quantum(18, 9,10),
    new Quantum(19, 16,17),
    new Quantum(20, 3,4),
    new Quantum(21, 10,11),
    new Quantum(22, 17,18),
    new Quantum(23, 4,5),
    new Quantum(24, 11,12),
    new Quantum(25, 18,19),
    new Quantum(26, 5,6),
    new Quantum(27, 12,13),
    new Quantum(28, 19,20),
    new Quantum(29, 6,7),
    new Quantum(30, 13,14),
    new Quantum(31, 20,21),

    // Forward slash
    new Quantum(32, 2,8),
    new Quantum(33, 9,15),
    new Quantum(34, 3,9),
    new Quantum(35, 10,16),
    new Quantum(36, 4,10),
    new Quantum(37, 11,17),
    new Quantum(38, 5,11),
    new Quantum(39, 12,18),
    new Quantum(40, 6,12),
    new Quantum(41, 13,19),
    new Quantum(42, 7,13),
    new Quantum(43, 14,20),

    // Backslash
    new Quantum(44, 1,9),
    new Quantum(45, 8,16),
    new Quantum(46, 2,10),
    new Quantum(47, 9,17),
    new Quantum(48, 3,11),
    new Quantum(49, 10,18),
    new Quantum(50, 4,12),
    new Quantum(51, 11,19),
    new Quantum(52, 5,13),
    new Quantum(53, 12,20),
    new Quantum(54, 6,14),
    new Quantum(55, 13,21)
];
// Make immutable
Object.freeze(QuantaList);
