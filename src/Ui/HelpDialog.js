/**
 * @classdesc
 * This class implements a dialog for displaying help info.
 * 
 */
Ui.HelpDialog = class extends Ui.Dialog
{

    /**
     * @constructor
     * 
     * @param {HTMLElement} [parent=document.body] - The dialog's parent element.
     */
    constructor(parent) 
    {
        super(parent, 50, 76, 'Letter Spirit II Help', false, '#d5bfa2', '#c09f72');
        this._buildUi();
    }


    /**
     * Builds the UI.
     * @private
     */
    _buildUi()
    {
        Ui.Utils.StyleElement(this.userDiv, {overflowX:'auto', overflowY:'scroll'});

        this.textDiv = Ui.Utils.CreateElement('div', 'text-div',
            this.userDiv, {left:'3%', width:'94%', height:'100%', fontSize:'20px', fontFamily:this.fontFamily}
        );

        this.textDiv.innerHTML =
        '<p></p>' + 
        '<p>This app implements a computer model of human high-level perception and creativity, in the realm of letter-design. ' + 
        'The model was invented by John Rehling, Gary McGraw, and Douglas Hofstadter, and is detailed in ' + 
        '<a href="https://github.com/Alex-Linhares/FARGonautica/blob/master/Literature/Ph.D.%20Theses/Rehling-2001-Letter.Spirit.part.Two.pdf" target="_blank" rel="noopener noreferrer">Rehling\'s PhD thesis</a> ' +
        'and in Chapter 10 of <a href="https://en.wikipedia.org/wiki/Fluid_Concepts_and_Creative_Analogies" target="_blank" rel="noopener noreferrer">this book</a>.</p>' +
        
        '<p>To try it out, enter a few letters (that ideally share a common style) in the green input grids, either by pressing one of the <i>Sample</i> buttons or by clicking ' + 
        'on the grid segments. Then hit the <i>play</i> button.</p>' +

        '<p>The app begins by examining the input letters, trying to identify them and decompose them into parts. Along the way, it builds up a representation of their common style. ' + 
        'It then enters the drafting phase, where it tries to draw the remaining letters in the perceived style. ' + 
        'After each letter is drafted, the app examines it and decides whether to keep or reject it. </p>' +

        '<p>Pro tip: For repeatable results, append a seed for the random number generator to the app\'s URL (e.g. <code> ../index.html?seed=42</code>). ' + 
        'Otherwise, the results will be different each time.</p>' +

        '<p>The pink coderack area on the right displays the subroutines or <i>codelets</i> that Letter Spirit employs to perform its work. ' + 
        'The probability of running each codelet type is shown in a dynamical bar graph. The last-run codelet is indicated by a black triangle.</p>' +

        'The central work-area displays the contents of some of Letter Spirit\'s important memory structures. ' + 
        'Check out the references cited above for a detailed description of these objects. ' + 
        '(You can also have a look at <a href="https://github.com/Paul-G2/letter-spirit-examiner-js" target="_blank" rel="noopener noreferrer">this demo</a>, ' + 
        'which models just the examiner phase of Letter Spirit.) </p>' +

        '<p><a href="https://github.com/Paul-G2/letter-spirit-2-js" target="_blank" rel="noopener noreferrer">The code for this app</a> ' + 
        'is entirely based on the Scheme code of John Rehling, linked ' + 
        '<a href="https://github.com/Alex-Linhares/FARGonautica/tree/master#project-letter-spirit" target="_blank" rel="noopener noreferrer">here</a>.</p>' +
        
        '</p>&nbsp;</p>';
    }

};





