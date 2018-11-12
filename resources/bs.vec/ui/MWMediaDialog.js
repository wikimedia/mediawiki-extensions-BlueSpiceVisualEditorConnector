bs.util.registerNamespace( 'bs.vec.ui' );

bs.vec.ui.MWMediaDialog = function BsVecUiMWMediaDialog( config ) {
	bs.vec.ui.MWMediaDialog.super.call( this, config );
};

OO.inheritClass( bs.vec.ui.MWMediaDialog, ve.ui.MWMediaDialog );

bs.vec.ui.MWMediaDialog.prototype.initialize = function () {
	bs.vec.ui.MWMediaDialog.super.prototype.initialize.call( this );

	this.runComponentPlugins();
};

bs.vec.ui.MWMediaDialog.prototype.runComponentPlugins = function() {
	var pluginCallbacks = bs.vec.getComponentPlugins(
			bs.vec.components.MEDIA_DIALOG
	);

	for( var i = 0; i < pluginCallbacks.length; i++ ) {
		var callback = pluginCallbacks[i];
		callback( this );
	}
};