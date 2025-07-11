bs.util.registerNamespace( 'bs.vec.ui.widget' );

bs.vec.ui.widget.CellBorderWidget = function ( contextItem ) {
	this.styles = contextItem.getStyles();

	bs.vec.ui.widget.CellBorderWidget.parent.call( this, contextItem );
	bs.vec.mixin.TableBorderStylePopup.call( this );
	this.connect( this, {
		change: function ( value ) {
			this.value = value;
			this.executeAction();
		}
	} );

	this.makeBorderPicker();
	this.$element.append( this.popup.$element );
	this.$element.append( this.borderPickerTrigger.$element );
	this.$element.addClass( 'bs-vec-border-widget' );
};

OO.inheritClass( bs.vec.ui.widget.CellBorderWidget, bs.vec.ui.widget.CommandWidget );
OO.mixinClass( bs.vec.ui.widget.CellBorderWidget, bs.vec.mixin.TableBorderStylePopup );

bs.vec.ui.widget.CellBorderWidget.prototype.makeBorderPicker = function () {
	this.borderPickerTrigger = new OO.ui.ButtonWidget( {
		icon: 'cellBorderAll',
		title: OO.ui.deferMsg( 'bs-vec-table-border-borders' ),
		framed: false
	} );
	this.borderPickerTrigger.connect( this, {
		click: 'togglePopup'
	} );
};

bs.vec.ui.widget.CellBorderWidget.prototype.executeAction = function () {
	if ( !this.shouldExecute() ) {
		return;
	}

	this.ensureSurfaceActivation();

	// Get value and set
	this.contextItem.execCommand( 'cellBorder', { value: this.value } );
};

bs.vec.ui.widget.CellBorderWidget.prototype.togglePopup = function () {
	this.popup.toggle();
	const $mainPopup = this.$element.parents( '.oo-ui-popupWidget-popup' );
	if ( this.popup.isVisible() ) {
		$mainPopup.css( 'overflow', 'visible' );
	} else {
		$mainPopup.css( 'overflow', 'hidden' );
	}
};

/**
 * Activates the VE surface by forcing a no-op transaction.
 *
 * Ensures that style commands (e.g., cell borders) are tracked as real changes,
 * allowing saving and persisting them when switching to source mode.
 */
bs.vec.ui.widget.CellBorderWidget.prototype.ensureSurfaceActivation = function () {
	if ( this.activated ) {
		return;
	}
	this.activated = true;

	const surfaceModel = this.contextItem.context.getSurface().getModel();
	const selection = surfaceModel.getSelection();

	if ( selection instanceof ve.dm.TableSelection ) {
		const doc = surfaceModel.getDocument();
		const range = selection.getOuterRanges( doc )[ 0 ];

		// Add dummy attribute
		surfaceModel.change(
			ve.dm.TransactionBuilder.static.newFromAttributeChanges(
				doc,
				range.start,
				{ 'data-bs-ve-temp': '1' }
			)
		);

		// Remove dummy attribute
		surfaceModel.change(
			ve.dm.TransactionBuilder.static.newFromAttributeChanges(
				doc,
				range.start,
				{ 'data-bs-ve-temp': null }
			)
		);
	}
};
