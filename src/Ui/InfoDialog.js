/**
 * @classdesc
 * This class implements a dialog for displaying informational messages in a pop-up.
 * 
 */
Ui.InfoDialog = class extends Ui.Dialog
{

    /**
     * @constructor
     * 
     * @param {HTMLElement} [parent=document.body] - The dialog's parent element.
     */
    constructor(parent) 
    {
        super(parent, 65, 80, '', false, '#d5bfa2', '#c09f72');
        this._buildUi();
    }


    /**
     * Builds the UI.
     * @private
     */
    _buildUi()
    {
        this.textDiv = Ui.Utils.CreateElement('div', 'text-div', this.userDiv, 
            {left:'3%', width:'94%', top:'7%', height:'86%', 
             fontSize:'min(2.5vw, 3vh)', fontFamily:this.fontFamily, display:'grid', alignItems:'center', justifyContent:'center'}
        );
        this.textDiv.innerHTML = '';
    }


    /**
     * Shows the dialog.
     */
    show(msgLines, width, height)
    {
        this.textDiv.innerHTML = msgLines.map(line => `<p style="text-align: center; margin: 0;">${line}</p>`).join('');
        Ui.Utils.StyleElement(this.mainDiv, {width:width.toString() + '%', height:height.toString() + '%',
            left:((100 - width)/2).toString() + '%', top:((100 - height)/2).toString() + '%'}, true);
        const titleBarHeight = (4*80/height);
        Ui.Utils.StyleElement(this.titleDiv, {height:titleBarHeight.toString() + '%'}, true);
        Ui.Utils.StyleElement(this.closeDiv, {height:titleBarHeight.toString() + '%'}, true);
        Ui.Utils.StyleElement(this.userDiv, {height:(100-titleBarHeight).toString() + '%'}, true);
        this.mainDiv.style.display = 'inline-block';  
    }

};





