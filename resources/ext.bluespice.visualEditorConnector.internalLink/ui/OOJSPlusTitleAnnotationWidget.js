bs.util.registerNamespace( 'bs.vec.ui' );

bs.vec.ui.OOJSPlusTitleAnnotationWidget = function () {
	bs.vec.ui.OOJSPlusTitleAnnotationWidget.super.apply( this, arguments );
	this.addOtherTools();
};

OO.inheritClass( bs.vec.ui.OOJSPlusTitleAnnotationWidget, ve.ui.MWInternalLinkAnnotationWidget );

bs.vec.ui.OOJSPlusTitleAnnotationWidget.prototype.onTextChange = function ( value ) { // eslint-disable-line no-unused-vars
	if ( this.internalPicker.getTitleObject() ) {
		this.setAnnotation(
			this.constructor.static.getAnnotationFromText( this.internalPicker.getTitleObject(), true ), true
		);
	} else {
		this.setAnnotation( null, true );
	}
};

bs.vec.ui.OOJSPlusTitleAnnotationWidget.prototype.createInputWidget = function ( config ) { // eslint-disable-line no-unused-vars
	this.internalPicker = new OOJSPlus.ui.widget.TitleInputWidget( {
		$overlay: true,
		mustExist: false
	} );
	this.internalPicker.connect( this, {
		change: 'onTextChange',
		choose: 'onTextChange'
	} );
	return this.internalPicker;
};

bs.vec.ui.OOJSPlusTitleAnnotationWidget.prototype.addOtherTools = function () {
};

bs.vec.ui.OOJSPlusTitleAnnotationWidget.static.getAnnotationFromText = function ( title ) {
	if ( title ) {
		return ve.dm.MWInternalLinkAnnotation.static.newFromTitle( mw.Title.newFromText( title.prefixed ) );
	}
	return null;
};

bs.vec.ui.OOJSPlusTitleAnnotationWidget.prototype.getTextInputWidget = function () {
	if ( !this.internalPicker ) {
		return bs.vec.ui.OOJSPlusTitleAnnotationWidget.parent.prototype.getTextInputWidget.call( this );
	}
	return this.internalPicker;
};

bs.vec.ui.OOJSPlusTitleAnnotationWidget.prototype.setAnnotation = function ( annotation, fromText ) {
	bs.vec.ui.OOJSPlusTitleAnnotationWidget.parent.prototype.setAnnotation.call( this, annotation, fromText );
	if ( !this.annotation ) {
		return;
	}
	if ( !fromText ) {
		this.internalPicker.setValue( this.constructor.static.getTextFromAnnotation( this.annotation ) );
	}

	return this;
};

bs.vec.ui.OOJSPlusTitleAnnotationWidget.static.getTextFromAnnotation = function ( annotation ) {
	if ( !annotation ) {
		return '';
	}

	return annotation.element.attributes.lookupTitle;
};
