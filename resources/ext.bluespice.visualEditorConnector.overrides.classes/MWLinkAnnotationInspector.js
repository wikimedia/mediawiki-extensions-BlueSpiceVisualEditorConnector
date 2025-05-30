bs.util.registerNamespace( 'bs.vec.ui' );

bs.vec.ui.MWLinkAnnotationInspector = function BsVecUiMWLinkAnnotationInspector( config ) {
	bs.vec.ui.MWLinkAnnotationInspector.super.call( this, ve.extendObject( { padded: false }, config ) );
};

OO.inheritClass( bs.vec.ui.MWLinkAnnotationInspector, ve.ui.MWLinkAnnotationInspector );

bs.vec.ui.MWLinkAnnotationInspector.prototype.initialize = function () {
	bs.vec.ui.MWLinkAnnotationInspector.super.prototype.initialize.call( this );
	this.runComponentPlugins();
};

bs.vec.ui.MWLinkAnnotationInspector.prototype.runComponentPlugins = function () {
	const pluginCallbacks = bs.vec.getComponentPlugins(
		bs.vec.components.LINK_ANNOTATION_INSPECTOR
	);

	for ( let i = 0; i < pluginCallbacks.length; i++ ) {
		const callback = pluginCallbacks[ i ];
		callback( this );
	}
};
