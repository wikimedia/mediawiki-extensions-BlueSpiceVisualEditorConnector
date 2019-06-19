bs.util.registerNamespace( 'bs.vec.ui' );

bs.vec.ui.ColorStyleTool = function( config ) {
	this.$currentColorShow = $( '<div>' ).addClass( 'bs-vec-text-color-current' );
	bs.vec.ui.ColorStyleTool.parent.call( this, config );
	this.$currentColorShow.insertBefore( this.$icon );
	this.colorPicker = null;
	this.value = '';

	this.disconnect( this, {
		click: 'annotate'
	} );
	this.connect( this, {
		click: 'togglePicker'
	} );

};

OO.inheritClass( bs.vec.ui.ColorStyleTool, bs.vec.ui.ButtonStyleTool );

bs.vec.ui.ColorStyleTool.prototype.getName = function() {
	return "textStyle/color";
};

bs.vec.ui.ColorStyleTool.prototype.getIcon = function() {
	return 'highlight';
};

bs.vec.ui.ColorStyleTool.prototype.getLabel = function() {
	return OO.ui.deferMsg( "bs-visualeditorconnector-text-style-tool-color-label" );
};

bs.vec.ui.ColorStyleTool.prototype.togglePicker = function( show ) {
	if ( !this.colorPicker ) {
		let pickerCfg = {
			value: this.value
		};
		let customColors = mw.config.get( 'bsVECColorPickerColors' );
		if ( customColors && customColors.length > 0 ) {
			pickerCfg.colors = customColors;
		}
		this.colorPicker = new OOJSPlus.widget.ColorPickerEmbeddable( pickerCfg );
		this.colorPicker.connect( this, {
			clear: 'onPickerClear',
			colorSelected: 'onPickerColorSelected'
		} );
		this.popup.$body.append( this.colorPicker.$element );
		this.colorPicker.$element.hide();
	}
	if ( show === true ) {
		return this.colorPicker.$element.show();
	} else if ( show === false ) {
		return this.colorPicker.$element.hide();
	}
	this.colorPicker.$element.slideToggle();
};

bs.vec.ui.ColorStyleTool.prototype.onPickerColorSelected = function( data ) {
	if ( data.hasOwnProperty( 'code' ) ) {
		this.$currentColorShow.css( 'color', data.code );
	}
	this.data = data;
	this.clearAnnotation();
	this.annotate();
	this.togglePicker();
};

bs.vec.ui.ColorStyleTool.prototype.onPickerClear = function() {
	this.$currentColorShow.css( 'color', 'black' );
	this.clearAnnotation();
	this.togglePicker();
};

bs.vec.ui.ColorStyleTool.prototype.togglePicker = function( visible ) {
	if ( !this.colorPicker ) {
		return;
	}
	this.colorPicker.togglePicker( visible );
};

bs.vec.ui.ColorStyleTool.prototype.getData = function() {
	return this.data;
};

bs.vec.ui.ColorStyleTool.prototype.changeActive = function() {
	if ( this.isActive() ) {
		let annotations = this.fragment.getAnnotations().getAnnotationsByName( this.getName() );
		let annotation = annotations.get()[0];
		if ( !annotation.element || !annotation.element.hasOwnProperty( 'attributes' ) ) {
			// Should be impossible, but just in case
			return;
		}
		let attr = annotation.element.attributes;
		this.value = attr;
		if ( this.colorPicker ) {
			this.colorPicker.setValue( attr );
		}
		if ( attr.hasOwnProperty( 'code' ) ) {
			this.$currentColorShow.css( 'color', attr.code );
		} else if ( attr.hasOwnProperty( 'class' ) ) {
			this.$currentColorShow.addClass( attr.class );
			this.$currentColorShow.removeAttr( 'style' );
		}
	} else {
		this.$currentColorShow.css( 'color', 'black' );
	}
};


bs.vec.ui.ColorStyleTool.prototype.getMethod = function() {
	return 'set';
};