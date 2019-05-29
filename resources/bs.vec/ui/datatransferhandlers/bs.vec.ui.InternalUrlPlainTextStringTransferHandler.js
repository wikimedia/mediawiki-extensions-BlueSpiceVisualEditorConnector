/*!
 * BlueSpiceVisualEditorConnector UserInterface InternalUrlPlainTextStringTransferHandler class.
 *
 * Heavily inspired by VisualEditor UserInterface UrlStringTransferHandler class.
 *
 * @copyright 2019 Hallo Welt! GmbH
 */

/**
 * Handle pastes of plain text containing links.
 * Attempts to preserve link titles when possible.
 *
 * @class
 * @extends bs.vec.ui.InternalUrlPlainTextStringTransferHandler
 *
 * @constructor
 * @param {ve.ui.Surface} surface
 * @param {ve.ui.DataTransferItem} item
 */
bs.vec.ui.InternalUrlPlainTextStringTransferHandler = function BsVecUiInternalUrlPlainTextStringTransferHandler() {
	// Parent constructor
	bs.vec.ui.InternalUrlPlainTextStringTransferHandler.super.apply( this, arguments );
};

/* Inheritance */
OO.inheritClass( bs.vec.ui.InternalUrlPlainTextStringTransferHandler, ve.ui.PlainTextStringTransferHandler );

/* Static properties */
bs.vec.ui.InternalUrlPlainTextStringTransferHandler.static.name = 'internalString';

bs.vec.ui.InternalUrlPlainTextStringTransferHandler.static.handlesPaste = true;

/**
 * @param {string} text
 * @returns {unresolved}
 */
bs.vec.ui.InternalUrlPlainTextStringTransferHandler.urlify = function ( text ) {
	var urlRegex = new RegExp( ve.init.platform.getExternalLinkUrlProtocolsRegExp().source.slice( 1 )
		+ '(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])', 'gi' );

	return text.replace( urlRegex, function ( url ) {
		return ' _mark_ start_ ' + url + ' _mark_ end_ ';
	} );

};

/**
 * @inheritdoc
 * DANGER - Magic is happening here, modify at own risk
 * In the data a magic word ' _mark_ ' is used as separator to find links in pasted text.
 * This magic word is first replaced by another magic word, in case it is already used in the data
 */
bs.vec.ui.InternalUrlPlainTextStringTransferHandler.prototype.process = function () {
	var links, html, doc, result,
		surface = this.surface,
		store = surface.getModel().getDocument().getStore(),
		linkAction = ve.ui.actionFactory.create( 'link', surface ),
		data = this.item.getAsString() + ' ';
	data = " _mark_ " + data.split( " _mark_ " ).join( " _mark_ mark_ " );
	data = bs.vec.ui.InternalUrlPlainTextStringTransferHandler.urlify( data );
	let fields = data.split( ' _mark_ ' );

	result = [];
	let endflag = false; // to fix newline after annotated link
	result.push( {type: 'paragraph', internal: {generated: 'wrapper'}} );
	fields.forEach( function ( element ) {
		if ( element.startsWith( "start_ " ) ) {
			element = element.slice( 7 );
			let annotation = linkAction.getLinkAnnotation( element );
			let annotationSet = new ve.dm.AnnotationSet( store, store.hashAll( [
				annotation
			] ) );
			let title = annotation.getDisplayTitle();
			let content = title.split( '' );
			ve.dm.Document.static.addAnnotationsToData( content, annotationSet );
			for ( let i = 0; i < content.length; i++ ) {
				result.push( content[i] );
			}
		} else {
			if ( element.startsWith( "end_ " ) ) {
				endflag = true;
				element = element.slice( 5 );
			} else {
				endflag = false;
				if ( element.startsWith( "mark_ " ) ) {
					//this is the case when ' _mark_ ' was used in copied text
					element = ' _' + element;
				}
			}
			let content = element.split( '' );
			for ( let i = 0; i < content.length; i++ ) {
				if ( content[ i ] === "\n" ) {
					if ( endflag ) {
						result.push( ' ' );
					}
					result.push( {type: '/paragraph'} );
					result.push( {type: 'paragraph', internal: {generated: 'wrapper'}} );
				} else {
					result.push( content[ i ] );
				}
				endflag = false;
			}
		}
	} );
	result.push( {type: '/paragraph'} );
	this.resolve( result );
};

/* Registration */
ve.ui.dataTransferHandlerFactory.register( bs.vec.ui.InternalUrlPlainTextStringTransferHandler );
