if ( ve.ui.MWWikitextLinkAnnotationInspector ) {
	bs.util.registerNamespace( 'bs.vec.ui' );

	bs.vec.ui.MWWikitextLinkAnnotationInspector = function BsVecUiMWWikitextLinkAnnotationInspector( config ) {
		this.pluginMethods = {};
		bs.vec.ui.MWWikitextLinkAnnotationInspector.super.call( this, ve.extendObject( { padded: false }, config ) );
	};

	OO.inheritClass( bs.vec.ui.MWWikitextLinkAnnotationInspector, ve.ui.MWWikitextLinkAnnotationInspector );

	bs.vec.ui.MWWikitextLinkAnnotationInspector.prototype.initialize = function () {
		bs.vec.ui.MWWikitextLinkAnnotationInspector.super.prototype.initialize.call( this );
		this.runComponentPlugins();
	};

	bs.vec.ui.MWWikitextLinkAnnotationInspector.prototype.runComponentPlugins = function () {
		const pluginCallbacks = bs.vec.getComponentPlugins(
			bs.vec.components.LINK_ANNOTATION_INSPECTOR
		);

		for ( let i = 0; i < pluginCallbacks.length; i++ ) {
			const callback = pluginCallbacks[ i ];
			const pluginMethods = callback( this ) || {};
			for ( const method in pluginMethods ) {
				if ( !this.pluginMethods.hasOwnProperty( method ) ) {
					this.pluginMethods[ method ] = [];
				}
				this.pluginMethods[ method ].push( pluginMethods[ method ] );
			}
		}
	};

	bs.vec.ui.MWWikitextLinkAnnotationInspector.prototype.updateActions = function () {
		const pluginMethods = this.pluginMethods.updateActions || [];
		for ( let i = 0; i < pluginMethods.length; i++ ) {
			if ( pluginMethods[ i ].call( this ) === false ) {
				return;
			}
		}
		bs.vec.ui.MWWikitextLinkAnnotationInspector.super.prototype.updateActions.call( this );
	};

	bs.vec.ui.MWWikitextLinkAnnotationInspector.prototype.getInsertionText = function () {
		const pluginMethods = this.pluginMethods.getInsertionText || [];
		for ( let i = 0; i < pluginMethods.length; i++ ) {
			const res = pluginMethods[ i ].call( this );
			if ( res !== null ) {
				return res;
			}
		}
		return bs.vec.ui.MWWikitextLinkAnnotationInspector.super.prototype.getInsertionText.call( this );
	};
}
