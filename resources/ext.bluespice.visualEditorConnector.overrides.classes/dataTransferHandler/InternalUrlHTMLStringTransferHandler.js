/*!
 * BlueSpiceVisualEditorConnector UserInterface InternalUrlHTMLStringTransferHandler class.
 *
 * Heavily inspired by VisualEditor UserInterface UrlStringTransferHandler class.
 *
 * @copyright 2019 Hallo Welt! GmbH
 */

/**
 * Handle pastes of html code containing links.
 *
 * @class
 * @extends bs.vec.ui.InternalUrlHTMLStringTransferHandler
 *
 * @constructor
 * @param {ve.ui.Surface} surface
 * @param {ve.ui.DataTransferItem} item
 */
bs.vec.ui.InternalUrlHTMLStringTransferHandler = function BsVecUiInternalUrlHTMLStringTransferHandler() {
	// Parent constructor
	bs.vec.ui.InternalUrlHTMLStringTransferHandler.super.apply( this, arguments );
};

/* Inheritance */

OO.inheritClass( bs.vec.ui.InternalUrlHTMLStringTransferHandler, ve.ui.HTMLStringTransferHandler );

/* Static properties */
bs.vec.ui.InternalUrlHTMLStringTransferHandler.static.name = 'htmlString';

bs.vec.ui.InternalUrlHTMLStringTransferHandler.static.types = ['text/html', 'application/xhtml+xml'];

bs.vec.ui.InternalUrlHTMLStringTransferHandler.static.handlesPaste = true;

/**
 * @inheritdoc
 */
bs.vec.ui.InternalUrlHTMLStringTransferHandler.prototype.process = function () {
	var text = this.item.getAsString().trim()
	var articlePath = mw.config.get( 'wgArticlePath' );
	// Check if articlePath contains `/index.php/$1`
	if ( articlePath.indexOf( '/index.php/$1' ) === -1 ) {
		// no, skip
		return;
	}
	// Replace `index.php/$1` with `index.php?title=$1` in text
	this.item.stringData = text.replaceAll( /index.php\/(.*)/g, 'index.php?title=$1' );
	bs.vec.ui.InternalUrlHTMLStringTransferHandler.super.prototype.process.call( this );
};

/* Registration */
ve.ui.dataTransferHandlerFactory.register( bs.vec.ui.InternalUrlHTMLStringTransferHandler );
