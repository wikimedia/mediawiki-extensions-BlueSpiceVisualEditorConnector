bs.util.registerNamespace( 'bs.vec.ui' );

bs.vec.ui.ColorAnnotationCommand = function() {
	// Parent constructor
	bs.vec.ui.ColorAnnotationCommand.super.call(
		this, 'color'
	);
	this.warning = null;
	this.supportedSelections = ['linear'];
	this.action = 'content';
	this.method = 'insert';
	this.args = [ 'textStyle/color' ];
};

OO.inheritClass( bs.vec.ui.ColorAnnotationCommand, ve.ui.Command );


/**
 * @inheritdoc
 */
bs.vec.ui.ColorAnnotationCommand.prototype.execute = function () {
	var popup = window.hasOwnProperty( 'vecBSTextStylePopup' ) ? vecBSTextStylePopup() : null;
	if ( popup ) {
		var colorTool = popup.getTool( 'textStyle/color' );
		colorTool.togglePicker( true );
	}
};

bs.vec.ui.ColorAnnotationCommand.prototype.isExecutable = function ( fragment ) {
	// Parent method
	var ranges = fragment.getSelection().getRanges( ve.init.target.getSurface().getModel().getDocument() );
	var hasActualSelection = false;
	for( var i = 0; i < ranges.length; i++ ) {
		var range = ranges[i];
		if ( range.from !== range.to ) {
			hasActualSelection = true;
			break;
		}
	}

	if ( ve.init.target.getSurface() === null ) {
		return false;
	}
	return ve.init.target.getSurface().getMode() === 'visual' &&
		bs.vec.ui.ColorAnnotationCommand.super.prototype.isExecutable.apply( this, arguments ) &&
		hasActualSelection;
};


/* Registration */

ve.ui.commandRegistry.register( new bs.vec.ui.ColorAnnotationCommand() );
