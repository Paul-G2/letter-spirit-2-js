   /**
 * @classdesc
 * This class encapsulates the definitions for Whole objects.
 * 
 */
class Wholes
{
    static Names = ['a1', 'a2', 'b1', 'b2', 'c1', 'd1', 'd2', 'e1', 'e2', 'f1', 'g1', 'g2', 
                    'h1', 'i1', 'j1', 'k1', 'l1', 'm1', 'n1', 'o1', 'p1', 'p2', 
                    'q1', 'q2', 'r1', 's1', 's2', 't1', 'u1', 'v1', 'w1', 'x1', 'y1', 'y2', 'z1'];

    static a1 = {name: 'a1',  roleSet: [Roles.a_arch, Roles.left_downbowl] };
    static a2 = {name: 'a2',  roleSet: [Roles.a_arch, Roles.down_circle] };
    static b1 = {name: 'b1',  roleSet: [Roles.left_post, Roles.right_bowl] };
    static b2 = {name: 'b2',  roleSet: [Roles.left_post, Roles.circle] };
    static c1 = {name: 'c1',  roleSet: [Roles.left_bowl] };
    static d1 = {name: 'd1',  roleSet: [Roles.right_post, Roles.left_bowl] };
    static d2 = {name: 'd2',  roleSet: [Roles.right_post, Roles.circle] };
    static e1 = {name: 'e1',  roleSet: [Roles.e_bowl, Roles.e_crossbar] };
    static e2 = {name: 'e2',  roleSet: [Roles.up_circle, Roles.e_tail] };
    static f1 = {name: 'f1',  roleSet: [Roles.f_post, Roles.crossbar] };
    static g1 = {name: 'g1',  roleSet: [Roles.right_hook, Roles.left_bowl] };
    static g2 = {name: 'g2',  roleSet: [Roles.right_hook, Roles.circle] };

    static h1 = {name: 'h1',  roleSet: [Roles.left_post, Roles.right_buttress] };
    static i1 = {name: 'i1',  roleSet: [Roles.halfpost, Roles.dot] };
    static j1 = {name: 'j1',  roleSet: [Roles.right_curl, Roles.dot] };
    static k1 = {name: 'k1',  roleSet: [Roles.left_post, Roles.up_arm, Roles.down_arm] };
    static l1 = {name: 'l1',  roleSet: [Roles.center_post] };
    static m1 = {name: 'm1',  roleSet: [Roles.left_halfpost, Roles.left_halfarch, Roles.right_halfarch] };
    static n1 = {name: 'n1',  roleSet: [Roles.left_halfpost, Roles.right_buttress] };
    static o1 = {name: 'o1',  roleSet: [Roles.circle] };
    static p1 = {name: 'p1',  roleSet: [Roles.left_tail, Roles.right_bowl] };
    static p2 = {name: 'p2',  roleSet: [Roles.left_tail, Roles.circle] };

    static q1 = {name: 'q1',  roleSet: [Roles.right_tail, Roles.left_bowl] };
    static q2 = {name: 'q2',  roleSet: [Roles.right_tail, Roles.circle] };
    static r1 = {name: 'r1',  roleSet: [Roles.left_halfpost, Roles.cap] };
    static s1 = {name: 's1',  roleSet: [Roles.cap, Roles.s_crossbar, Roles.s_base] };
    static s2 = {name: 's2',  roleSet: [Roles.left_upbowl, Roles.right_downbowl] };
    static t1 = {name: 't1',  roleSet: [Roles.t_post, Roles.crossbar] };
    static u1 = {name: 'u1',  roleSet: [Roles.right_halfpost, Roles.left_uparc] };
    static v1 = {name: 'v1',  roleSet: [Roles.left_wing, Roles.right_wing] };
    static w1 = {name: 'w1',  roleSet: [Roles.right_halfpost, Roles.left_halfarc, Roles.right_halfarc] };
    static x1 = {name: 'x1',  roleSet: [Roles.foreslash, Roles.backslash] };
    static y1 = {name: 'y1',  roleSet: [Roles.right_curl, Roles.left_uparc] };
    static y2 = {name: 'y2',  roleSet: [Roles.right_curl, Roles.backslash] };
    static z1 = {name: 'z1',  roleSet: [Roles.z_cap, Roles.foreslash, Roles.basebar] };



    // For each Whole category, the following Rules are noteworthy if they are upheld:
    static CategoryNorms = {
        a: ['ban_rightedge', 'ban_leftedge', 'ban_horiz_quanta', 'ban_vert_quanta',
            'ban_foreslash_quanta', 'ban_backslash_quanta',
            'ban_rectilinear_quanta', 'ban_diagonal_quanta', 'ban_45_angle',
            'ban_90_angle', 'ban_135_angle', 'ban_180_angle',
            'ban_45_135_angle', 'ban_90_180_angle', 'at_least_2'],

        b: ['ban_topbox', 'ban_ascender', 'ban_rightedge', 'ban_leftedge', 'ban_vertboxes',
            'ban_topleft', 'ban_corners', 'ban_horiz_quanta', 'ban_vert_quanta',
            'ban_foreslash_quanta', 'ban_backslash_quanta',
            'ban_rectilinear_quanta', 'ban_diagonal_quanta', 'ban_45_angle',
            'ban_90_angle', 'ban_135_angle', 'ban_180_angle', 'ban_45_135_angle',
            'ban_90_180_angle', 'at_least_2', 'at_most_2', 'at_most_3'],

        c: ['ban_leftedge', 'ban_horiz_quanta', 'ban_vert_quanta', 'ban_foreslash_quanta',
            'ban_backslash_quanta', 'ban_rectilinear_quanta',
            'ban_diagonal_quanta', 'ban_90_angle', 'ban_135_angle',
            'ban_180_angle', 'ban_45_135_angle',
            'ban_90_180_angle', 'at_least_2'],

        d: ['ban_topbox', 'ban_ascender', 'ban_rightedge', 'ban_leftedge', 'ban_vertboxes',
            'ban_topright', 'ban_corners', 'ban_horiz_quanta', 'ban_vert_quanta',
            'ban_foreslash_quanta', 'ban_backslash_quanta',
            'ban_rectilinear_quanta', 'ban_diagonal_quanta', 'ban_45_angle',
            'ban_90_angle', 'ban_135_angle', 'ban_180_angle', 'ban_45_135_angle',
            'ban_90_180_angle', 'at_least_2', 'at_most_2', 'at_most_3'],

        e: ['ban_rightedge', 'ban_leftedge', 'ban_horiz_quanta', 'ban_vert_quanta',
            'ban_foreslash_quanta', 'ban_backslash_quanta',
            'ban_rectilinear_quanta', 'ban_diagonal_quanta', 'ban_45_angle',
            'ban_90_angle', 'ban_135_angle', 'ban_180_angle',
            'ban_45_135_angle', 'ban_90_180_angle', 'at_least_2'],

        f: ['ban_topedge', 'ban_topbox', 'ban_ascender', 'ban_vertedges', 'ban_vertboxes',
            'ban_topright', 'ban_corners', 'ban_horiz_quanta', 'ban_vert_quanta',
            'ban_foreslash_quanta', 'ban_rectilinear_quanta',
            'ban_diagonal_quanta', 'ban_90_angle', 'ban_135_angle',
            'ban_180_angle', 'ban_45_135_angle', 'ban_90_180_angle', 'at_least_2',
            'at_most_2', 'at_most_3'],

        g: ['ban_descender', 'ban_bottombox', 'ban_bottomedge', 'ban_rightedge',
            'ban_leftedge', 'ban_vertedges', 'ban_vertboxes', 'ban_bottomright',
            'ban_corners', 'ban_horiz_quanta', 'ban_vert_quanta',
            'ban_foreslash_quanta', 'ban_backslash_quanta',
            'ban_rectilinear_quanta', 'ban_diagonal_quanta', 'ban_45_angle',
            'ban_90_angle', 'ban_135_angle', 'ban_180_angle',
            'ban_45_135_angle', 'ban_90_180_angle', 'at_least_2', 'at_most_2',
            'at_most_3'],

        h: ['ban_topbox', 'ban_ascender', 'ban_rightedge', 'ban_leftedge', 'ban_vertboxes',
            'ban_topleft', 'ban_corners', 'ban_horiz_quanta', 'ban_vert_quanta',
            'ban_foreslash_quanta', 'ban_backslash_quanta',
            'ban_rectilinear_quanta', 'ban_diagonal_quanta', 'ban_45_angle',
            'ban_90_angle', 'ban_135_angle', 'ban_180_angle', 'ban_45_135_angle',
            'ban_90_180_angle', 'at_least_2', 'at_most_2', 'at_most_3'],

        i: ['ban_topbox', 'ban_ascender', 'ban_rightedge', 'ban_leftedge', 'ban_vertboxes',
            'ban_horiz_quanta', 'ban_vert_quanta', 'ban_foreslash_quanta',
            'ban_rectilinear_quanta', 'ban_diagonal_quanta', 'ban_90_angle',
            'ban_180_angle', 'ban_90_180_angle', 'at_least_2'],

        j: ['ban_topbox', 'ban_ascender', 'ban_descender', 'ban_bottombox', 'ban_bottomedge',
            'ban_rightedge', 'ban_vertedges', 'ban_vertboxes', 'ban_topright',
            'ban_bottomleft', 'ban_bottomright', 'ban_corners', 'ban_horiz_quanta',
            'ban_vert_quanta', 'ban_foreslash_quanta', 'ban_rectilinear_quanta',
            'ban_diagonal_quanta', 'ban_90_angle', 'ban_135_angle',
            'ban_180_angle', 'ban_45_135_angle', 'ban_90_180_angle', 'at_least_2',
            'at_most_2', 'at_most_3'],

        k: ['ban_topbox', 'ban_ascender', 'ban_leftedge', 'ban_vertboxes', 'ban_topleft',
            'ban_corners', 'ban_horiz_quanta', 'ban_vert_quanta',
            'ban_foreslash_quanta', 'ban_backslash_quanta',
            'ban_rectilinear_quanta', 'ban_diagonal_quanta', 'ban_45_angle',
            'ban_90_angle', 'ban_135_angle', 'ban_180_angle', 'ban_45_135_angle',
            'ban_90_180_angle', 'at_least_2', 'at_most_2', 'at_most_3'],

        l: ['ban_topbox', 'ban_ascender', 'ban_leftedge', 'ban_vertboxes', 'ban_topleft',
            'ban_corners', 'ban_vert_quanta', 'ban_backslash_quanta',
            'ban_rectilinear_quanta', 'ban_diagonal_quanta', 'ban_135_angle',
            'ban_180_angle', 'ban_45_135_angle',
            'ban_90_180_angle', 'at_least_2', 'at_most_2', 'at_most_3'],

        m: ['ban_rightedge', 'ban_leftedge', 'ban_horiz_quanta', 'ban_vert_quanta',
            'ban_foreslash_quanta', 'ban_backslash_quanta',
            'ban_rectilinear_quanta', 'ban_diagonal_quanta', 'ban_45_angle',
            'ban_90_angle', 'ban_135_angle', 'ban_180_angle',
            'ban_45_135_angle', 'ban_90_180_angle', 'at_least_2'],

        n: ['ban_rightedge', 'ban_leftedge', 'ban_horiz_quanta', 'ban_vert_quanta',
            'ban_foreslash_quanta', 'ban_backslash_quanta',
            'ban_rectilinear_quanta', 'ban_diagonal_quanta', 'ban_45_angle',
            'ban_90_angle', 'ban_135_angle', 'ban_180_angle',
            'ban_45_135_angle', 'ban_90_180_angle', 'at_least_2'],

        o: ['ban_rightedge', 'ban_leftedge', 'ban_horiz_quanta', 'ban_vert_quanta',
            'ban_foreslash_quanta', 'ban_backslash_quanta',
            'ban_rectilinear_quanta', 'ban_diagonal_quanta', 'ban_90_angle',
            'ban_180_angle', 'ban_90_180_angle', 'at_least_2'],

        p: ['ban_descender', 'ban_bottombox', 'ban_rightedge', 'ban_leftedge', 'ban_vertboxes',
            'ban_bottomleft', 'ban_corners', 'ban_horiz_quanta',
            'ban_vert_quanta', 'ban_foreslash_quanta',
            'ban_backslash_quanta', 'ban_rectilinear_quanta',
            'ban_diagonal_quanta', 'ban_45_angle', 'ban_90_angle',
            'ban_135_angle', 'ban_180_angle', 'ban_45_135_angle',
            'ban_90_180_angle', 'at_least_2', 'at_most_2', 'at_most_3'],

        q: ['ban_descender', 'ban_bottombox', 'ban_rightedge', 'ban_leftedge', 'ban_vertboxes',
            'ban_bottomright', 'ban_corners', 'ban_horiz_quanta',
            'ban_vert_quanta', 'ban_foreslash_quanta',
            'ban_backslash_quanta', 'ban_rectilinear_quanta',
            'ban_diagonal_quanta', 'ban_45_angle', 'ban_90_angle',
            'ban_135_angle', 'ban_180_angle', 'ban_45_135_angle',
            'ban_90_180_angle', 'at_least_2', 'at_most_2', 'at_most_3'],

        r: ['ban_leftedge', 'ban_horiz_quanta', 'ban_vert_quanta', 'ban_foreslash_quanta',
            'ban_rectilinear_quanta', 'ban_diagonal_quanta', 'ban_45_angle',
            'ban_90_angle', 'ban_135_angle', 'ban_180_angle', 'ban_45_135_angle',
            'ban_90_180_angle', 'at_least_2'],

        s: ['ban_rightedge', 'ban_leftedge', 'ban_horiz_quanta', 'ban_vert_quanta',
            'ban_foreslash_quanta', 'ban_rectilinear_quanta',
            'ban_diagonal_quanta', 'ban_45_angle', 'ban_90_angle',
            'ban_135_angle', 'ban_180_angle', 'ban_45_135_angle',
            'ban_90_180_angle', 'at_least_2'],

        t: ['ban_ascender', 'ban_horiz_quanta', 'ban_vert_quanta', 'ban_foreslash_quanta',
            'ban_rectilinear_quanta', 'ban_diagonal_quanta',
            'ban_45_angle', 'ban_90_angle', 'ban_180_angle', 'ban_45_135_angle',
            'ban_90_180_angle', 'at_least_2', 'at_most_2', 'at_most_3'],

        u: ['ban_rightedge', 'ban_leftedge', 'ban_horiz_quanta', 'ban_vert_quanta',
            'ban_foreslash_quanta', 'ban_rectilinear_quanta',
            'ban_diagonal_quanta', 'ban_45_angle', 'ban_90_angle',
            'ban_135_angle', 'ban_180_angle', 'ban_45_135_angle',
            'ban_90_180_angle', 'at_least_2'],

        v: ['ban_rightedge', 'ban_leftedge', 'ban_vert_quanta', 'ban_foreslash_quanta',
            'ban_backslash_quanta', 'ban_rectilinear_quanta',
            'ban_diagonal_quanta', 'ban_90_angle', 'ban_135_angle',
            'ban_45_135_angle', 'ban_90_180_angle', 'at_least_2'],

        w: ['ban_rightedge', 'ban_leftedge', 'ban_horiz_quanta', 'ban_vert_quanta',
            'ban_foreslash_quanta', 'ban_backslash_quanta',
            'ban_rectilinear_quanta', 'ban_diagonal_quanta',
            'ban_45_angle', 'ban_90_angle', 'ban_135_angle', 'ban_180_angle',
            'ban_45_135_angle', 'ban_90_180_angle', 'at_least_2'],

        x: ['ban_foreslash_quanta', 'ban_backslash_quanta', 'ban_diagonal_quanta',
            'ban_90_angle', 'ban_180_angle', 'ban_90_180_angle',
            'at_least_2'],

        y: ['ban_descender', 'ban_bottombox', 'ban_bottomedge', 'ban_rightedge', 'ban_leftedge',
            'ban_vertedges', 'ban_vertboxes', 'ban_bottomright', 'ban_corners',
            'ban_horiz_quanta', 'ban_vert_quanta', 'ban_foreslash_quanta',
            'ban_backslash_quanta', 'ban_rectilinear_quanta',
            'ban_diagonal_quanta', 'ban_45_angle', 'ban_90_angle',
            'ban_135_angle', 'ban_180_angle', 'ban_45_135_angle',
            'ban_90_180_angle', 'at_least_2', 'at_most_2', 'at_most_3'],

        z: ['ban_horiz_quanta', 'ban_foreslash_quanta', 'ban_rectilinear_quanta',
            'ban_diagonal_quanta', 'ban_45_angle', 'ban_180_angle',
            'ban_45_135_angle', 'ban_90_180_angle', 'at_least_2']
    };
};

for (let attr in Wholes) { Object.freeze(Wholes[attr]); }
for (let cat in Wholes.CategoryNorms) { Object.freeze(Wholes.CategoryNorms[cat]); }
Object.freeze(Wholes);
