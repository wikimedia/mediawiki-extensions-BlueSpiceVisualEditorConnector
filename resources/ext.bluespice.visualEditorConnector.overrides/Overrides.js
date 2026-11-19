mw.loader.using( 'ext.visualEditor.desktopArticleTarget.init' )
	.done( () => {
		mw.libs.ve.targetLoader.addPlugin( () => {
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
			const dfd = $.Deferred();
			// Step 1: Load the override classes
			mw.loader.using( 'ext.bluespice.visualEditorConnector.overrides.classes' )
				.done( () => {
					mw.loader.using( 'ext.visualEditor.mwcore' ).done( () => {
						ve.ui.windowFactory.register( bs.vec.ui.MWMediaDialog );
						ve.ui.windowFactory.register( bs.vec.ui.MWSaveDialog );
						ve.ui.windowFactory.register( bs.vec.ui.MWTableDialog );
						ve.ui.windowFactory.register( bs.vec.ui.MWMetaDialog );

						// Keep the context popup's anchor attached to its dialog box.
						if (
							ve.ui.DesktopContext &&
							!ve.ui.DesktopContext.prototype.bsAnchorClampPatched
						) {
							ve.ui.DesktopContext.prototype.bsAnchorClampPatched = true;
							const origSetPopupSizeAndPosition =
								ve.ui.DesktopContext.prototype.setPopupSizeAndPosition;
							ve.ui.DesktopContext.prototype.setPopupSizeAndPosition = function () {
								origSetPopupSizeAndPosition.apply( this, arguments );

								const popup = this.popup;
								if ( !popup || !popup.isVisible() || !popup.hasAnchor() ) {
									return;
								}
								const popupWidth = popup.$popup.outerWidth();
								const margin = Math.max( popup.$anchor[ 0 ].scrollWidth, 12 );

								[ 'left', 'right' ].forEach( ( side ) => {
									const value = parseFloat( popup.$anchor.css( side ) );
									if ( isNaN( value ) ) {
										return;
									}
									const clamped = Math.min(
										Math.max( value, margin ),
										popupWidth - margin
									);
									if ( clamped !== value ) {
										popup.$anchor.css( side, clamped );
									}
								} );
							};
						}

						// Step 2: Load all plugin modules that may want to register to
						// those classes
						const bsvecPluginModules = bs.vec.config.get( 'PluginModules' );
						if ( bsvecPluginModules.length === 0 ) {
							dfd.resolve();
						}
						mw.loader.using( bsvecPluginModules ).done( () => {
							// Step 3: There is no step three
							dfd.resolve();
						} );
					} );
				} );

			return dfd.promise();
		} );
	} );

mw.loader.using( [ 'ext.bluespice', 'ext.visualEditorPlus.componentPlugins' ] )
	.done( () => {
		const bs = blueSpice;
		const plus = ext.visualEditorPlus;

		// Moved to VisualEditorPlus; kept as aliases for existing plugin consumers.
		bs.util.registerNamespace( 'bs.vec' );
		bs.vec.registerComponentPlugin = plus.componentPlugins.register;
		bs.vec.getComponentPlugins = plus.componentPlugins.get;
		bs.vec.components = plus.components;
	} );
