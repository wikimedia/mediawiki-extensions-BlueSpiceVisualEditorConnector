bs.util.registerNamespace( 'bs.vec.ui.widget' );

bs.vec.ui.widget.ColorCommandWidget = function( contextItem ) {
	bs.vec.ui.widget.ColorCommandWidget.parent.call( this, contextItem );

	this.icon = this.icon || 'highlight';

	this.colorWidget = new OOJSPlus.widget.ColorPickerWidget( {
		value: this.value,
		framed: false,
		icon: this.icon,
		popup: {
			position: 'above'
		}
	} );

	this.colorWidget.connect( this, {
		colorSelected: 'onColorSelected',
		togglePicker: 'onPickerToggle',
		clear: function() {
			this.onColorSelected( [] );
		}
	} );

	this.$element.append( this.colorWidget.$element );
	this.$element.addClass( 'bs-vec-color-widget' );
};

OO.inheritClass( bs.vec.ui.widget.ColorCommandWidget, bs.vec.ui.widget.CommandWidget );

bs.vec.ui.widget.ColorCommandWidget.prototype.onColorSelected = function( val ) {
	val = val.length > 0 ? val[0] : {};
	this.contextItem.execCommand( this.command, { value: val } );

};

bs.vec.ui.widget.ColorCommandWidget.prototype.onPickerToggle = function( visible ) {
	var $mainPopup = this.$element.parents( '.oo-ui-popupWidget-popup' );
	if ( visible ) {
		$mainPopup.css( 'overflow', 'visible' );
	} else {
		$mainPopup.css( 'overflow', 'hidden' );
	}
};
