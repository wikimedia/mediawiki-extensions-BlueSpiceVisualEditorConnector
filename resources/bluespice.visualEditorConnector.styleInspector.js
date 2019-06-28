mw.hook( 've.activationComplete' ).add( function () {
	var target, surface, surfaceModel, earlySelection, selection, selectedNode, position = {}, popup;

	target = ve.init.target;
	surface = target.getSurface();
	if ( surface.getMode() !== 'visual' ) {
		// Don't support source mode
		return;
	}
	surfaceModel = surface.getModel();

	surfaceModel.on( 'select', function( s ) {
		if ( !( s instanceof ve.dm.LinearSelection ) ) {
			return;
		}
		selection = s;
		selectedNode = surfaceModel.getSelectedNode();
	} );

	target.getToolbar().on ( 'updateState', function() {
		_removePopup();
	} );

	$( document ).on( 'mousedown', function( e ) {
		earlySelection = null;
		if ( e.which !== 1 ) {
			return;
		}

		if ( _shouldRemovePopup( e ) ) {
			_removePopup();
		}

		earlySelection = selection;
		position = {
			start: {
				x: e.pageX,
				y: e.pageY
			}
		};
	} );

	$( document ).on( 'mouseup', function( e ) {
		var range;
		if ( e.which !== 1 ) {
			return;
		}
		if( !selection ) {
			return;
		}
		if ( earlySelection && earlySelection.getRange() === selection.getRange() ) {
			return;
		}
		if ( selectedNode !== null && selectedNode.type !== 'text' ) {
			// We only show this inspector when plain text is selected,
			// as soon as there is a node selected, its not plain text
			return;
		}
		position.end = {
 			x: e.pageX,
			y: e.pageY
		};
		range = selection.getRange();
		if ( range.start === range.end ) {
			// Empty selection - but maybe we could still show the inspector
			return;
		}
		_inspect( range );
	} );

	$( window ).on( 'resize', function() {
		// Traditionally, popup must be attached to the element it appears next to.
		// Since, with selection, we don't have that element, we attach to the body
		// and position it to appear underneath the selection. This position becomes
		// obsolete once the window is resized, so hide the popup and make use select again
		if ( popup ) {
			_removePopup();
		}
	} );

	function _shouldRemovePopup( e ) {
		if ( !popup ) {
			return false;
		}
		var $target = $( e.target );
		if ( $target.hasClass( 'bs-vec-styleInspector' ) ) {
			return false;
		}
		if ( $target.parents( '.bs-vec-styleInspector' ).length !== 0 ) {
			return false;
		}
		return true;
	}

	function _removePopup() {
		if ( !popup ) {
			return;
		}
		popup.toggle( false );
	}

	function _inspect( range ) {
		if ( popup ) {
			_removePopup();
		}

		popup = new bs.vec.ui.TextStylePopup( {
			position: position,
			surface: surface,
			fragment: surfaceModel.getLinearFragment( range, true )
		} );

		$( document.body ).append( popup.$element );
		popup.toggle( true );
		window.vecBSTextStylePopup = popup;
	}
} );
