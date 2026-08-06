/**
 * @classdesc
 * This class defines the Role objects.
 * 
 */
class Roles
{
   /**
     * @constant
     * @static
     */
    static a_arch = {
        name: "a_arch",
        shortName: "a-arch",
        topology: "segment",
        stroke: "downright",
        norms: {
            shape: Object.fromEntries([ 
                ["simple", 40], ["bactrian", 30], ["cupped", 10], ["spiky_closure", -10] 
            ]),
            neighborhood: [
                [["dc", "n", "dc", "dc", "dc", "y", "dc", "dc"], 20]
            ],
            contact: {
                a1: Object.fromEntries( [["mt2", 20], ["2ms", 15], ["t2", 1], ["m", 1]] ),
                a2: Object.fromEntries( [["t2", 13], ["m", 20]] )
            },
            tips: [{
                    location: Object.fromEntries( [[3, 10], [4, 7], [10, 6], [11, 6]] ),
                    orientation: Object.fromEntries( [["w", 10], ["n", 6], ["sw", 7], ["nw", 7], ["s", 6]] )
                }, {
                    location: Object.fromEntries( [[19, 10], [18, 7], [12, 6]] ),
                    orientation: Object.fromEntries( [["s", 10], ["se", 6], ["sw", 6], ["e", 7], ["n", 7]] )
                }],
            ends: [
                Object.fromEntries( [[[4, "w"], 40], [[20, "n"], 10], [[36, "sw"], 20], [[48, "nw"], 20],
                 [[5, "w"], 10], [[20, "s"], 10], [[37, "sw"], 10], [[21, "s"], 10],
                 [[48, "se"], 10]] ),

                Object.fromEntries( [[[25, "s"], 40], [[51, "se"], 7], [[22, "s"], 7], [[25, "n"], 13],
                 [[39, "sw"], 7], [[9, "e"], 7]] )
            ],
            curve: Object.fromEntries( [
                ["square_left", 10], ["straight", 9], ["slight_left", 9], ["slight_right", 7], ["strong_left", 7] 
            ]),
            short: 10, very_short: 6, wide: 10, half_wide: 6,
            medium_wt: 10, light: 6,  roof_x_height: 10, floor_baseline: 10,
            floor_midline: 6, l_edge_lf: 10, l_edge_md: 6, r_edge_rt: 10
        }
    };
   

   /**
     * @constant
     * @static
     */
    static backslash = {
        name: "backslash",
        shortName: "b-slash",
        topology: "segment",
        stroke: "downright",
        norms: {
            shape: Object.fromEntries( [
                ["simple", 40], ["bactrian", 0], ["cupped", 20], ["spiky_closure", -10]
            ]),
            neighborhood: [
                [["dc", "y", "dc", "n", "dc", "y", "dc", "n"], 20]
            ],
            contact: {
                x1: Object.fromEntries( [["m", 20]] ),
                y2: Object.fromEntries( [["t2", 20]] )
            },
            tips: [{
                    location: Object.fromEntries( [[3, 10], [4, 9], [10, 9], [5, 7]] ),
                    orientation: Object.fromEntries( [["nw", 10], ["n", 9], ["ne", 9], ["sw", 8], ["s", 9], ["e", 7], ["w", 7]] )
                }, {
                    location: Object.fromEntries( [[19, 10], [18, 7], [12, 7]] ),
                    orientation: Object.fromEntries( [["se", 10], ["n", 8], ["s", 7], ["e", 9], ["sw", 8], ["w", 7]] )
                }],
            ends: [
                Object.fromEntries( [[[48, "nw"], 40], [[20, "n"], 20], [[36, "ne"], 40], [[36, "sw"], 40],
                 [[20, "s"], 40], [[4, "e"], 20], [[21, "n"], 20], [[4, "w"], 20],
                 [[38, "sw"], 20]] ),

                Object.fromEntries( [[[51, "se"], 40], [[25, "n"], 20], [[25, "s"], 10], [[9, "e"], 30],
                 [[39, "sw"], 20], [[24, "s"], 10], [[9, "w"], 10]] )
            ],
            curve: Object.fromEntries( [
                ["straight", 10], ["square_right", 7], ["slight_right", 7], ["slight_left", 7], ["square_left", 8]
            ]),
            short: 10, very_short: 8, skinny: 8, wide: 10, half_wide: 8, light: 8,
            heavy: 6, medium_wt: 10, roof_x_height: 10, roof_midline: 8, floor_baseline: 10, 
            l_edge_lf: 10, l_edge_md: 8, r_edge_rt: 10
        }
    };
    

   /**
     * @constant
     * @static
     */
    static basebar = {
        name: "basebar", 
        shortName:"b-bar",
        topology: "segment",
        stroke: "right",
        norms: {
            shape: Object.fromEntries([
                ["simple", 40], ["bactrian", 30], ["cupped", 40], ["spiky_closure", -10]
            ]),
            neighborhood: [
                [["y", "dc", "dc", "dc", "dc", "dc", "dc", "dc"], 20]
            ],
            contact: {
                z1: Object.fromEntries( [["t1", 20], ["t1m", 1]] )
            },
            tips: [{
                    location: Object.fromEntries( [[5, 10], [4, 7], [3, 6]] ),
                    orientation: Object.fromEntries( [["w", 8], ["n", 6], ["nw", 7], ["e", 6]] )
                }, {
                    location: Object.fromEntries( [[19, 8], [17, 6], [18, 7], [12, 6], [20, 6]] ),
                    orientation: Object.fromEntries( [["e", 9], ["n", 6], ["ne", 6], ["s", 6]] )
                }],
            ends: [
                Object.fromEntries( [[[8, "w"], 40], [[23, "n"], 8], [[50, "nw"], 16], [[20, "n"], 8],
                 [[8, "e"], 8], [[52, "nw"], 8]] ),

                Object.fromEntries( [[[9, "e"], 40], [[22, "n"], 13], [[39, "ne"], 27], [[8, "e"], 27],
                 [[25, "s"], 13], [[25, "n"], 13], [[11, "e"], 13]] )
            ],
            curve: Object.fromEntries( [
                ["straight", 10], ["square_right", 7], ["slight_right", 7], ["slight_left", 6]
            ]),
            no_height: 10, short: 6, very_short: 9, wide: 10, half_wide: 6, light: 10,
            medium_wt: 8, very_light: 6, roof_baseline: 10, roof_x_height: 6, roof_midline: 8,
            floor_baseline: 11, floor_middown: 6, l_edge_lf: 10, r_edge_rt: 10, r_edge_md: 6
        }
    };
    

   /**
     * @constant
     * @static
     */
    static cap = {
        name: "cap", 
        shortName:"cap",
        topology: "segment",
        stroke: "right",
        norms: {
            shape: Object.fromEntries([
                ["simple", 40], ["bactrian", 40], ["cupped", 40], ["spiky_closure", -10]
            ]),
            neighborhood: [
                [["dc", "dc", "n", "dc", "dc", "y", "dc", "dc"], 20],
                [["n", "n", "dc", "dc", "y", "dc", "dc", "dc"], 20]
            ],
            contact: {
                r1: Object.fromEntries( [["t1", 20], ["m", 11]] ),
                s1: Object.fromEntries( [["t1", 20], ["m", 11]] )
            },
            tips: [{
                    location: Object.fromEntries( [[3, 10], [4, 9], [10, 7], [11, 6], [17, 6]] ),
                    orientation: Object.fromEntries( [["w", 10], ["ne", 7], ["sw", 9], ["s", 8], ["e", 7], ["nw", 6]] )
                }, {
                    location: Object.fromEntries( [[17, 10], [10, 7], [18, 9], [11, 6], [16, 6], [37, 6], [9, 6]] ),
                    orientation: Object.fromEntries( [["e", 10], ["ne", 7], ["se", 7], ["n", 7], ["s", 8], ["w", 6], ["sw", 6]] )
                }],
            ends: [
                Object.fromEntries( [[[4, "w"], 40], [[36, "ne"], 8], [[36, "sw"], 40], [[20, "s"], 8],
                [[5, "w"], 8], [[48, "nw"], 8], [[4, "e"], 8], [[5, "e"], 8], [[22, "s"], 8],
                [[21, "s"], 8], [[17, "n"], 8], [[6, "w"], 8], [[48, "se"], 8],
                [[35, "ne"], 8], [[34, "sw"], 8]] ),

                Object.fromEntries( [[[5, "e"], 40], [[36, "ne"], 10], [[49, "se"], 20], [[22, "n"], 20],
                [[22, "s"], 30], [[7, "w"], 10], [[4, "e"], 20], [[37, "ne"], 10],
                [[35, "ne"], 10], [[7, "e"], 10], [[37, "sw"], 10]] )
            ],
            curve: Object.fromEntries( [
                ["straight", 10], ["slight_right", 7], ["square_left", 9], ["strong_left", 6], ["slight_left", 7], ["full_left", 6]
            ]),
            no_height: 9, very_short: 10, wide: 10, half_wide: 8,
            skinny: 6, light: 10, medium_wt: 9, very_light: 8,
            roof_x_height: 10,
            roof_t_height: 6, floor_x_height: 7, floor_midline: 10,
            l_edge_lf: 10, l_edge_md: 8, l_edge_rt: 6, r_edge_rt: 10,
            r_edge_md: 6
        }
    };


   /**
     * @constant
     * @static
     */
    static center_post = {
        name: "center_post", 
        shortName: "c-post",
        topology: "segment",
        stroke: "down",
        norms: {
            shape: Object.fromEntries([
                ["simple", 40], ["bactrian", -80], ["cupped", 30], ["spiky_closure", -10]
            ]),
            neighborhood: [
                [["n", "n", "n", "n", "n", "n", "n", "n"], 20]
            ],
            contact: {
                l1: Object.fromEntries( [["nc", 20]] )
            },
            tips: [{
                    location: Object.fromEntries( [[8, 10], [15, 7], [2, 7], [9, 7], [1, 7], [16, 6], [10, 6], [17, 6]] ),
                    orientation: Object.fromEntries( [["n", 10], ["ne", 7], ["s", 6], ["w", 6], ["sw", 6]] )
                }, {
                    location: Object.fromEntries( [[12, 7], [19, 10], [18, 9], [5, 6], [17, 6], [11, 6], [4, 6]] ),
                    orientation: Object.fromEntries( [["s", 9], ["n", 9], ["e", 10], ["se", 8], ["ne", 9], ["sw", 7], ["w", 6]] )
                }],
            ends: [
                Object.fromEntries( [[[15, "n"], 40], [[33, "ne"], 13], [[17, "n"], 13], [[18, "n"], 8],
                [[15, "s"], 7], [[0, "w"], 7], [[32, "ne"], 7], [[14, "n"], 7],
                [[45, "nw"], 4], [[32, "sw"], 7], [[16, "n"], 6]] ),

                Object.fromEntries( [[[24, "s"], 20], [[25, "s"], 10], [[9, "e"], 40], [[25, "n"], 30],
                [[39, "ne"], 20], [[51, "se"], 20], [[37, "ne"], 10], [[38, "sw"], 10]] )
            ],
            curve: Object.fromEntries( [
                ["straight", 10], ["slight_right", 9], ["square_right", 8], ["strong_right", 6], ["full_right", 6]
            ]),
            tall: 10, medium_ht: 7, skinny: 7, half_wide: 10, wide: 9,
            medium_wt: 10, heavy: 9, roof_top: 10, roof_t_height: 7,
            floor_baseline: 10,
            l_edge_md: 10, l_edge_lf: 9, r_edge_md: 6, r_edge_rt: 10
        }
    };


   /**
     * @constant
     * @static
     */
    static circle = {
        name: "circle",
        shortName: "circle",
        topology: "loop",
        norms: {
            shape: Object.fromEntries([
                ["closure", 40], ["spiky_closure", -10], ["bactrian", -80], ["cupped", -80], ["simple", -80]
            ]),
            neighborhood: [
                [["dc", "dc", "n", "n", "dc", "dc", "dc", "y"], 20],    // b
                [["dc", "y", "dc", "dc", "dc", "n", "n", "dc"], 20],    // d
                [["dc", "dc", "dc", "y", "y", "dc", "dc", "n"], 20],    // g
                [["n",  "n",  "n",  "n", "n",  "n", "n",  "n"], 20],    // o
                [["dc", "n", "dc", "dc", "dc", "y", "dc", "dc"], 20],   // p
                [["dc", "dc", "dc", "y", "dc", "dc", "dc", "n"], 20]    // q 
            ],
            contact: {
                o1: Object.fromEntries( [["nc", 19]] ),
                b2: Object.fromEntries( [["c_lf", 20], ["c_rt", 1], ["nc", 1]] ),
                d2: Object.fromEntries( [["c_rt", 20], ["c_lf", 1], ["nc", 1]] ),
                g2: Object.fromEntries( [["c_rt", 20], ["c_lf", 1], ["nc", 1]] ),
                p2: Object.fromEntries( [["c_lf", 20], ["c_rt", 1], ["nc", 1]] ),
                q2: Object.fromEntries( [["c_rt", 20], ["c_lf", 1], ["nc", 1]] )
            },
            first_point: Object.fromEntries( [[4, 20], [3, 1], [5, 1], [10, 1], [11, 1], [12, 1]] ),
            last_point: Object.fromEntries( [[18, 20], [17, 1], [19, 1], [10, 1], [11, 1], [12, 1]] ),
            short: 10, very_short: 6, wide: 10, half_wide: 6, heavy: 10,
            medium_wt: 6, roof_x_height: 10, roof_midline: 6, floor_baseline: 10,
            l_edge_lf: 10, l_edge_md: 6, r_edge_rt: 10
        }
    };


   /**
     * @constant
     * @static
     */
    static crossbar = {
        name: "crossbar",
        shortName: "c-bar",
        topology: "segment",
        stroke: "right",
        norms: {
            shape: Object.fromEntries([
                ["simple", 40], ["bactrian", 40], ["cupped", 40], ["spiky_closure", -10]
            ]),
            neighborhood: [
                [["y", "dc", "dc", "dc", "y", "dc", "dc", "dc"], 20]
            ],
            contact: {
                f1: Object.fromEntries( [["m", 20], ["t1", 14], ["t2", 11]] ),
                t1: Object.fromEntries( [["m", 20], ["t1", 14], ["t2", 11]] )
            },
            tips: [{
                    location: Object.fromEntries( [[3, 9], [4, 10], [5, 7], [9, 6], [10, 6], [2, 6]] ),
                    orientation: Object.fromEntries( [["w", 9], ["n", 6], ["sw", 10], ["e", 8], ["nw", 6], ["se", 6]] )
                }, {
                    location: Object.fromEntries( [[17, 10], [18, 8], [10, 6], [16, 7], [11, 6]] ),
                    orientation: Object.fromEntries( [["e", 10], ["ne", 8], ["se", 7], ["s", 6]] )
                }],
            ends: [
                Object.fromEntries( [[[4, "w"], 27], [[6, "w"], 27], [[36, "sw"], 40], [[20, "n"], 13],
                [[4, "e"], 13], [[6, "e"], 13], [[38, "sw"], 27], [[47, "se"], 13],
                [[5, "e"], 13], [[46, "nw"], 13]] ),

                Object.fromEntries( [[[5, "e"], 40], [[7, "e"], 10], [[49, "se"], 20], [[35, "ne"], 20],
                [[4, "e"], 10], [[6, "e"], 10], [[37, "ne"], 20], [[47, "se"], 10],
                [[22, "s"], 10]] )
            ],
            curve: Object.fromEntries( [
                ["straight", 10], ["slight_right", 7], ["square_left", 6], ["slight_left", 7]
            ]),
            no_height: 10, short: 9, very_short: 9, wide: 10, half_wide: 7,
            light: 10, medium_wt: 6, very_light: 7, roof_x_height: 10, roof_midline: 6,
            roof_t_height: 7, floor_x_height: 10, floor_midline: 9, floor_baseline: 7,
            l_edge_lf: 10, l_edge_md: 6, r_edge_rt: 10, r_edge_md: 6
        }
    };


   /**
     * @constant
     * @static
     */
    static dot = {
        name: "dot",
        shortName: "dot",
        topology: "dot",
        norms: {
            shape: Object.fromEntries([
                ["simple", 40], ["bactrian", 40], ["cupped", 40], ["spiky_closure", 40], ["closure", 40]
            ]),
            neighborhood: [
                [["n", "dc", "dc", "dc", "y", "dc", "dc", "dc"], 20]
            ],
            contact: {
                i1: Object.fromEntries( [["nc", 20], ["c_lf", 1], ["c_rt", 1]] ),
                j1: Object.fromEntries( [["nc", 20], ["c_lf", 1], ["c_rt", 1]] )
            },
            first_point: Object.fromEntries([
                [16, 20], [1, 1], [8, 1], [15, 1], [2, 1], [9, 1], [3, 1],
                [10, 1], [17, 1], [4, 1], [11, 1], [18, 1]
            ]),
            last_point: Object.fromEntries([
                [16, 1], [1, 1], [8, 1], [15, 1], [2, 1], [9, 1], [3, 1],
                [10, 1], [17, 1], [4, 1], [11, 1], [18, 1]
            ]),
            no_height: 6, very_short: 10, short: 6, half_wide: 10,
            wide: 7, light: 10, medium_wt: 9, very_light: 7, roof_t_height: 8,
            roof_top: 10, roof_x_height: 6, floor_t_height: 10,
            floor_x_height: 9, floor_midline: 6,
            l_edge_md: 10, l_edge_lf: 8, r_edge_rt: 10, r_edge_md: 6
        }
    };


   /**
     * @constant
     * @static
     */
    static down_arm = {
        name: "down_arm",
        shortName: "dwn-arm",
        topology: "segment",
        stroke: "downright",
        norms: {
            shape: Object.fromEntries([
                ["simple", 40], ["bactrian", 10], ["cupped", 20], ["spiky_closure", 0]
            ]),
            neighborhood: [
                [["y", "y", "dc", "n", "dc", "dc", "y", "y"], 20]
            ],
            contact: {
                k1: Object.fromEntries( [["t1", 20], ["m", 1]] )
            },
            tips: [{
                    location: Object.fromEntries( [[11, 9], [10, 7], [4, 10], [3, 6]] ),
                    orientation: Object.fromEntries( [["se", 6], ["n", 6], ["nw", 10], ["w", 9]] )
                }, {
                    location: Object.fromEntries( [[19, 10], [18, 9], [12, 7]] ),
                    orientation: Object.fromEntries( [["se", 7], ["n", 10], ["e", 7], ["s", 9], ["ne", 7], ["sw", 8]] )
                }],
            ends: [
                Object.fromEntries( [[[51, "se"], 13], [[21, "n"], 13], [[50, "nw"], 27], [[6, "w"], 40], [[49, "nw"], 13], [[7, "w"], 27], [[48, "nw"], 13], [[51, "nw"], 13]] ),
                Object.fromEntries( [[[51, "se"], 10], [[25, "n"], 40], [[9, "e"], 10], [[25, "s"], 30], [[39, "ne"], 10], [[39, "sw"], 20]] )
            ],
            curve: Object.fromEntries( [
                ["straight", 7], ["strong_right", 7], ["slight_right", 10], ["square_left", 7], ["square_right", 7], ["strong_left", 9], ["slight_left", 9], ["full", 7]
            ]),
            very_short: 10, short: 7, half_wide: 10, wide: 9, light: 8,
            very_light: 10, medium_wt: 7, roof_midline: 10, roof_x_height: 8,
            floor_baseline: 10, l_edge_md: 9, l_edge_lf: 10, r_edge_rt: 10
        }
    };




   /**
     * @constant
     * @static
     */
    static down_circle = {
        name: "down_circle",
        shortName: "dwn-circ",
        topology: "loop",
        norms: {
            shape: Object.fromEntries([
                ["closure", 40], ["spiky_closure", 10]
            ]),
            neighborhood: [
                [["y", "dc", "dc", "dc", "dc", "n", "dc", "dc"], 20]
            ],
            contact: {
                a2: Object.fromEntries( [["nc", 1], ["c_rt", 20], ["m", 11], ["t1", 11], ["t2", 11]] )
            },
            first_point: Object.fromEntries( [[4, 20], [5, 20], [12, 1], [11, 1]] ),
            last_point: Object.fromEntries( [[18, 20], [17, 20], [10, 1], [11, 1]] ),
            very_short: 10, short: 6, wide: 10, half_wide: 6,
            heavy: 10, medium_wt: 9, roof_midline: 10,
            roof_x_height: 6, floor_baseline: 10,
            l_edge_lf: 10, r_edge_rt: 10, r_edge_md: 6
        }
    };


   /**
     * @constant
     * @static
     */
    static e_bowl = {
        name: "e_bowl",
        shortName: "e-bowl",
        topology: "segment",
        stroke: "down",
        norms: {
            shape: Object.fromEntries([
                ["simple", 40], ["bactrian", 10], ["cupped", 10], ["spiky_closure", -10]
            ]),
            neighborhood: [
                [["n", "n", "n", "n", "n", "n", "n", "n"], 20]
            ],
            contact: {
                e1: Object.fromEntries( [["t1m", 20], ["t1", 2]] )
            },
            tips: [{
                    location: Object.fromEntries( [[18, 10], [10, 6], [11, 6], [17, 7], [19, 6]] ),
                    orientation: Object.fromEntries( [["s", 10], ["se", 9], ["e", 9], ["sw", 6]] ),
                }, {
                    location: Object.fromEntries( [[19, 10], [17, 6], [18, 7], [12, 7]] ),
                    orientation: Object.fromEntries( [["e", 10], ["ne", 7], ["n", 6], ["se", 6]] )
                }],
            ends: [
                Object.fromEntries( [[[22, "s"], 40], [[49, "se"], 40], [[5, "e"], 40], [[37, "sw"], 40], [[25, "s"], 8]] ),
                Object.fromEntries( [[[9, "e"], 40], [[39, "ne"], 15], [[8, "e"], 15], [[51, "se"], 5], [[25, "n"], 5]] )
            ],
            curve: Object.fromEntries( [
                ["full_right", 10]
            ]),
            short: 10, very_short: 6, wide: 10, heavy: 10, medium_wt: 6,
            roof_x_height: 10, floor_baseline: 10,
            l_edge_lf: 10, r_edge_rt: 10
        }
    };


   /**
     * @constant
     * @static
     */
    static e_crossbar = {
        name: "e_crossbar",
        shortName: "e-cross",
        topology: "segment",
        stroke: "right",
        norms: {
            shape: Object.fromEntries([
                ["simple", 40], ["bactrian", 10], ["cupped", 40], ["spiky_closure", -10]
            ]),
            neighborhood: [
                [["y", "y", "y", "dc", "y", "y", "y", "y"], 20]
            ],
            contact: {
                e1: Object.fromEntries( [["2ts", 20], ["t2", 2], ["mt2", 11], ["2ms", 11], ["t1m", 11]] )
            },
            tips: [{
                    location: Object.fromEntries( [[4, 10], [3, 9], [5, 7], [11, 9]] ),
                    orientation: Object.fromEntries( [["w", 10], ["nw", 9], ["sw", 7], ["e", 7], ["ne", 7], ["n", 5]] )
                }, {
                    location: Object.fromEntries( [[18, 10], [19, 9], [17, 9], [11, 6]] ),
                    orientation: Object.fromEntries( [["e", 10], ["se", 9], ["ne", 9]] )
                }],
            ends: [
                Object.fromEntries( [[[6, "w"], 40], [[48, "nw"], 27], [[38, "sw"], 13], [[7, "e"], 13], [[37, "ne"], 13], [[21, "n"], 8]] ),
                Object.fromEntries( [[[7, "e"], 40], [[51, "se"], 27], [[6, "e"], 27], [[37, "ne"], 40]] )
            ],
            curve: Object.fromEntries( [
                ["straight", 10], ["slight_right", 7], ["slight_left", 6], ["square_right", 6], ["square_left", 6]
            ]),
            no_height: 10, short: 8, very_short: 9, wide: 10,
            half_wide: 7, light: 10, very_light: 7, roof_midline: 10,
            roof_x_height: 9, floor_midline: 10, floor_baseline: 8,
            l_edge_lf: 10, l_edge_md: 7, r_edge_rt: 10
        }
    };


   /**
     * @constant
     * @static
     */
    static e_tail = {
        name: "e_tail",
        shortName: "e-tail",
        topology: "segment",
        stroke: "downright",
        norms: {
            shape: Object.fromEntries([
                ["simple", 40], ["bactrian", 30], ["cupped", 30], ["spiky_closure", -10]
            ]),
            neighborhood: [
                [["y", "y", "dc", "n", "n", "n", "dc", "y"], 20]
            ],
            contact: {
                e2: Object.fromEntries( [["t1", 20], ["m", 11]] )
            },
            tips: [{
                    location: Object.fromEntries( [[4, 10], [11, 9], [5, 7], [3, 6], [10, 6]] ),
                    orientation: Object.fromEntries( [["n", 10], ["ne", 6], ["nw", 8], ["se", 6], ["w", 7]] )
                }, {
                    location: Object.fromEntries( [[19, 10], [18, 9], [12, 6], [5, 6]] ),
                    orientation: Object.fromEntries( [["e", 10], ["ne", 8], ["w", 6], ["se", 6], ["n", 6]] )
                }],
            ends: [
                Object.fromEntries( [[[23, "n"], 40], [[24, "n"], 13], [[50, "nw"], 27], [[20, "n"], 13],
                 [[8, "w"], 27], [[38, "ne"], 13], [[51, "nw"], 13], [[51, "se"], 13],
                 [[36, "ne"], 10]] ),
                Object.fromEntries( [[[9, "e"], 40], [[39, "ne"], 24], [[8, "e"], 8], [[51, "se"], 8],
                 [[8, "w"], 8], [[25, "n"], 8]] )
            ],
            curve: Object.fromEntries( [
                ["slight_right", 9], ["square_right", 10], ["strong_left", 7], ["strong_right", 8], ["straight", 8]
            ]),
            very_short: 10, short: 6, no_height: 6, wide: 10,
            half_wide: 9, medium_wt: 8, light: 10, very_light: 6,
            roof_midline: 10, roof_x_height: 6, roof_baseline: 6, floor_baseline: 10,
            l_edge_lf: 10, l_edge_md: 7, r_edge_rt: 10, r_edge_md: 6
        }
    };


   /**
     * @constant
     * @static
     */
    static f_post = {
        name: "f_post",
        shortName: "f-post",
        topology: "bisegment",
        stroke: "down",
        norms: {
            shape: Object.fromEntries([
                ["simple", 40], ["bactrian", 10], ["cupped", 30], ["spiky_closure", -10]
            ]),
            neighborhood: [
                [["n", "n", "dc", "n", "n", "n", "dc", "n"], 20]
            ],
            contact: {
                f1: Object.fromEntries( [["m", 20], ["nc", 1]] )
            },
            tips: [{
                    location: Object.fromEntries( [[15, 9], [17, 8], [16, 10], [8, 6]] ),
                    orientation: Object.fromEntries( [["e", 8], ["se", 10], ["s", 9], ["ne", 7]] )
                }, {
                    location: Object.fromEntries( [[12, 10], [5, 6], [19, 7]] ),
                    orientation: Object.fromEntries( [["s", 10], ["se", 9], ["sw", 6]] )
                }],
            ends: [
                Object.fromEntries( [[[1, "e"], 40], [[47, "se"], 27], [[45, "se"], 40], [[3, "e"], 20],
                 [[16, "s"], 13], [[19, "s"], 13], [[0, "e"], 13], [[33, "ne"], 27]] ),

                Object.fromEntries( [[[24, "s"], 40], [[23, "s"], 30], [[50, "se"], 30], [[51, "se"], 20],
                 [[38, "sw"], 10]] )
            ],
            midpoint: 10,
            curve1: Object.fromEntries( [
                ["slight_right", 10], ["square_right", 9], ["strong_right", 6]
            ]),
            curve2: Object.fromEntries( [
                ["straight", 9], ["slight_right", 8], ["slight_left", 6]
            ]),
            tall: 10, medium_ht: 8, half_wide: 8, wide: 10, medium_wt: 10,
            heavy: 9, roof_top: 10, roof_t_height: 8, floor_baseline: 10,
            l_edge_lf: 8, l_edge_md: 10, r_edge_rt: 10, r_edge_md: 6
        }
    };


   /**
     * @constant
     * @static
     */
    static foreslash = {
        name: "foreslash",
        shortName: "f-slash",
        topology: "segment",
        stroke: "upright",
        norms: {
            shape: Object.fromEntries([
                ["simple", 40], ["bactrian", 0], ["cupped", 20], ["spiky_closure", -10]
            ]),
            neighborhood: [
                 [["dc", "n", "dc", "y", "dc", "n", "dc", "y"], 20],
                 [["dc", "dc", "dc", "y", "dc", "dc", "dc", "y"], 20]
            ],
            contact: {
                x1: Object.fromEntries( [["m", 20]] ),
                z1: Object.fromEntries( [["2ts", 20], ["t1m", 11], ["mt2", 11]] )
            },
            tips: [{
                    location: Object.fromEntries( [[5, 10], [12, 8], [4, 6]] ),
                    orientation: Object.fromEntries( [["sw", 10], ["w", 7], ["se", 9], ["s", 9], ["nw", 6], ["n", 6], ["e", 6]] )
                }, {
                    location: Object.fromEntries( [[17, 10], [10, 6], [18, 9]] ),
                    orientation: Object.fromEntries( [["ne", 10], ["w", 6], ["e", 7], ["n", 7], ["se", 7], ["nw", 6], ["s", 6]] )
                }],
            ends: [
                Object.fromEntries( [[[38, "sw"], 40], [[8, "w"], 8], [[50, "se"], 32], [[23, "s"], 32], [[6, "w"], 8], [[39, "sw"], 8], 
                    [[50, "nw"], 8], [[23, "n"], 32], [[8, "e"], 8], [[21, "n"], 6]] ),
                Object.fromEntries( [[[37, "ne"], 40], [[5, "w"], 7], [[7, "e"], 13], [[39, "ne"], 7], [[49, "se"], 13], [[22, "n"], 20], 
                    [[22, "s"], 7], [[49, "nw"], 7]] )
            ],
            curve: Object.fromEntries( [
                ["straight", 10], ["slight_right", 9], ["slight_left", 9], ["square_left", 8]
            ]),
            short: 10, very_short: 8, wide: 10, half_wide: 6, light: 10,
            medium_wt: 9, roof_x_height: 10, roof_midline: 6,
            floor_baseline: 10, floor_midline: 8,
            l_edge_lf: 10, l_edge_md: 6, r_edge_rt: 10
        }
    };


   /**
     * @constant
     * @static
     */
    static halfpost = {
        name: "halfpost",
        shortName: "h-post",
        topology: "segment",
        stroke: "down",
        norms: {
            shape: Object.fromEntries([
                ["simple", 40], ["bactrian", 0], ["cupped", 30], ["spiky_closure", -10]
            ]),
            neighborhood: [
                [["y", "dc", "dc", "n", "n", "n", "dc", "dc"], 20]
            ],
            contact: {
                i1: Object.fromEntries( [["nc", 20], ["t1", 1]] )
            },
            tips: [{
                    location: Object.fromEntries( [[10, 10], [12, 6], [11, 9], [17, 8], [18, 6], [4, 7], [3, 6]] ),
                    orientation: Object.fromEntries( [["w", 10], ["sw", 7], ["s", 9], ["e", 6], ["nw", 7], ["n", 7], ["ne", 6]] )
                }, {
                    location: Object.fromEntries( [[19, 9], [12, 10], [5, 7], [18, 6]] ),
                    orientation: Object.fromEntries( [["s", 10], ["w", 6], ["sw", 9], ["n", 6], ["se", 6]] )
                }],
            ends: [
                Object.fromEntries( [[[5, "w"], 40], [[39, "sw"], 13], [[24, "s"], 13], [[5, "e"], 13],
                    [[21, "s"], 27], [[6, "w"], 27], [[22, "s"], 13], [[49, "nw"], 13],
                    [[48, "nw"], 13], [[37, "sw"], 13], [[37, "ne"], 13], [[22, "n"], 13],
                    [[21, "n"], 13]] ),
                Object.fromEntries( [[[25, "s"], 40], [[24, "s"], 24], [[39, "sw"], 24], [[9, "w"], 8],
                    [[51, "se"], 8], [[38, "sw"], 24], [[25, "n"], 8]] )
            ],
            curve: Object.fromEntries( [
                ["slight_left", 10], ["strong_left", 9], ["straight", 8], ["slight_right", 8], ["square_left", 9], ["square_right", 7], ["full_left", 7]
            ]),
            short: 10, very_short: 8, half_wide: 10, wide: 8,
            skinny: 8, medium_wt: 10, light: 8, very_light: 8,
            roof_x_height: 10, roof_midline: 8, floor_baseline: 10,
            l_edge_md: 10, l_edge_lf: 8, r_edge_rt: 10, r_edge_md: 8
        }
    };

    
   /**
     * @constant
     * @static
     */
    static left_bowl = {
        name: "left_bowl",
        shortName: "l-bowl",
        topology: "segment",
        stroke: "down",
        norms: {
            shape: Object.fromEntries([
                ["simple", 40], ["bactrian", 20], ["cupped", 40], ["spiky_closure", 10]
            ]),
            neighborhood: [
                [["n", "n", "n", "n", "n", "n", "n", "n"], 20],
                [["dc", "y", "dc", "dc", "dc", "n", "dc", "dc"], 20]
            ],
            contact: {
                c1: Object.fromEntries( [["nc", 20]] ),
                d1: Object.fromEntries( [["2ts", 20], ["t1", 3], ["t2", 3], ["t1m", 11], ["mt2", 11], ["2ms", 11]] ),
                g1: Object.fromEntries( [["2ts", 20], ["t1", 3], ["t2", 3], ["t1m", 11], ["mt2", 11], ["2ms", 11]] ),
                q1: Object.fromEntries( [["2ts", 20], ["t1", 3], ["t2", 3], ["t1m", 11], ["mt2", 11], ["2ms", 11]] )
            },
            tips: [{
                    location: Object.fromEntries( [[17, 10], [18, 8], [10, 6], [11, 6], [19, 6], [21, 6]] ),
                    orientation: Object.fromEntries( [["e", 14], ["se", 8], ["ne", 7], ["n", 6], ["s", 6]] )
                }, {
                    location: Object.fromEntries( [[19, 10], [18, 7], [12, 6], [11, 6]] ),
                    orientation: Object.fromEntries( [["e", 10], ["n", 6], ["ne", 7], ["se", 6], ["nw", 6], ["s", 6]] )
                }],
            ends: [
                Object.fromEntries( [[[5, "e"], 40], [[49, "se"], 35], [[4, "e"], 15], [[7, "e"], 10], [[37, "ne"], 20], [[36, "ne"], 5], [[22, "s"], 5], [[22, "n"], 5], [[21, "s"], 5]] ),
                Object.fromEntries( [[[9, "e"], 40], [[50, "se"], 3], [[39, "ne"], 12], [[25, "n"], 6], [[8, "e"], 9], [[51, "se"], 6], [[25, "s"], 3], [[51, "nw"], 3]] )
            ],
            curve: Object.fromEntries( [
                ["full_right", 10], ["strong_right", 7], ["square_right", 6]
            ]),
            short: 10, very_short: 6, wide: 10, half_wide: 6, heavy: 10, medium_wt: 8, light: 6,
            roof_x_height: 10, roof_midline: 6, floor_baseline: 10,
            l_edge_lf: 10, r_edge_rt: 10, r_edge_md: 6
        }
    };

    
   /**
     * @constant
     * @static
     */
    static left_downbowl = {
        name: "left_downbowl",
        shortName: "l-dwnbwl",
        topology: "segment",
        stroke: "down",
        norms: {
            shape: Object.fromEntries([
                ["simple", 40], ["bactrian", 20], ["cupped", 40], ["spiky_closure", -10]
            ]),
            neighborhood: [
                [["y", "dc", "dc", "dc", "dc", "n", "dc", "dc"], 20]
            ],
            contact: {
                a1: Object.fromEntries( [["2ts", 20], ["t2", -8], ["t1", -8]] )
            },
            tips: [{
                    location: Object.fromEntries( [[18, 10], [17, 4], [11, 6]] ),
                    orientation: Object.fromEntries( [["e", 10], ["ne", 9]] )
                }, {
                    location: Object.fromEntries( [[19, 10], [18, 7], [12, 7]] ),
                    orientation: Object.fromEntries( [["e", 10], ["ne", 7], ["se", 6]] )
                }],
            ends: [
                Object.fromEntries( [[[7, "e"], 40], [[37, "ne"], 20], [[38, "ne"], 7]] ),
                Object.fromEntries( [[[9, "e"], 40], [[39, "ne"], 13], [[50, "se"], 7], [[8, "e"], 7]] )
            ],
            curve: Object.fromEntries( [
                ["full_right", 10], ["strong_right", 7]
            ]),
            very_short: 10, short: 9, wide: 10, medium_wt: 10, heavy: 7,
            roof_midline: 10, roof_x_height: 7, floor_baseline: 10,
            l_edge_lf: 10, r_edge_rt: 10
        }
    };


   /**
     * @constant
     * @static
     */
    static left_halfarc = {
        name: "left_halfarc",
        shortName: "l-hlfarc",
        topology: "segment",
        stroke: "down",
        norms: {
            shape: Object.fromEntries([
                ["simple", 40], ["bactrian", 0], ["cupped", 40], ["spiky_closure", -10]
            ]),
            neighborhood: [
                [["dc", "dc", "y", "dc", "dc", "n", "n", "n"], 20]
            ],
            contact: {
                w1: Object.fromEntries( [["t2", 20], ["m", 11]] )
            },
            tips: [{
                    location: Object.fromEntries( [[3, 9], [4, 7], [10, 7]] ),
                    orientation: Object.fromEntries( [["n", 9], ["w", 6], ["ne", 7], ["nw", 6]] )
                }, {
                    location: Object.fromEntries( [[12, 10], [11, 6], [5, 6], [19, 1]] ),
                    orientation: Object.fromEntries( [["e", 8], ["ne", 7], ["se", 6], ["n", 6], ["s", 6]] )
                }],
            ends: [
                Object.fromEntries( [[[20, "n"], 40], [[4, "w"], 8], [[36, "ne"], 32], [[23, "n"], 16], [[50, "nw"], 8]] ),
                Object.fromEntries( [[[8, "e"], 40], [[38, "ne"], 30], [[50, "se"], 20], [[24, "n"], 20], [[23, "s"], 10], [[6, "e"], 10], [[9, "e"], 5]] )
            ],
            curve: Object.fromEntries( [
                ["slight_right", 8], ["straight", 6], ["square_right", 10], ["strong_right", 8], ["full_right", 6]
            ]),
            short: 10, very_short: 8, half_wide: 10, wide: 8, medium_wt: 9, light: 10,
            roof_x_height: 10, roof_midline: 7, floor_baseline: 10, floor_midline: 6,
            l_edge_lf: 10, r_edge_md: 10, r_edge_rt: 8
        }
    };


   /**
     * @constant
     * @static
     */
    static left_halfarch = {
        name: "left_halfarch",
        shortName: "l-hlfarch",
        topology: "segment",
        stroke: "down",
        norms: {
            shape: Object.fromEntries([
                ["simple", 40], ["bactrian", 0], ["cupped", 40], ["spiky_closure", -10]
            ]),
            neighborhood: [
                [["dc", "dc", "y", "dc", "dc", "dc", "y", "dc"], 20]
            ],
            contact: {
                m1: Object.fromEntries( [["t1m", 20], ["t1", 15], ["2ts", 7], ["m", 9], ["nc", 1]] )
            },
            tips: [{
                    location: Object.fromEntries( [[3, 10], [11, 6], [4, 6], [10, 6]] ),
                    orientation: Object.fromEntries( [["w", 10], ["se", 8], ["sw", 8], ["nw", 9], ["s", 9], ["n", 6]] )
                }, {
                    location: Object.fromEntries( [[12, 10], [11, 9], [5, 6], [19, 7]] ),
                    orientation: Object.fromEntries( [["s", 10], ["se", 7], ["sw", 6]] )
                }],
            ends: [
                Object.fromEntries( [[[4, "w"], 40], [[48, "se"], 20], [[36, "sw"], 20], [[48, "nw"], 40], [[21, "s"], 20], [[24, "s"], 20], [[21, "n"], 10]] ),
                Object.fromEntries( [[[24, "s"], 40], [[48, "se"], 10], [[21, "s"], 20], [[38, "sw"], 10], [[51, "se"], 10]] )
            ],
            curve: Object.fromEntries( [
                ["slight_left", 10], ["straight", 9], ["strong_left", 7], ["square_left", 7]
            ]),
            short: 10, very_short: 8, half_wide: 10, wide: 6, skinny: 8, medium_wt: 8, light: 10, very_light: 8,
            roof_x_height: 10, roof_midline: 8, floor_baseline: 10, floor_midline: 8,
            l_edge_lf: 10, l_edge_md: 8, r_edge_md: 10, r_edge_rt: 8   
        }
    };


   /**
     * @constant
     * @static
     */
    static left_halfpost = {
        name: "left_halfpost", 
        shortName: "l-hlfpost",
        topology: "segment",
        stroke: "down",
        norms: {
            shape: Object.fromEntries([
                ["simple", 40], ["bactrian", 10], ["cupped", 30], ["spiky_closure", -10]
            ]),
            neighborhood: [
                [["dc", "dc", "y", "dc", "dc", "n", "n", "n"], 20]
            ],
            contact: {
                m1: Object.fromEntries( [["t1", 20], ["m", 18], ["nc", 1]] ),
                n1: Object.fromEntries( [["t1", 20], ["m", 18], ["nc", 1]] ),
                r1: Object.fromEntries( [["t1", 20], ["m", 18], ["nc", 1]] )
            },
            tips: [{
                    location: Object.fromEntries( [[3, 10], [4, 6], [10, 7], [17, 1], [11, 1]] ),
                    orientation: Object.fromEntries( [["n", 10], ["nw", 8], ["ne", 8], ["sw", 6], ["w", 7], ["s", 6]] )
                }, {
                    location: Object.fromEntries( [[5, 10], [12, 7], [4, 6], [19, 6]] ),
                    orientation: Object.fromEntries( [["s", 10], ["sw", 8], ["se", 8], ["w", 1], ["e", 1]] )
                }              
            ],
            ends: [
                Object.fromEntries( [[[20, "n"], 40], [[48, "nw"], 40], [[36, "ne"], 27], [[36, "sw"], 13],
                [[4, "w"], 27], [[21, "n"], 27], [[20, "s"], 13], [[37, "ne"], 13],
                [[23, "n"], 13], [[38, "ne"], 5], [[38, "sw"], 5]] ),

                Object.fromEntries( [[[23, "s"], 40], [[24, "s"], 16], [[50, "se"], 24], [[38, "sw"], 32],
                [[20, "s"], 8], [[51, "se"], 8], [[38, "ne"], 5],
                [[9, "e"], -70]] )
            ],
            curve: Object.fromEntries( [
                ["straight", 10], ["slight_left", 8], ["slight_right", 7], ["strong_left", 6], ["full_left", 6], ["square_right", 6], ["square_left", 6]
            ]),
            short: 10, very_short: 8, skinny: 8, half_wide: 10, wide: 6,
            light: 10, medium_wt: 8, roof_x_height: 10,
            roof_midline: 8, very_light: 8,
            floor_baseline: 16, floor_midline: 6, l_edge_lf: 10, l_edge_md: 6,
            r_edge_lf: 8, r_edge_md: 10, r_edge_rt: 6
        }   
    };


   /**
     * @constant
     * @static
     */
    static left_post = {
        name: "left_post", 
        shortName: "l-post",
        topology: "segment",
        stroke: "down",
        norms: {
            shape: Object.fromEntries([
                ["simple", 40], ["bactrian", 10], ["cupped", 30], ["spiky_closure", -10]
            ]),
            neighborhood: [
                [["n", "dc", "dc", "y", "dc", "dc", "dc", "n"], 20]
            ],
            contact: {
                b1: Object.fromEntries( [["mt2", 20], ["m", 1], ["t2", 1], ["2ms", 18]] ),
                b2: Object.fromEntries( [["m", 20], ["t2", 15]] ),
                h1: Object.fromEntries( [["m", 20], ["t2", 10]] ),
                k1: Object.fromEntries( [["m", 20], ["t2", 15], ["2ms", 7]] )
            },
            tips: [{
                    location: Object.fromEntries( [[1, 10], [8, 8], [2, 8], [9, 6], [15, 6]] ),
                    orientation: Object.fromEntries( [["n", 10], ["w", 6], ["ne", 7], ["nw", 7], ["se", 6]] )
                }, {
                    location: Object.fromEntries( [[5, 10], [4, 7], [12, 7], [11, 6]] ),
                    orientation: Object.fromEntries( [["s", 10], ["sw", 7], ["se", 7], ["n", 6], ["w", 6]] )
                }],
            ends: [
                Object.fromEntries( [[[14, "n"], 40], [[0, "w"], 13], [[17, "n"], 40], [[44, "nw"], 27],
                    [[32, "ne"], 27], [[15, "n"], 13], [[33, "ne"], 13], [[18, "n"], 13],
                    [[44, "se"], 10]] ),
                Object.fromEntries( [[[23, "s"], 40], [[38, "sw"], 30], [[20, "s"], 20], [[23, "n"], 10],
                    [[50, "se"], 20], [[24, "s"], 10], [[21, "s"], 10], [[8, "w"], 10],
                    [[8, "e"], 10]] )
            ],
            curve: Object.fromEntries( [
                ["straight", 10], ["slight_left", 7], ["slight_right", 7], ["square_left", 6]
            ]),
            tall: 10, short: 8, medium_ht: 8, skinny: 10,
            half_wide: 9, wide: 6, medium_wt: 10, light: 8, heavy: 6,
            roof_top: 10, roof_t_height: 7, floor_baseline: 10,
            floor_midline: 8, floor_x_height: 8, l_edge_lf: 10, l_edge_md: 6,
            r_edge_lf: 10, r_edge_md: 9, r_edge_rt: 6 
        }
    };


   /**
     * @constant
     * @static
     */
    static left_tail = {
        name: "left_tail",
        shortName: "l-tail",
        topology: "segment",
        stroke: "down",
        norms: {
            shape: Object.fromEntries([
                ["simple", 40], ["bactrian", 20], ["cupped", 30], ["spiky_closure", -10]
            ]),
            neighborhood: [
                [["dc", "y", "dc", "n", "n", "n", "dc", "dc"], 20]
            ],
            contact: {
                p1: Object.fromEntries( [["t1m", 20], ["m", 1], ["2ms", 15], ["t1", 3], ["nc", 1]] ),
                p2: Object.fromEntries( [["m", 20], ["t1", 15]] )
            },
            tips: [{
                    location: Object.fromEntries( [[3, 10], [5, 7], [4, 7], [12, 6]] ),
                    orientation: Object.fromEntries( [["n", 10], ["sw", 6], ["w", 6], ["nw", 7], ["ne", 6]] )
                }, {
                    location: Object.fromEntries( [[7, 10], [14, 6], [5, 6], [6, 7], [13, 6]] ),
                    orientation: Object.fromEntries( [["s", 10], ["sw", 6], ["w", 7], ["ne", 6]] )
                }],
            ends: [
                Object.fromEntries( [[[20, "n"], 40], [[38, "sw"], 13], [[4, "w"], 13], [[48, "nw"], 27],
                 [[26, "n"], 13], [[23, "n"], 27], [[40, "ne"], 13]] ),
                Object.fromEntries( [[[29, "s"], 40], [[30, "s"], 10], [[23, "s"], 10], [[42, "sw"], 10],
                 [[12, "w"], 10], [[10, "w"], 10], [[26, "s"], 10], [[42, "ne"], 10]] )
            ],
            curve: Object.fromEntries( [
                ["straight", 10], ["square_left", 7], ["slight_left", 7], ["slight_right", 6], ["square_right", 6]
            ]),
            tall: 8, medium_ht: 10, short: 8, skinny: 9, half_wide: 10,
            medium_wt: 10, light: 7, heavy: 6, roof_x_height: 10,
            roof_midline: 8, roof_baseline: 7, floor_bottom: 10,
            floor_middown: 7, floor_baseline: 6,
            l_edge_lf: 10, r_edge_lf: 10, r_edge_md: 9
        }
    };

    
   /**
     * @constant
     * @static
     */
    static left_uparc = {
        name: "left_uparc",
        shortName: "l-uparc",
        topology: "segment",
        stroke: "down",
        norms: {
            shape: Object.fromEntries([
                ["simple", 40], ["bactrian", -200], ["cupped", 40], ["spiky_closure", -10]
            ]),
            neighborhood: [
                [["dc", "dc", "y", "dc", "dc", "n", "n", "n"], 20],
                [["dc", "dc", "y", "y", "y", "dc", "dc", "n"], 20]
            ],
            contact: {
                u1: Object.fromEntries( [["t2", 20], ["m", 13], ["nc", 1]] ),
                y1: Object.fromEntries( [["t2", 20], ["m", 13], ["nc", 1]] )
            },
            tips: [{
                    location: Object.fromEntries( [[3, 10], [4, 7], [10, 7]] ),
                    orientation: Object.fromEntries( [["n", 10], ["w", 6], ["ne", 7], ["nw", 6], ["s", 6]] )
                }, {
                    location: Object.fromEntries( [[19, 10], [18, 9], [12, 8], [11, 7], [5, 7], [17, 6]] ),
                    orientation: Object.fromEntries( [["e", 10], ["ne", 9], ["n", 7], ["se", -60]] )
                }],
            ends: [
                Object.fromEntries( [[[20, "n"], 40], [[23, "n"], 10], [[36, "ne"], 20], [[4, "w"], 10], [[20, "s"], 5], [[48, "nw"], 10], [[21, "n"], 5]] ),
                Object.fromEntries( [[[9, "e"], 40], [[39, "ne"], 27], [[8, "e"], 20], [[24, "n"], 7], [[37, "ne"], 7], [[38, "ne"], 7]] )
            ],
            curve: Object.fromEntries( [
                ["square_right", 10], ["strong_right", 9], ["slight_right", 8], ["full_right", 8], ["slight_left", 7], ["straight", 6]
            ]),
            short: 10, very_short: 8, wide: 10, half_wide: 8, skinny: 6,
            medium_wt: 10, light: 6, heavy: 6,
            roof_x_height: 10, roof_midline: 8, floor_baseline: 10,
            l_edge_lf: 10, r_edge_rt: 10, r_edge_md: 8, r_edge_lf: 6
        }
    };

 
   /**
     * @constant
     * @static
     */
    static left_upbowl = {
        name: "left_upbowl",
        shortName: "l-upbwl",
        topology: "segment",
        stroke: "down",
        norms: {
            shape: Object.fromEntries([
                ["simple", 40], ["bactrian", 10], ["cupped", 40], ["spiky_closure", -10]
            ]),
            neighborhood: [
                [["n", "n", "dc", "dc", "y", "dc", "dc", "n"], 20]
            ],
            contact: {
                s2: Object.fromEntries( [["t2", 20], ["mt2", 6]] )
            },
            tips: [{
                    location: Object.fromEntries( [[17, 10], [10, 7], [18, 7]] ),
                    orientation: Object.fromEntries( [["e", 10], ["ne", 6], ["se", 6], ["n", 6], ["s", 6]] )
                }, {
                    location: Object.fromEntries( [[4, 7], [18, 9], [11, 10], [17, 6]] ),
                    orientation: Object.fromEntries( [["s", 7], ["e", 10], ["sw", 6], ["se", 7], ["ne", 6]] )
                }],
            ends: [
                Object.fromEntries( [[[5, "e"], 40], [[37, "ne"], 4], [[49, "se"], 35], [[22, "n"], 4], [[4, "e"], 20], [[22, "s"], 4]] ),
                Object.fromEntries( [[[20, "s"], 13], [[7, "e"], 40], [[6, "e"], 27], [[48, "se"], 27], [[36, "sw"], 13], [[37, "ne"], 7], [[37, "sw"], 7], [[21, "s"], 7]] )
            ],
            curve: Object.fromEntries( [
                ["slight_right", 6], ["strong_right", 7], ["full_right", 10], ["square_right", 8]
            ]),
            very_short: 10, wide: 10, half_wide: 7, medium_wt: 10, light: 7,
            roof_x_height: 10, floor_midline: 10,
            l_edge_lf: 10, l_edge_md: 6, r_edge_rt: 10, r_edge_md: 6
        }
    };


   /**
     * @constant
     * @static
     */
    static left_wing = {
        name: "left_wing",
        shortName: "l-wing",
        topology: "segment",
        stroke: "down",
        norms: {
            shape: Object.fromEntries([
                ["simple", 40], ["bactrian", -200], ["cupped", -200], ["spiky_closure", -10]
            ]),
            neighborhood: [
                [["dc", "dc", "y", "dc", "dc", "n", "n", "n"], 20]
            ],
            contact: {
                v1: Object.fromEntries( [["t2", 20]] )
            },
            tips: [{
                    location: Object.fromEntries( [[3, 10], [4, 7], [10, 7]] ),
                    orientation: Object.fromEntries( [["n", 10], ["s", 7], ["ne", 8], ["nw", 8], ["se", 7], ["w", 9], ["sw", 7]] )
                }, {
                    location: Object.fromEntries( [[12, 10], [19, 7], [5, 9]] ),
                    orientation: Object.fromEntries( [["se", 9], ["s", 10], ["sw", 7]] )
                }],
            ends: [
                Object.fromEntries( [[[20, "n"], 40], [[20, "s"], 13], [[36, "ne"], 27], [[48, "nw"], 27], [[50, "se"], 13], [[4, "w"], 40], [[21, "n"], 13], [[36, "sw"], 13]] ),
                Object.fromEntries( [[[50, "se"], 30], [[24, "s"], 40], [[23, "s"], 30], [[51, "se"], 20], [[38, "sw"], 20]] )
            ],
            curve: Object.fromEntries( [
                ["slight_right", 7], ["square_left", 6], ["square_right", 6], ["straight", 9], ["slight_left", 10], ["strong_left", 1], ["full_left", 1]
            ]),
            short: 10, very_short: 8, wide: 8, half_wide: 10, skinny: 8, medium_wt: 9, light: 10,
            very_light: 8, roof_x_height: 10, roof_midline: 8, floor_baseline: 10,
            l_edge_lf: 10, r_edge_md: 10, r_edge_rt: 8, r_edge_lf: 8
        }
    }; 


   /**
     * @constant
     * @static
     */
    static right_bowl = {
        name: "right_bowl",
        shortName: "r-bowl",
        topology: "segment",
        stroke: "down",
        norms: {
            shape: Object.fromEntries([
                ["simple", 40], ["bactrian", 10], ["cupped", 40], ["spiky_closure", -10]
            ]),
            neighborhood: [
                [["dc", "dc", "dc", "n", "dc", "dc", "dc", "y"], 20],
                [["dc", "n", "dc", "dc", "dc", "y", "dc", "dc"], 20]
            ],
            contact: {
                b1: Object.fromEntries( [["2ts", 20], ["t2", 1]] ),
                p1: Object.fromEntries( [["2ts", 20], ["t1", 1], ["t2", 1]] )
            },
            tips: [{
                    location: Object.fromEntries( [[3, 10], [4, 9], [10, 8], [11, 6]] ),
                    orientation: Object.fromEntries( [["w", 10], ["sw", 7], ["nw", 7], ["s", 6]] )
                }, {
                    location: Object.fromEntries( [[5, 10], [4, 8], [12, 6], [11, 5]] ),
                    orientation: Object.fromEntries( [["w", 10], ["nw", 8], ["sw", 6]] )
                }],
            ends: [
                Object.fromEntries( [[[4, "w"], 40], [[36, "sw"], 30], [[5, "w"], 30], [[6, "w"], 10], [[48, "nw"], 20], [[21, "s"], 10], [[37, "sw"], 10]] ),
                Object.fromEntries( [[[8, "w"], 40], [[50, "nw"], 23], [[9, "w"], 6], [[38, "sw"], 6]] )
            ],
            curve: Object.fromEntries( [
                ["full_left", 10], ["strong_left", 6]
            ]),
            short: 10, wide: 10, half_wide: 6, heavy: 10, medium_wt: 7,
            roof_x_height: 10, floor_baseline: 10,
            l_edge_lf: 10, l_edge_md: 6, r_edge_rt: 10
        }
    };


   /**
     * @constant
     * @static
     */
    static right_buttress = {
        name: "right_buttress",
        shortName: "r-butt",
        topology: "segment",
        stroke: "downright",
        norms: {
            shape: Object.fromEntries([
                ["simple", 40], ["bactrian", -200], ["cupped", 30], ["spiky_closure", -10]
            ]),
            neighborhood: [
                [["dc", "dc", "dc", "n", "dc", "dc", "y", "y"], 20],
                [["dc", "dc", "dc", "n", "dc", "dc", "y", "dc"], 20]
            ],
            contact: {
                h1: Object.fromEntries( [["t1", 20], ["nc", 1]] ),
                n1: Object.fromEntries( [["t1", 20], ["nc", 1], ["m", -40]] )
            },
            tips: [{
                    location: Object.fromEntries( [[3, 10], [10, 7], [4, 7], [11, 6], [5, 6], [12, 6], [17, 3]] ),
                    orientation: Object.fromEntries( [["w", 10], ["nw", 8], ["sw", 8], ["se", 6], ["s", 6], ["n", 3]] )
                }, {
                    location: Object.fromEntries( [[19, 10], [12, 8], [18, 6], [11, 6]] ),
                    orientation: Object.fromEntries( [["s", 10], ["sw", 8], ["se", 6], ["e", 6], ["w", 6], ["n", 6]] )
                }],
            ends: [
                Object.fromEntries( [[[4, "w"], 40], [[49, "nw"], 13], [[36, "sw"], 13], [[7, "w"], 7], [[5, "w"], 7], [[50, "se"], 7], [[38, "sw"], 13], [[37, "sw"], 7], [[48, "nw"], 20]] ),
                Object.fromEntries( [[[25, "s"], 40], [[39, "sw"], 22], [[51, "se"], 4], [[9, "e"], 4], [[25, "n"], 4], [[24, "s"], 4], [[50, "se"], 4], [[9, "w"], 4]] )
            ],
            curve: Object.fromEntries( [
                ["square_left", 10], ["slight_left", 9], ["strong_left", 7], ["straight", 7], ["full_left", 7], ["slight_right", 6]
            ]),
            short: 10, very_short: 6, wide: 10, half_wide: 8, skinny: 0,
            medium_wt: 10, light: 7, very_light: 6, heavy: 6,
            roof_x_height: 10, roof_midline: 6, floor_baseline: 10,
            l_edge_lf: 10, l_edge_md: 8, l_edge_rt: 0, r_edge_rt: 10
        }
    };


   /**
     * @constant
     * @static
     */
    static right_curl = {
        name: "right_curl",
        shortName: "r-curl",
        topology: "bisegment",
        stroke: "down",  
        norms: {
            shape: Object.fromEntries([
                ["simple", 40], ["bactrian", 30], ["cupped", 40], ["spiky_closure", -10]
            ]),
            neighborhood: [
                [["y", "dc", "dc", "n", "n", "n", "dc", "dc"], 20], // j
                [["dc", "n", "n", "n", "n", "dc", "dc", "y"], 20] // y
            ],
            contact: {
                j1: Object.fromEntries( [["nc", 20], ["m", 6], ["t1", 4]] ),
                y1: Object.fromEntries( [["nc", 1], ["m", 20], ["t1", 4]] ),
                y2: Object.fromEntries( [["nc", 1], ["m", 20], ["t1", 4]] )
            },
            tips: [{
                    location: Object.fromEntries( [[10, 6], [17, 10], [11, 7], [ 4, 6], [18, 6], [3, 6]] ),
                    orientation: Object.fromEntries( [["w", 8], ["e", 5], ["n", 10], ["nw", 8], ["s", 8], ["sw", 6], ["ne", 7]] )
                }, {
                    location: Object.fromEntries( [[14, 7], [7, 10], [6, 9], [21, 6], [5, 6], [13, 7], [20, 6], [12, 7]] ),
                    orientation: Object.fromEntries( [["w", 10], ["s", 9], ["sw", 9], ["e", 6], ["nw", 8], ["n", 7], ["se", 6]] )
                }],
            ends: [
                Object.fromEntries( [[[5, "w"], 25], [[5, "e"], 5], [[22, "n"], 40], [[49, "nw"], 20], [[24, "n"], 5], [[21, "s"], 15], [[22, "s"], 5], 
                 [[37, "sw"], 5], [[37, "ne"], 15], [[6, "w"], 5], [[48, "nw"], 10], [[21, "n"], 5], [[20, "s"], 5], [[25, "n"], 30]] ),

                Object.fromEntries( [[[13, "w"], 20], [[29, "s"], 40], [[12, "w"], 30], [[13, "e"], 10], [[10, "w"], 30], [[29, "n"], 10], [[40, "sw"], 10], [[42, "sw"], 30],
                 [[52, "nw"], 10], [[11, "w"], 20], [[30, "n"], 10], [[27, "n"], 10], [[43, "sw"], 20], [[54, "nw"], 20], [[55, "se"], 10], [[53, "nw"], 20],
                 [[28, "s"], 20], [[26, "s"], 10], [[41, "sw"], 10], [[23, "n"], 10]] )
            ],
            midpoint: 19,
            curve1: Object.fromEntries( [["slight_left", 8], ["slight_right", 7], ["straight", 9], ["full_left", 6], ["square_left", 8], ["square_right", 6], ["strong_left", 6]]),
            curve2: Object.fromEntries( [["slight_left", 10], ["square_right", 6], ["square_left", 8], ["strong_left", 6], ["straight", 7], ["slight_right", 6], ["full_left", 6]]),
            tall: 20, medium_ht: 8, short: 6,
            half_wide: 9, wide: 10, heavy: 8, medium_wt: 10, huge: 1,
            roof_x_height: 10, roof_midline: 6, floor_bottom: 10, floor_middown: 7,
            l_edge_md: 8, l_edge_lf: 10, r_edge_rt: 10, r_edge_md: 6
        }
    };


   /**
     * @constant
     * @static
     */
    static right_downbowl = {
        name: "right_downbowl",
        shortName: "r-dwnbwl",
        topology: "segment",
        stroke: "down",
        norms: {
            shape: Object.fromEntries([
                ["simple", 40], ["bactrian", 10], ["cupped", 40], ["spiky_closure", -10], ["closure", -40]
            ]),
            neighborhood: [
                [["y", "dc", "dc", "dc", "n", "dc", "dc", "dc"], 20]
            ],
            contact: {
                s2: Object.fromEntries( [["t1", 20], ["t1m", 7], ["nc", 1]] )
            },
            tips: [{
                    location: Object.fromEntries( [[4, 8], [11, 10], [18, 7], [19, 6], [3, 6], [17, 6]] ),
                    orientation: Object.fromEntries( [["w", 10], ["nw", 8], ["n", 6], ["e", 6], ["ne", 6], ["sw", 6]] )
                }, {
                    location: Object.fromEntries( [[5, 10], [4, 7], [12, 6]] ),
                    orientation: Object.fromEntries( [["w", 10], ["s", 6], ["n", 6], ["nw", 7], ["sw", 6]] )
                }],
            ends: [
                Object.fromEntries( [[[6, "w"], 40], [[51, "nw"], 25], [[7, "w"], 35], [[9, "e"], 5], [[25, "n"], 10], [[22, "n"], 5], [[39, "ne"], 10], [[37, "sw"], 5], [[38, "ne"], 5], [[48, "nw"], 10]] ),
                Object.fromEntries( [[[8, "w"], 40], [[23, "s"], 12], [[50, "nw"], 15], [[39, "sw"], 6], [[9, "w"], 15], [[23, "n"], 15]] )
            ],
            curve: Object.fromEntries( [
                ["strong_left", 10], ["square_left", 8], ["slight_left", 7], ["full_left", 8]
            ]),
            very_short: 10, short: 6, wide: 10, half_wide: 6,
            medium_wt: 10, light: 7, heavy: 6,
            roof_midline: 10, roof_x_height: 6, floor_baseline: 10,
            l_edge_lf: 10, l_edge_md: 6, r_edge_rt: 10
        }
    };


   /**
     * @constant
     * @static
     */
    static right_halfarc = {
        name: "right_halfarc",
        shortName: "r-hlfarc",
        topology: "segment",
        stroke: "down",
        norms: {
            shape: Object.fromEntries([
                ["simple", 40], ["bactrian", 0], ["cupped", 40], ["spiky_closure", -10]
            ]),
            neighborhood: [
                [["dc", "dc", "y", "dc", "dc", "dc", "y", "dc"], 20]
            ],
            contact: {
                w1: Object.fromEntries( [["mt2", 20], ["t2", 15], ["m", 11], ["2ts", 11]] )
            },
            tips: [{
                    location: Object.fromEntries( [[10, 10], [17, 6], [11, 8], [3, 7]] ),
                    orientation: Object.fromEntries( [["n", 10], ["se", 6], ["s", 5], ["nw", 8], ["ne", 6]] )
                }, {
                    location: Object.fromEntries( [[19, 10], [18, 6], [12, 7], [11, 6]] ),
                    orientation: Object.fromEntries( [["e", 10], ["se", 9], ["ne", 9], ["s", 9], ["n", 7]] )
                }],
            ends: [
                Object.fromEntries( [[[21, "n"], 40], [[51, "se"], 10], [[24, "n"], 35], [[48, "nw"], 20],
                 [[24, "s"], 10], [[51, "nw"], 10], [[21, "s"], 2], [[37, "ne"], 10],
                 [[38, "ne"], 10]] ),
                Object.fromEntries( [[[9, "e"], 27], [[51, "se"], 40], [[39, "ne"], 40], [[24, "s"], 27],
                 [[21, "s"], 13], [[25, "n"], 13], [[8, "e"], 13]] )
            ],
            curve: Object.fromEntries( [
                ["slight_right", 9], ["straight", 9], ["square_right", 10],
                ["slight_left", 7], ["strong_right", 9]
            ]),
            very_short: 10, short: 9, half_wide: 10, wide: 6, skinny: 8,
            medium_wt: 8, very_light: 8, light: 10, roof_x_height: 10,
            roof_midline: 9, floor_baseline: 10, floor_midline: 8,
            l_edge_md: 10, l_edge_lf: 8, r_edge_rt: 10, r_edge_md: 8
        }
    };
         

   /**
     * @constant
     * @static
     */
    static right_halfarch = {
        name: "right_halfarch",
        shortName: "r-hlfarc",
        topology: "segment",
        stroke: "down",
        norms: {
            shape: Object.fromEntries([
                ["simple", 40], ["bactrian", 0], ["cupped", 30], ["spiky_closure", -10]
            ]),
            neighborhood: [
                [["dc", "dc", "y", "dc", "dc", "dc", "y", "dc"], 20]
            ],
            contact: {
                m1: Object.fromEntries( [["t1", 20], ["nc", 1]] )
            },
            tips: [{
                    location: Object.fromEntries( [[10, 10], [11, 9], [17, 7]] ),
                    orientation: Object.fromEntries( [["w", 10], ["s", 9], ["nw", 9], ["n", 7], ["sw", 7]] )
                }, {
                    location: Object.fromEntries( [[19, 10], [12, 8], [18, 6]] ),
                    orientation: Object.fromEntries( [["s", 10], ["w", 6], ["sw", 7], ["se", 6]] )
                }],
            ends: [
                Object.fromEntries( [[[5, "w"], 40], [[21, "s"], 40], [[49, "nw"], 40], [[22, "n"], 20],
                 [[37, "sw"], 20], [[7, "w"], 20], [[4, "w"], 10]] ),
                Object.fromEntries( [[[25, "s"], 40], [[9, "w"], 8], [[39, "sw"], 16], [[49, "se"], 8]] )
            ],
            curve: Object.fromEntries( [
                ["slight_left", 7], ["strong_left", 7], ["square_left", 7]
            ]),
            very_short: 7, short: 10, half_wide: 10, medium_wt: 9, light: 10,
            roof_x_height: 10, roof_midline: 6, floor_baseline: 10,
            floor_midline: 6, l_edge_md: 10, r_edge_rt: 10
        }
    };


   /**
     * @constant
     * @static
     */
    static right_halfpost = {
        name: "right_halfpost",
        shortName: "r-hlfpst",
        topology: "segment",
        stroke: "down",
        norms: {
            shape: Object.fromEntries([
                ["simple", 40], ["bactrian", 10], ["cupped", 30], ["spiky_closure", -10]
            ]),
            neighborhood: [
                [["dc", "n", "n", "n", "dc", "dc", "y", "dc"], 20]
            ],
            contact: {
                u1: Object.fromEntries( [["t2", 20], ["m", 18]] ),
                w1: Object.fromEntries( [["t2", 20], ["m", 18]] )
            },
            tips: [{
                    location: Object.fromEntries( [[17, 10], [10, 7], [18, 7], [11, 6]] ),
                    orientation: Object.fromEntries( [["n", 9], ["w", 7], ["s", 10], ["ne", 8], ["se", 7], ["nw", 8]] )
                }, {
                    location: Object.fromEntries( [[19, 10], [18, 9], [12, 8]] ),
                    orientation: Object.fromEntries( [["s", 10], ["se", 7], ["sw", 7], ["ne", 6], ["e", 6]] )
                }],
            ends: [
                Object.fromEntries( [[[22, "n"], 40], [[5, "w"], 15], [[22, "s"], 40], [[21, "s"], 20],
                 [[49, "se"], 20], [[37, "ne"], 40], [[49, "nw"], 40], [[21, "n"], 20],
                 [[25, "s"], 20]] ),
                Object.fromEntries( [[[25, "s"], 40], [[22, "s"], 20], [[49, "se"], 10], [[51, "se"], 10],
                 [[39, "sw"], 20], [[39, "ne"], 10], [[24, "s"], 10], [[9, "e"], 10]] )
            ],
            curve: Object.fromEntries( [
                ["straight", 10], ["square_left", 7], ["slight_left", 7], ["strong_left", 6],
                ["square_right", 7], ["strong_right", 6], ["full_left", 6], ["full_right", 6]
            ]),
            short: 10, very_short: 8, skinny: 8, half_wide: 10, light: 10, medium_wt: 8,
            very_light: 8, roof_x_height: 10, roof_midline: 8, floor_baseline: 10, floor_midline: 8,
            l_edge_rt: 7, l_edge_md: 10, r_edge_rt: 10, r_edge_md: 6
        }
    };


   /**
     * @constant
     * @static
     */
    static right_hook = {
        name: "right_hook",
        shortName: "r-hook",
        topology: "bisegment",
        stroke: "down",
        norms: {
            shape: Object.fromEntries([
                ["simple", 40], ["bactrian", 20], ["cupped", 40], ["spiky_closure", -10]
            ]),
            neighborhood: [
                [["dc", "dc", "n", "n", "n", "n", "dc", "dc"], 20]
            ],
            contact: {
                g1: Object.fromEntries( [["t1m", 20], ["m", 5], ["2ms", 19], ["t1", 4], ["nc", 1]] ),
                g2: Object.fromEntries( [["m", 20], ["t1", 18], ["nc", 1]] )
            },
            tips: [{
                    location: Object.fromEntries( [[10, 7], [3, 6], [18, 7], [17, 10], [11, 6]] ),
                    orientation: Object.fromEntries( [["w", 7], ["nw", 6], ["n", 12], ["e", 4], ["ne", 6]] )
                }, {
                    location: Object.fromEntries( [[14, 6], [6, 10], [7, 7], [5, 6], [21, 6], [12, 6], [13, 6]] ),
                    orientation: Object.fromEntries( [["w", 10], ["n", 7], ["nw", 7], ["se", 6], ["sw", 6]] )
                }],
            ends: [
                Object.fromEntries( [[[5, "w"], 1], [[48, "nw"], 5], [[25, "n"], 5], [[5, "e"], 1],
                    [[37, "ne"], 5], [[39, "ne"], 5], [[24, "n"], 5], [[49, "nw"], 5],
                    [[22, "n"], 40]] ),
                Object.fromEntries( [[[13, "w"], 8], [[29, "n"], 24], [[12, "w"], 24], [[54, "nw"], 16],
                    [[10, "w"], 40], [[52, "nw"], 16], [[54, "se"], 8], [[27, "n"], 8],
                    [[11, "w"], 8], [[55, "nw"], 8], [[53, "nw"], 8], [[41, "sw"], 8]] ),
            ],
            midpoint: 19,
            curve1: Object.fromEntries( [
                ["slight_left", 7], ["square_right", 6], ["straight", 9], ["slight_right", 6]
            ]),
            curve2: Object.fromEntries( [
                ["slight_left", 10], ["square_left", 9], ["straight", 6], ["strong_left", 7],  ["slight_right", -80]
            ]),
            tall: 9, medium_ht: 10, short: 6, half_wide: 7, wide: 10, heavy: 7,
            medium_wt: 10, roof_x_height: 10, roof_midline: 7, floor_bottom: 10, floor_middown: 9,
            l_edge_md: 6, l_edge_lf: 10, r_edge_rt: 10, r_edge_md: 6
        }
    };


   /**
     * @constant
     * @static
     */
    static right_post = {
        name: "right_post",
        shortName: "r-post",
        topology: "segment",
        stroke: "down",
        norms: {
            shape: Object.fromEntries([
                ["simple", 40], ["bactrian", 10], ["cupped", 30], ["spiky_closure", -10]
            ]),
            neighborhood: [
                [["n", "n", "dc", "dc", "dc", "y", "dc", "dc"], 20]
            ],
            contact: {
                d1: Object.fromEntries( [["mt2", 20], ["m", 4], ["2ms", 14], ["t2", 4]] ),
                d2: Object.fromEntries( [["m", 20], ["t2", 15]] )
            },
            tips: [{
                    location: Object.fromEntries( [[15, 10], [9, 8], [16, 8], [8, 7]] ),
                    orientation: Object.fromEntries( [["n", 10], ["ne", 7], ["nw", 6], ["sw", 6]] )
                }, {
                    location: Object.fromEntries( [[19, 10], [18, 7], [12, 6]] ),
                    orientation: Object.fromEntries( [["s", 10], ["se", 8], ["sw", 6]] )
                }],
            ends: [
                Object.fromEntries( [[[16, "n"], 40], [[33, "ne"], 40], [[19, "n"], 40], [[18, "n"], 20], [[45, "nw"], 20], [[33, "sw"], 20]] ),
                Object.fromEntries( [[[25, "s"], 40], [[51, "se"], 40], [[22, "s"], 27], [[39, "sw"], 13]] )
            ],
            curve: Object.fromEntries( [
                ["straight", 10], ["slight_right", 9], ["slight_left", 7], ["square_left", 7]
            ]),
            tall: 10, medium_ht: 8, short: 6, skinny: 10, half_wide: 9,
            medium_wt: 10, heavy: 8, light: 6, roof_top: 10,
            roof_t_height: 8, floor_baseline: 10, floor_midline: 7,
            l_edge_rt: 10, l_edge_md: 9, r_edge_rt: 10
        }
    };

    
   /**
     * @constant
     * @static
     */
    static right_tail = {
        name: "right_tail",
        shortName: "r-tail",
        topology: "segment",
        stroke: "down",
        norms: {
            shape: Object.fromEntries([
                ["simple", 40], ["bactrian", 30], ["cupped", 40], ["spiky_closure", -10]
            ]),
            neighborhood: [
                [["dc", "dc", "n", "n", "n", "n", "dc", "dc"], 20]
            ],
            contact: {
                q1: Object.fromEntries( [["t1m", 20], ["m", 5], ["2ms", 15], ["t1", 5], ["nc", 1]] ),
                q2: Object.fromEntries( [["m", 20], ["t1", 18], ["nc", 1]] )
            },
            tips: [{
                    location: Object.fromEntries( [[17, 10], [19, 7], [18, 7], [3, 6], [10, 6]] ),
                    orientation: Object.fromEntries( [["n", 10], ["se", 6], ["nw", 7], ["ne", 7], ["s", 6], ["e", 4]] )
                }, {
                    location: Object.fromEntries( [[21, 10], [14, 6], [20, 7]] ),
                    orientation: Object.fromEntries( [["s", 10], ["se", 6], ["e", 7], ["ne", 5], ["n", 5]] )
                }],
            ends: [
                Object.fromEntries( [[[22, "n"], 40], [[51, "se"], 13], [[25, "n"], 27], [[37, "ne"], 27], [[49, "nw"], 13], [[28, "s"], 13], [[48, "nw"], 13], [[5, "e"], 5]] ),
                Object.fromEntries( [[[31, "s"], 40], [[30, "s"], 10], [[28, "s"], 30], [[55, "se"], 10], [[13, "e"], 20], [[11, "e"], 10], [[43, "ne"], 9]] )
            ],
            curve: Object.fromEntries( [
                ["straight", 10], ["square_right", 7], ["slight_left", 6], ["slight_right", 6]
            ]),
            tall: 9, medium_ht: 10, short: 6, very_short: 6, skinny: 10,
            half_wide: 10, wide: 6, medium_wt: 10, light: 6, heavy: 7, very_light: 6,
            roof_x_height: 10, roof_midline: 7, roof_baseline: 6, floor_bottom: 10, floor_middown: 7,
            l_edge_rt: 10, l_edge_md: 9, l_edge_lf: 6, r_edge_rt: 10
        }
    };


   /**
     * @constant
     * @static
     */
    static right_wing = {
        name: "right_wing",
        shortName: "r-wing",
        topology: "segment",
        stroke: "down",
        norms: {
            shape: Object.fromEntries([
                ["simple", 40], ["bactrian", -200], ["cupped", -200], ["spiky_closure", -10]
            ]),
            neighborhood: [
                [["dc", "n", "n", "n", "dc", "dc", "y", "dc"], 20]
            ],
            contact: {
                v1: Object.fromEntries( [["t2", 20]] )
            },
            tips: [{
                    location: Object.fromEntries( [[17, 10], [11, 7], [10, 9]] ),
                    orientation: Object.fromEntries( [["n", 10], ["s", 7], ["nw", 7], ["w", 9], ["ne", 7]] )
                }, {
                    location: Object.fromEntries( [[12, 10], [19, 9], [5, 9]] ),
                    orientation: Object.fromEntries( [["sw", 10], ["s", 7]] )
                }],
            ends: [
                Object.fromEntries( [[[22, "n"], 40], [[21, "s"], 13], [[49, "nw"], 13], [[5, "w"], 27], [[37, "ne"], 13]] ),
                Object.fromEntries( [[[39, "sw"], 40], [[25, "s"], 27], [[38, "sw"], 27], [[8, "w"], 13], [[24, "s"], 27]] )
            ],
            curve: Object.fromEntries( [
                ["slight_left", 10], ["full_left", 7], ["square_left", 7], ["straight", 8], ["strong_left", 6], ["slight_right", 6]
            ]),
            short: 10, very_short: 8, half_wide: 10, wide: 9, skinny: 8,
            light: 10,
            medium_wt: 9, roof_x_height: 10, roof_midline: 8, floor_baseline: 10,
            l_edge_rt: 8, l_edge_md: 10, l_edge_lf: 9, r_edge_rt: 10,
            r_edge_md: 8, r_edge_lf: 8
        }
    };


   /**
     * @constant
     * @static
     */
    static s_base = {
        name: "s_base",
        shortName: "s-base",
        topology: "segment",
        stroke: "right",
        norms: {
            shape: Object.fromEntries([
                ["simple", 40], ["bactrian", 0], ["cupped", 40], ["spiky_closure", -10]
            ]),
            neighborhood: [
                [["y", "dc", "dc", "n", "n", "n", "dc", "dc"], 20]
            ],
            contact: {
                s1: Object.fromEntries( [["t2", 20], ["mt2", 11]] )
            },
            tips: [{
                    location: Object.fromEntries( [[5, 10], [3, 6], [4, 8], [12, 7]] ),
                    orientation: Object.fromEntries( [["w", 10], ["s", 6], ["nw", 8], ["e", 6]] )
                }, {
                    location: Object.fromEntries( [[19, 10], [18, 9], [5, 6], [17, 6]] ),
                    orientation: Object.fromEntries( [["e", 10], ["ne", 9], ["n", 9], ["se", 7], ["s", 7]] )
                }],
            ends: [
                Object.fromEntries( [[[8, "w"], 40], [[23, "s"], 30], [[50, "nw"], 20], [[48, "nw"], 10], [[9, "e"], 10], [[9, "w"], 10]] ),
                Object.fromEntries( [[[9, "e"], 40], [[39, "ne"], 30], [[25, "n"], 20], [[51, "se"], 10], [[23, "s"], 10], [[22, "n"], 10]] )
            ],
            curve: Object.fromEntries( [
                ["straight", 10], ["slight_right", 8], ["square_right", 8], ["slight_left", 6]
            ]),
            no_height: 8, very_short: 10, short: 7, wide: 10, skinny: 6,
            half_wide: 6, light: 10, medium_wt: 8, very_light: 7,
            roof_baseline: 7, roof_midline: 10, roof_x_height: 7,
            floor_baseline: 10, l_edge_lf: 10, l_edge_md: 6, r_edge_rt: 10,
            r_edge_lf: 6
        }
    };


   /**
     * @constant
     * @static
     */
    static s_crossbar = {
        name: "s_crossbar",
        shortName: "s-cross",
        topology: "segment",
        stroke: "right",
        norms: {
            shape: Object.fromEntries([
                ["simple", 40], ["bactrian", 10], ["cupped", 40], ["spiky_closure", -10]
            ]),
            neighborhood: [
                [["y", "dc", "dc", "dc", "y", "dc", "dc", "dc"], 20]
            ],
            contact: {
                s1: Object.fromEntries( [["2ts", 20]] )
            },
            tips: [{
                    location: Object.fromEntries( [[4, 10], [3, 8], [11, 7], [10, 7]] ),
                    orientation: Object.fromEntries( [["w", 10], ["nw", 9], ["e", 9]] )
                }, {
                    location: Object.fromEntries( [[18, 10], [19, 9], [11, 7], [17, 9]] ),
                    orientation: Object.fromEntries( [["e", 10], ["se", 7], ["ne", 6]] )
                }],
            ends: [
                Object.fromEntries( [[[6, "w"], 40], [[48, "nw"], 27], [[6, "e"], 13], [[5, "e"], 13], [[37, "ne"], 13], [[7, "e"], 13]] ),
                Object.fromEntries( [[[7, "e"], 40], [[51, "se"], 27], [[6, "e"], 13], [[37, "ne"], 13], [[38, "sw"], 13], [[5, "e"], 13]] )
            ],
            curve: Object.fromEntries( [
                ["straight", 10], ["slight_right", 7], ["slight_left", 6]
            ]),
            no_height: 10, very_short: 9, short: 8, wide: 10, half_wide: 8,
            light: 10, very_light: 8, roof_midline: 10, roof_x_height: 9,
            floor_midline: 10, floor_baseline: 7, floor_x_height: 6,
            l_edge_lf: 10, l_edge_md: 7, r_edge_rt: 10, r_edge_md: 6
        }
    };


   /**
     * @constant
     * @static
     */
    static t_post = {
        name: "t_post",
        shortName: "t-post",
        topology: "bisegment",
        stroke: "down",
        norms: {
            shape: Object.fromEntries([
                ["simple", 40], ["bactrian", 20], ["cupped", 40], ["spiky_closure", -10]
            ]),
            neighborhood: [
                [["n", "n", "dc", "n", "n", "n", "dc", "n"], 20]
            ],
            contact: {
                t1: Object.fromEntries( [["m", 20]] )
            },
            tips: [{
                    location: Object.fromEntries( [[9, 10], [16, 6], [8, 6], [2, 9]] ),
                    orientation: Object.fromEntries( [["n", 10], ["ne", 6], ["nw", 6]] )
                }, {
                    location: Object.fromEntries( [[19, 10], [11, 7], [18, 9], [12, 6]] ),
                    orientation: Object.fromEntries( [["e", 10], ["w", 7], ["ne", 8], ["sw", 7], ["se", 8], ["n", 9], ["s", 7]] )
                }],
            ends: [
                Object.fromEntries( [[[18, "n"], 40], [[35, "ne"], 6], [[17, "n"], 17], [[46, "nw"], 11], [[15, "n"], 6]] ),
                Object.fromEntries( [[[9, "e"], 40], [[7, "w"], 10], [[39, "ne"], 20], [[39, "sw"], 10], [[51, "se"], 20], [[25, "n"], 20], [[24, "n"], 10], [[24, "s"], 10]] )
            ],
            midpoint: 11,
            curve1: Object.fromEntries( [
                ["straight", 9], ["slight_right", 7], ["square_left", 6], ["slight_left", 7]
            ]),
            curve2: Object.fromEntries( [
                ["square_right", 9], ["strong_left", 6], ["slight_right", 8], ["strong_right", 10], ["full_right", 7], ["straight", 6]
            ]),
            medium_ht: 10, tall: 6, half_wide: 10, skinny: 9, wide: 9, medium_wt: 10, heavy: 7,
            roof_t_height: 10, roof_top: 6, floor_baseline: 10,
            l_edge_md: 10, l_edge_lf: 9, r_edge_rt: 10, r_edge_md: 6
        }
    };


   /**
     * @constant
     * @static
     */
    static up_arm = {
        name: "up_arm",
        shortName: "up-arm",
        topology: "segment",
        stroke: "upright",
        norms: {
            shape: Object.fromEntries([
                ["simple", 40], ["bactrian", 0], ["cupped", 30], ["spiky_closure", -10]
            ]),
            neighborhood: [
                [["y", "dc", "dc", "dc", "y", "y", "y", "y"], 20]
            ],
            contact: {
                k1: Object.fromEntries( [["t1", 20], ["t1m", 20], ["m", 11]] )
            },
            tips: [{
                    location: Object.fromEntries( [[5, 6], [4, 10], [11, 6], [3, 8], [10, 6], [12, 6]] ),
                    orientation: Object.fromEntries( [["sw", 10], ["w", 9], ["ne", 8], ["e", 8], ["s", 6]] )
                }, {
                    location: Object.fromEntries( [[17, 10], [11, 6], [18, 8], [10, 7]] ),
                    orientation: Object.fromEntries( [["ne", 10], ["e", 9], ["se", 8], ["s", 8]] )
                }],
            ends: [
                Object.fromEntries( [[[38, "sw"], 13], [[6, "w"], 27], [[37, "ne"], 13], [[4, "w"], 27], [[36, "sw"], 40], [[4, "e"], 13], [[5, "e"], 13], [[36, "ne"], 13], [[24, "s"], 10]] ),
                Object.fromEntries( [[[37, "ne"], 40], [[5, "e"], 40], [[49, "se"], 27], [[21, "s"], 13], [[36, "ne"], 13], [[22, "s"], 13], [[4, "e"], 13]] )
            ],
            curve: Object.fromEntries( [
                ["straight", 10], ["slight_right", 6], ["square_left", 6], ["strong_left", 6], ["slight_left", 8]
            ]),
            short: 6, very_short: 10, no_height: 8, wide: 10, half_wide: 9, light: 10, medium_wt: 7, very_light: 8,
            roof_x_height: 10, floor_baseline: 6, floor_midline: 10, floor_x_height: 8,
            l_edge_lf: 10, l_edge_md: 6, r_edge_rt: 10, r_edge_md: 7
        }
    };


   /**
     * @constant
     * @static
     */
    static up_circle = {
        name: "up_circle",
        shortName: "up-circ",
        topology: "loop",
        norms: {
            shape: Object.fromEntries([
                ["closure", 40], ["spiky_closure", 10]
            ]),
            neighborhood: [
                [["n", "n", "dc", "dc", "y", "y", "dc", "dc"], 20]
            ],
            contact: {
                e2: Object.fromEntries( [["nc", 1], ["c_lf", 20], ["c_rt", 20], ["m", 11], ["t1", 11], ["t2", 11]] )
            },
            first_point: Object.fromEntries( [[4, 20], [3, 20], [10, 1], [11, 1]] ),
            last_point: Object.fromEntries( [[18, 20], [17, 20], [10, 1], [11, 1]] ),
            very_short: 10, short: 7, wide: 10, half_wide: 6, heavy: 10,
            medium_wt: 9, roof_x_height: 10, floor_midline: 10,
            floor_baseline: 7, l_edge_lf: 10, l_edge_md: 6, r_edge_rt: 10
        }
    };


   /**
     * @constant
     * @static
     */
    static z_cap = {
        name: "z_cap",
        shortName: "z-cap",
        topology: "segment",
        stroke: "right",
        norms: {
            shape: Object.fromEntries([
                ["simple", 40], ["bactrian", 40], ["cupped", 40], ["spiky_closure", -10]
            ]),
            neighborhood: [
                [["n", "dc", "dc", "dc", "y", "dc", "dc", "dc"], 20]
            ],
            contact: {
                z1: Object.fromEntries( [["t2", 20], ["m", 13]] )
            },
            tips: [{
                    location: Object.fromEntries( [[3, 10], [4, 9], [10, 7]] ),
                    orientation: Object.fromEntries( [["w", 10], ["ne", 8], ["sw", 9], ["e", 9], ["s", 6]] )
                }, {
                    location: Object.fromEntries( [[17, 10], [18, 9], [10, 9]] ),
                    orientation: Object.fromEntries( [["e", 10], ["se", 8], ["ne", 7]] )
                }],
            ends: [
                Object.fromEntries( [[[4, "w"], 40], [[36, "ne"], 20], [[36, "sw"], 40], [[5, "w"], 10], [[5, "e"], 10], [[4, "e"], 5], [[20, "s"], 10], [[20, "n"], 7]] ),
                Object.fromEntries( [[[5, "e"], 40], [[49, "se"], 27], [[4, "e"], 13], [[36, "ne"], 13]] )
            ],
            curve: Object.fromEntries( [
                ["straight", 10], ["slight_left", 8], ["square_left", 7]
            ]),
            no_height: 10, very_short: 9, wide: 10, half_wide: 9, light: 10,
            very_light: 8, medium_wt: 6,
            roof_x_height: 10, floor_x_height: 10, floor_midline: 9,
            l_edge_lf: 10, l_edge_md: 8, r_edge_rt: 10, r_edge_md: 7
        }
    };
};


for (let roleName in Roles) { Object.freeze(Roles[roleName]); }
Object.freeze(Roles);
