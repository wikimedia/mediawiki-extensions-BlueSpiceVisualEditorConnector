mw.hook( 've.activationComplete' ).add( function () {
	if ( !mw.config.get( 'bsVECSimpleSaveProcess' ) ) {
		// Not enabled
		return;
	}
	if( OO.ui.isMobile() || $( window ).width() < 500 ) {
		// Since there is no hover and no space in mobile
		// do not change the process
		return;
	}
	// Disable click action
	ve.init.target.toolbarSaveButton.off( 'click' );

	var isOpen = false;
	ve.init.target.toolbarSaveButton.$element.on( 'mouseenter', function( e ) {
		if ( isOpen ) {
			return;
		}
		// Get the save button
		var $button = $( e.target );
		ve.init.target.toolbarSaveButton.setDisabled( true );
		var offset = $button.offset();
		// At this point, it would be nice to hide the dialog once
		// the user navigates away from save button, even without ever
		// entering the dialog itself. This is problematic because as soon
		// as the dialog is visible it will steal the focus, focusing on the
		// overlay that cannot be removed

		// Initialize the save dialog
		ve.init.target.showSaveDialog();
		var dialog = ve.init.target.saveDialog;

		// Align the save dialog with the save button
		var $frame = dialog.$element.find( '.oo-ui-window-frame' );
		$frame.addClass( 'bs-vec-save-dialog' );
		$frame.css( 'top', 0 );
		$frame.css( 'left', 0 );
		$frame.css( 'margin', 0 );
		$frame.css( 'transition', 'none' );

		$frame.offset( {
			// By calculating diff between current button offset
			// and scroll offset we get it's relative position
			top: offset.top - window.scrollY + $button.outerHeight() + 10,
			left: offset.left - 500 + $button.outerWidth()
		} );
		$frame.css( 'position', 'absolute' );

		// Remove the white overlay
		$frame.parents( '.oo-ui-dialog' ).css( 'background-color', 'transparent' );

		// Re-enable the button when the dialog closes
		dialog.on ( 'close', function() {
			ve.init.target.toolbarSaveButton.setDisabled( false );
			isOpen = false;
		} );
		// Close dialog once the mouse leaves it
		$frame.on( 'mouseleave', function() {
			if ( !isOpen ) {
				return;
			}
			dialog.close();
		} );

		// Add a anchor pointer
		if ( $frame.find( '#bs-vec-save-dialog-anchor' ).length === 0 ) {
			$frame.prepend( $( '<div>' )
				.attr( 'id', 'bs-vec-save-dialog-anchor' )
				.css( {
					'margin-left': '400px',
					'margin-top': '-10px',
					height: 0,
					width: 0,
					'border-left': '10px solid transparent',
					'border-right': '10px solid transparent',
					'border-bottom': '10px solid rgb(162, 169, 177)'
				} ) );
		}

		isOpen = true;
	} );
});
