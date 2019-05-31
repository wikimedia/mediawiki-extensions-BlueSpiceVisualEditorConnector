bs.util.registerNamespace( 'bs.vec.ui.widget' );

bs.vec.ui.widget.CommandWidget = function( contextItem ) {
	this.contextItem = contextItem;

	bs.vec.ui.widget.CommandWidget.parent.call( this );
	this.$input.remove();

	this.$element.addClass( 'bs-vec-command-widget' );
};

OO.inheritClass( bs.vec.ui.widget.CommandWidget, OO.ui.InputWidget );

bs.vec.ui.widget.CommandWidget.static.tagName = 'div';
