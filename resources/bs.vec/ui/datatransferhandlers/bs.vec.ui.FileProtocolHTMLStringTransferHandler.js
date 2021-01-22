/*!
 * BlueSpiceVisualEditorConnector UserInterface FileProtocolHTMLStringTransferHandler class.
 *
 * Heavily inspired by VisualEditor UserInterface UrlStringTransferHandler class.
 *
 * @copyright 2020 Hallo Welt! GmbH
 */
/**
 * Handle pastes of text containing "file:/".
 *
 * @class
 * @extends bs.vec.ui.FileProtocolHTMLStringTransferHandler
 *
 * @constructor
 * @param {ve.ui.Surface} surface
 * @param {ve.ui.DataTransferItem} item
 */
bs.vec.ui.FileProtocolHTMLStringTransferHandler = function BsVecUiFileProtocolHTMLStringTransferHandler() {
	// Parent constructor
	bs.vec.ui.FileProtocolHTMLStringTransferHandler.super.apply( this, arguments );
};

/* Inheritance */

OO.inheritClass( bs.vec.ui.FileProtocolHTMLStringTransferHandler, ve.ui.HTMLStringTransferHandler );

/* Static properties */
bs.vec.ui.FileProtocolHTMLStringTransferHandler.static.name = 'fileProtocol';

bs.vec.ui.FileProtocolHTMLStringTransferHandler.static.types = ['text/plain', 'text/html', 'application/xhtml+xml'];

bs.vec.ui.FileProtocolHTMLStringTransferHandler.static.handlesPaste = true;

/**
 * RegExp matching input containing "file:/" or "File:/".
 * @property {RegExp}
 * @private
 */
bs.vec.ui.FileProtocolHTMLStringTransferHandler.static.urlRegExp = /^file:\//i; // Initialized below

/**
 * Checks input item with urlRegExp expression
 *
 * @param {ve.ui.DataTransferItem} item
 * @return bool Whether item matches against urlRegExp
 */
bs.vec.ui.FileProtocolHTMLStringTransferHandler.static.matchFunction = function ( item ) {
	if ( bs.vec.ui.FileProtocolHTMLStringTransferHandler.static.types.indexOf( item.type ) >= 0 ) {
		return bs.vec.ui.FileProtocolHTMLStringTransferHandler.static.urlRegExp.test(
			item.getAsString()
		);
	}
};

/**
 * @inheritdoc
 */
bs.vec.ui.FileProtocolHTMLStringTransferHandler.prototype.process = function () {
	var newLinkAnnotation = new ve.dm.MWExternalLinkAnnotation( {
		type: 'link/mwExternal',
		attributes: { href: this.item.getAsString().trim() }
	} );

	var store = this.surface.getModel().getDocument().getStore();
	var result = [];
	var content = [this.item.getAsString().trim()];
	var annotationSet = new ve.dm.AnnotationSet( store, store.hashAll( [
		newLinkAnnotation
	] ) );
	ve.dm.Document.static.addAnnotationsToData( content, annotationSet );
	for ( i = 0; i < content.length; i++ ) {
		result.push( content[ i ] );
	}
	this.resolve( result );
};
/* Registration */
ve.ui.dataTransferHandlerFactory.register( bs.vec.ui.FileProtocolHTMLStringTransferHandler );
