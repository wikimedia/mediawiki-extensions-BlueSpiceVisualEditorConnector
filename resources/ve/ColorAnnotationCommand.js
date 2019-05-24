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
	let popup = window.vecBSTextStylePopup;
	if ( popup ) {
		let colorTool = popup.getTool( 'textStyle/color' );
		colorTool.togglePicker( true );
	}
};

bs.vec.ui.ColorAnnotationCommand.prototype.isExecutable = function ( fragment ) {
	// Parent method
	let ranges = fragment.getSelection().getRanges();
	let hasActualSelection = false;
	for( let i = 0; i < ranges.length; i++ ) {
		let range = ranges[i];
		if ( range.from !== range.to ) {
			hasActualSelection = true;
			break;
		}
	}
	return bs.vec.ui.ColorAnnotationCommand.super.prototype.isExecutable.apply( this, arguments )
		&& hasActualSelection;
};


/* Registration */

ve.ui.commandRegistry.register( new bs.vec.ui.ColorAnnotationCommand() );
