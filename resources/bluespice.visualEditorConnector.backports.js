mw.libs.ve.addPlugin( function() {
	/**
	 * Unfortunately when `VisualeditorPluginModules`, that are registered at
	 * the serverside are loaded, the base classes like
	 * `ve.ui.MWLinkAnnotationInspector` are not available yet.
	 *
	 * Therefore we use this plugin registration method (which actually was
	 * meant for Gadgets). It allows us to return a `Promise` object and makes
	 * VE wait until it is being resolved. This way we can wait for all kinds of
	 * other modules!
	 */
	var dfd = $.Deferred();

	mw.loader.using( 'ext.bluespice.visualEditorConnector.backports.classes' )
		.done( function() {
			dfd.resolve();
	});

	return dfd.promise();
} );