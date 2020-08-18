bs.util.registerNamespace( 'bs.vec.ui' );

bs.vec.ui.MWHelpPopupTool = function VeUiMWHelpPopupTool( config ) {
	bs.vec.ui.MWHelpPopupTool.super.call( this, config );

	this.helpButton.setHref( mw.config.get( 'bsgVisualEditorConnectorHelpUrl' ) );
	this.feedbackButton.$element.remove();
};

OO.inheritClass( bs.vec.ui.MWHelpPopupTool, ve.ui.MWHelpPopupTool );
