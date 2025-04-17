bs.util.registerNamespace( 'bs.vec.dm' );

bs.vec.dm.InternalFileLinkAnnotation = function () {
	// Parent constructor
	bs.vec.dm.InternalFileLinkAnnotation.super.apply( this, arguments );
};

/* Inheritance */

OO.inheritClass( bs.vec.dm.InternalFileLinkAnnotation, ve.dm.MWInternalLinkAnnotation );

/* Static Properties */

bs.vec.dm.InternalFileLinkAnnotation.static.name = 'link/internalFile';

bs.vec.dm.InternalFileLinkAnnotation.static.matchTagNames = [ 'a' ];
bs.vec.dm.InternalFileLinkAnnotation.static.matchFunction = function ( domElement ) {
	const title = domElement.getAttribute( 'title' );
	let titleObject;
	const namespaceIds = mw.config.get( 'wgNamespaceIds' );
	if ( !title ) {
		return false;
	}
	titleObject = mw.Title.newFromText( title );
	if ( !titleObject ) {
		// media links may have their file names url decoded
		titleObject = mw.Title.newFromText( decodeURIComponent( title ) );
	}
	if ( !titleObject ) {
		// broken title. may have invalid chars etc.
		return false;
	}
	if ( titleObject.getNamespaceId() !== namespaceIds.file ) {
		return false;
	}
	return true;
};

bs.vec.dm.InternalFileLinkAnnotation.static.toDataElement = function ( domElements, converter ) {
	const targetData = this.getTargetDataFromHref(
		domElements[ 0 ].getAttribute( 'href' ),
		converter.getTargetHtmlDocument()
	);

	return {
		type: this.name,
		attributes: {
			title: targetData.title,
			normalizedTitle: this.normalizeTitle( targetData.title ),
			lookupTitle: this.getLookupTitle( targetData.title )
		}
	};
};

/**
 * Build a ve.dm.MWInternalLinkAnnotation from a given mw.Title.
 *
 * @param {Array} imageInfo The title to link to.
 * @param {string} [rawTitle] String from which the title was created
 * @return {ve.dm.MWInternalLinkAnnotation} The annotation.
 */
bs.vec.dm.InternalFileLinkAnnotation.static.newFromImageInfo = function ( imageInfo, rawTitle ) {
	const title = imageInfo.title || imageInfo.canonicaltitle;
	const titleObject = mw.Title.newFromText( title );
	let target = titleObject.toText();

	if ( titleObject.getNamespaceId() !== bs.ns.NS_FILE ) {
		return null;
	}

	target = ':' + target;
	const element = {
		type: 'link/internalFile',
		attributes: {
			title: target,
			normalizedTitle: ve.dm.MWInternalLinkAnnotation.static.normalizeTitle( titleObject ),
			imageInfo: imageInfo
		}
	};
	if ( rawTitle ) {
		element.attributes.origTitle = rawTitle;
	}

	return new bs.vec.dm.InternalFileLinkAnnotation( element );
};

bs.vec.dm.InternalFileLinkAnnotation.static.newFromTitle = function ( title, rawTitle ) {
	let target = title.toText();

	if ( title.getNamespaceId() !== bs.ns.NS_FILE ) {
		return null;
	}

	target = ':' + target;

	const element = {
		type: 'link/internalFile',
		attributes: {
			title: target,
			normalizedTitle: ve.dm.MWInternalLinkAnnotation.static.normalizeTitle( title ),
			lookupTitle: ve.dm.MWInternalLinkAnnotation.static.getLookupTitle( title )
		}
	};
	if ( rawTitle ) {
		element.attributes.origTitle = rawTitle;
	}

	return new bs.vec.dm.InternalFileLinkAnnotation( element );
};

/* Registration */

ve.dm.modelRegistry.register( bs.vec.dm.InternalFileLinkAnnotation );
