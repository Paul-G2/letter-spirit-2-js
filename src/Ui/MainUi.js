/**
 * @classdesc
 * This is the top level container for the LetterSpirit UI elements.
 */
Ui.MainUi = class
{
    /**
     * @constructor
     * 
     * @param {App} app - The LetterSpirit2 app instance.
     */
    constructor(app) 
    { 
        this.app = app;
        this.animFunc = () => this._animationLoop();
        this.animating = false;
        this.lastRenderTime = 0;
        this.lastDisplayedModule = null;
        this.fps = 20;       

        // Create the common UI elements
        this.topBarUi        = new Ui.TopbarUi(this, document.getElementById('topbar_area'));
        this.inputUi         = new Ui.InputUi(this, document.getElementById('input_area'));
        this.codeletBannerUi = new Ui.CodeletBannerUi(this, document.getElementById('codeletbanner_area'));
        this.coderackUi      = new Ui.CoderackUi(this, document.getElementById('coderack_area'));

        // Create the workspace-specific UI elements
        this.workspaceUis = {
            Examiner:    new Ui.ExaminerWorkspaceUi(this, document.getElementById('workspace_area')),
            Adjudicator: new Ui.AdjudicatorWorkspaceUi(this, document.getElementById('workspace_area')),
            Drafter:     new Ui.DrafterWorkspaceUi(this, document.getElementById('workspace_area'))
        };
    }


    /**
     * Re-renders all the UI elements.
     * @private
     * 
     */
    redraw()
    {
        try
        {
            // Draw common elements
            [this.topBarUi, this.inputUi, this.codeletBannerUi, this.coderackUi].forEach( ui => ui.redraw() );
            
            // Draw the active workspace
            const app = this.app;
            const moduleToDisplay = (app.stage == 'drafting') ? app.drafter : app.activeModule;
            const displayModuleToggled = (moduleToDisplay != this.lastDisplayedModule);
            if (displayModuleToggled) {
                [app.examiner, app.adjudicator, app.drafter].forEach(module => this.workspaceUis[module.name].setShown(module == moduleToDisplay)); 
                this.lastDisplayedModule = moduleToDisplay;         
            }
            this.workspaceUis[moduleToDisplay.name].redraw(displayModuleToggled);
        }
        catch(e) 
        { 
            this.app.reporter.error(e.stack);
            alert("Oops, an error occurred in MainUi.redraw().\n\nPlease try reloading the page.");
        }
    }


    /**
     * Starts the main animation loop.
     */
    startAnimationLoop()
    {
        if (!this.animating) { 
            this.animating = true; 
            window.requestAnimationFrame(this.animFunc);
        }
    }


    /**
     * Animation-loop worker.
     * @private
     */
    _animationLoop()
    {
        const now = performance.now();
        if (now - this.lastRenderTime > 1000/this.fps) { 
            this.lastRenderTime = now;
            this.redraw();
        }
        window.requestAnimationFrame(this.animFunc);
    }

};