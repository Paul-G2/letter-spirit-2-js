/**
 * @classdesc
 * This class encapsulates a set of LetterGrids laid out in a 2D array.
 * 
 */
Ui.OutputLetterArray = class {

    /**
     * @constructor
     * 
     * @param {DrafterWorkspaceUi} parentUi - The parent Ui.
     * @param {HTMLElement} site - The html div that will host this ui element.
     * @param {Number[]} rowLengths - The number of LetterGrids in each row.
     */
    constructor(parentUi, site, rowLengths) 
    { 
        this.parentUi = parentUi;

        // Check input
        if (rowLengths.reduce((a,b) => a+b, 0) != 26) {
            throw new Error('OutputLetterArray: rowLengths must sum to 26');
        }

        this.site = site;
        this.grids = {};
        this.bgColors = ['#cd853f', '#ffdead', '#fff8dc', '#f6f6f6', '#f6f6f6'];  

        const maxRowlength = Math.max(...rowLengths);
        const [lgw, lgh] = [100/maxRowlength, 100/rowLengths.length]; // LetterGrid width & height, in %
        let charIdx = 0;
        for (let r=0; r<rowLengths.length; r++) 
        {
            const top = r * lgh;
            const xStart = 50*(maxRowlength - rowLengths[r])/maxRowlength;
            for (let c=0; c<rowLengths[r]; c++) 
            {
                const lgDiv = Ui.Utils.CreateElement('div', 'lgdiv', this.site, {position:'absolute', margin:'0', 
                    padding:'0', top:top+'%', left:xStart+c*lgw+'%', width:lgw+'%', height:lgh+'%'});
                    
                const letter = String.fromCharCode('a'.charCodeAt(0) + charIdx);
                const borderCode = 'lb' + (r == 0 ? 't' : '') + (c == rowLengths[r] - 1 ? 'r' : '');
                this.grids[letter] = new Ui.OutputLetterGrid(this, lgDiv, letter, {borderCode:borderCode, bkgndColor:'#ffdead'});
                charIdx++;
            }
        }
    }


    /**
     * Redraws all the LetterGrids.
     */
    redraw()
    {
        const drafter = this.parentUi.parentUi.app.drafter;
        const activeLetter = drafter.theWholeName?.at(0) || null;

        Object.values(drafter.scratchSpace).forEach(ssEntry => {
            const grid = this.grids[ssEntry.cat];
            grid.activeBorder = (ssEntry.cat == activeLetter);
            const avgScore = Utils.AverageR3(ssEntry.scores);
            grid.setOnQuanta(ssEntry.qidList);
            grid.setTentativeQuanta([]);
            grid.bkgndColor = !ssEntry.qidList.length ? this.bgColors[4] : ssEntry.isSeed ? this.bgColors[0] : 
                (avgScore < 0.0001) ? this.bgColors[1] : (avgScore <= 200) ? this.bgColors[2] : this.bgColors[3];
            grid.redraw();
        });

        // Draw the active grid differently, to show drawing progress
        const activeGrid = this.grids[drafter.theWholeName[0]];
        if (activeGrid) {
            activeGrid.setOnQuanta(drafter.otherStuff);
            activeGrid.setTentativeQuanta(drafter.ownStuff.filter(q => !drafter.otherStuff.includes(q)));
            activeGrid.bkgndColor = this.bgColors[3];
            activeGrid.redraw();
        }
    }


};
