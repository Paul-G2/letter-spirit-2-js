/**
 * @classdesc
 * This class provides several utility functions needed by the UI classes.
 *
 */


Ui.Utils = class {
    constructor() { }
};


/**
 * Creates an html element and appends it to the parent.
 */
Ui.Utils.CreateElement = function(type, id, parent, styles, props, omitDefaults=false) 
{
    const elem = document.createElement(type);
    elem.id = id;
    if (parent) { parent.append(elem); }

    if (styles) {
        for (let styName in styles) {
            if (Object.prototype.hasOwnProperty.call(styles, styName)) {
                let val = styles[styName];
                if (typeof val === 'number') { val = val.toString() + 'px'; }
                elem.style[styName] = val;
            }
        }
    }
    if (props) {
        for (let propName in props) {
            if (Object.prototype.hasOwnProperty.call(props, propName)) {
                elem[propName] = props[propName];
            }
        }        
    }

    // Set some default styles
    if (!omitDefaults) {
        if (!styles || !Object.prototype.hasOwnProperty.call(styles, 'position')) { elem.style.position = 'absolute'; }
        if (!styles || !Object.prototype.hasOwnProperty.call(styles, 'margin'))   { elem.style.margin = '0px'; }
        if (!styles || !Object.prototype.hasOwnProperty.call(styles, 'padding'))  { elem.style.padding = '0px'; }
    }
    
    return elem;
};


/**
 * Applies styling to an html element
 * @static
 */
Ui.Utils.StyleElement = function(elem, styles, omitDefaults=false) 
{
    for (let propName in styles) {
        if (Object.prototype.hasOwnProperty.call(styles, propName)) {
            let val = styles[propName];
            if (typeof val === 'number') { val = val.toString() + 'px'; }
            elem.style[propName] = val;
        }
    }

    // Set some default styles
    if (!omitDefaults) {
        if (!Object.prototype.hasOwnProperty.call(styles, 'position')) { elem.style.position = 'absolute'; }
        if (!Object.prototype.hasOwnProperty.call(styles, 'margin'))   { elem.style.margin = '0px'; }
        if (!Object.prototype.hasOwnProperty.call(styles, 'padding'))  { elem.style.padding = '0px'; }
    }

    return elem;
};


/**
 * Tries to determine whether we're on a touch device.
 * @static
 */
Ui.Utils.isTouchDevice = function()
{
    // This test is fallible, but it seems to be the best we can do.
    return ( ('ontouchstart' in document.documentElement) || window.navigator.msMaxTouchPoints );
};


/**
 * Gets the coordinates of a given event.
 * @static
 * @param {Event} e - Event info.
 */
Ui.Utils.GetEventCoordinates = function(e)
{
	let [cx, cy] = [e.clientX, e.clientY];

	if ( (typeof(cx) == 'undefined') || (typeof(cy) == 'undefined') || (cx === null) || (cy === null)) {
		var evt = (e.targetTouches && e.targetTouches.length) ? e : e.originalEvent;
		if (evt && evt.targetTouches && evt.targetTouches.length) {
			[cx, cy] = [evt.targetTouches[0].clientX, evt.targetTouches[0].clientY]; 
		}
	}

	if ( (typeof(cx) == 'undefined') || (typeof(cy) == 'undefined') ) {
		cx = cy = null;
	}

    const dpr = window.devicePixelRatio;
	return [cx*dpr, cy*dpr];
};


/**
 * Gets the coordinates of a given event, relative to the upper-left corner of a given element.
 * @static
 * @param {Event} e - Event info.
 */
Ui.Utils.GetRelativeEventCoordinates = function(e)
{
	const coords = Ui.Utils.GetEventCoordinates(e);
	if ( (coords[0] === null) || (coords[1] === null) ) {
		return undefined;
	}

    const dpr = window.devicePixelRatio;
    const elemRect = e.target.getBoundingClientRect();
    return [coords[0] - dpr*elemRect.left, coords[1] - dpr*elemRect.top];
};



/**
 * Returns the squared distance from a point to a line segment.
 * @static
 */
Ui.Utils.SquaredDistanceToLineSegment = function(pt, lineStart, lineEnd) 
{ 
    var line = [lineEnd[0] - lineStart[0], lineEnd[1] - lineStart[1]];

    var lineLengthSq = (line[0])**2 + (line[1])**2;
    if (lineLengthSq < 1e-16) {
        return (pt[0] - lineStart[0])**2 + (pt[1] - lineStart[1])**2;
    }
    
    var t = ((pt[0] - lineStart[0])*line[0] + (pt[1] - lineStart[1])*line[1]) / lineLengthSq;
    t = Math.max(0, Math.min(1, t));

    var projPt = [lineStart[0] + t*line[0], lineStart[1] + t*line[1]];
    var distSq = (pt[0] - projPt[0])**2 + (pt[1] - projPt[1])**2;

    return distSq;
};


/** 
 * Resizes a given canvas's raster to match its display size.
 */
Ui.Utils.RightsizeCanvas = function(canv)
{
    const clientWidth = Math.round(canv.clientWidth);
    const clientHeight = Math.round(canv.clientHeight);
    if ( (clientWidth < 1) || (clientHeight < 1) ) { return false; }

    const dpr = window.devicePixelRatio;
    const reqCanvasWidth = Math.round(dpr * clientWidth);
    const reqCanvasHeight = Math.round(dpr * clientHeight);

    if ( (canv.width != reqCanvasWidth) || (canv.height != reqCanvasHeight) ) { 
            canv.width = reqCanvasWidth;  
            canv.height = reqCanvasHeight;
            //canv.getContext('2d').scale(dpr, dpr); // Not needed if we specify drawing coords as percentages of the canvas size
            canv.setAttribute('width', reqCanvasWidth.toString() + 'px'); 
            canv.setAttribute('height', reqCanvasHeight.toString() + 'px'); 
    } 
    return true;
};  


/** 
 * Checks whether the canvas size has changed.
 */
Ui.Utils.NeedToRescale = function(drawParams, context)
{
    const dp = drawParams;

    if (!dp || !dp.canvasWidth || !dp.canvasHeight) {
        return true; 
    }
    else {
        return (context.canvas.width != dp.canvasWidth) || 
            (context.canvas.height != dp.canvasHeight);
    }
};  


/**
 * Draws a line on a canvas.
 */
Ui.Utils.DrawLine = function(ctx, xa, ya, xb, yb)
{
    ctx.beginPath();
    ctx.moveTo(xa, ya);
    ctx.lineTo(xb, yb);
    ctx.stroke();
};


/**
 * Draws a sequence of lines on a canvas.
 */
Ui.Utils.DrawLines = function(ctx, pts)
{
    if (!pts || (pts.length < 2)) { return; }
    
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i=1; i<pts.length; i++) {
        ctx.lineTo(pts[i].x, pts[i].y);
    }
    ctx.stroke();
};


/**
 * Lightens or darkens a color by a given amount.
 */
Ui.Utils.ChangeColor = function(color, amount) 
{ 
    const clamp = (val) => Math.min(Math.max(val, 0), 0xff);
    const fill = (str) => ('00' + str).slice(-2);

    const num = parseInt(color.substr(1), 16);
    const red = clamp((num >> 16) + amount);
    const green = clamp(((num >> 8) & 0x00FF) + amount);
    const blue = clamp((num & 0x0000FF) + amount);
    return '#' + fill(red.toString(16)) + fill(green.toString(16)) + fill(blue.toString(16));
};
