
bs.util.registerNamespace( 'bs.vec.dm' );

bs.vec.dm.InternalMediaLinkAnnotation = function() {
	// Parent constructor
	bs.vec.dm.InternalMediaLinkAnnotation.super.apply( this, arguments );
};

/* Inheritance */

OO.inheritClass( bs.vec.dm.InternalMediaLinkAnnotation, ve.dm.MWInternalLinkAnnotation );

/* Static Properties */

bs.vec.dm.InternalMediaLinkAnnotation.static.name = 'link/internalMedia';
bs.vec.dm.InternalMediaLinkAnnotation.static.matchRdfaTypes = [ 'mw:MediaLink' ];

bs.vec.dm.InternalMediaLinkAnnotation.static.toDataElement = function ( domElements, converter ) {
	var targetData, data,
		resource = domElements[ 0 ].getAttribute( 'resource' );
	if ( resource ) {
		data = ve.parseParsoidResourceName( resource );

		targetData = {
			title: data.title,
			rawTitle: data.rawTitle,
			hrefPrefix: data.hrefPrefix
		};
	} else {
		targetData = this.getTargetDataFromHref(
			domElements[ 0 ].getAttribute( 'href' ),
			converter.getTargetHtmlDocument()
		);
	}

	return {
		type: this.name,
		attributes: {
			hrefPrefix: targetData.hrefPrefix,
			title: targetData.title,
			normalizedTitle: this.normalizeTitle( targetData.title ),
			lookupTitle: this.getLookupTitle( targetData.title ),
			origTitle: targetData.rawTitle
		}
	};
};

/* Registration */

ve.dm.modelRegistry.register( bs.vec.dm.InternalMediaLinkAnnotation );