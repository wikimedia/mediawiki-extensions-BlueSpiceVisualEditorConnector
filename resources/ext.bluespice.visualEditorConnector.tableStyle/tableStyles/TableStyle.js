bs.util.registerNamespace( 'bs.vec.ui' );
bs.util.registerNamespace( 'bs.vec.util' );

bs.vec.ui.TableStyle = function () {
	this.section = '';
	this.applyTo = '';
};

OO.initClass( bs.vec.ui.TableStyle );

bs.vec.ui.TableStyle.static.SECTION_ROW = 'row';
bs.vec.ui.TableStyle.static.SECTION_COLUMN = 'col';
bs.vec.ui.TableStyle.static.SECTION_CELL = 'cell';

bs.vec.ui.TableStyle.static.ELEMENT_CELL = 'cell';
bs.vec.ui.TableStyle.static.ELEMENT_ROW = 'row';

bs.vec.ui.TableStyle.static.UNIT_PIXEL = 'px';
bs.vec.ui.TableStyle.static.UNIT_PERCENT = '%';
bs.vec.ui.TableStyle.static.UNIT_NONE = '';

bs.vec.ui.TableStyle.static.TYPE_QUICK = 'quick';
bs.vec.ui.TableStyle.static.TYPE_ADDITIONAL = 'additional';
bs.vec.ui.TableStyle.static.TYPE_BOTH = 'both';

bs.vec.ui.TableStyle.prototype.decorate = function ( $element ) {
	if ( !this.getAttribute() ) {
		return;
	}
	if ( !this.value ) {
		return;
	}

	$element.css( this.getAttribute(), this.getValue() );
};

bs.vec.ui.TableStyle.prototype.getValue = function () {
	return this.value + this.getUnit();
};

bs.vec.ui.TableStyle.prototype.getSection = function () {
	return this.section || null;
};

bs.vec.ui.TableStyle.prototype.splitValue = function ( value ) {
	return value.replace( this.getUnit(), '' );
};

/**
 * Name of CSS attribute as it will be applied to the element
 */
bs.vec.ui.TableStyle.prototype.getAttribute = function () {
	// STUB
};

/**
 * Unit for style attribute value (px, %...)
 *
 * @return {string}
 */
bs.vec.ui.TableStyle.prototype.getUnit = function () {
	return '';
};

bs.vec.ui.TableStyle.prototype.setValue = function ( value ) {
	this.value = value;
};

/**
 * Does this style tool applies to current section
 *
 * @param {string} section
 * @return {boolean}
 */
bs.vec.ui.TableStyle.prototype.applies = function ( section ) {
	if ( section !== this.section ) {
		return false;
	}
	return true;
};

bs.vec.ui.TableStyle.prototype.getTool = function () {
	return {};
};

bs.vec.ui.TableStyle.prototype.getModelProperty = function () {
	// STUB
};

bs.vec.ui.TableStyle.prototype.toDataElement = function ( section, domElement, result ) {
	const externalStyle = {};
	const modelProperty = this.getModelProperty();

	if ( section !== this.applyTo ) {
		return;
	}
	const style = domElement.getAttribute( 'style' );

	if ( !style ) {
		return;
	}
	const applied = [];
	const styleParser = new bs.vec.util.StyleAttributeParser( style );
	if ( styleParser.getValueForAttr( this.getAttribute() ) ) {
		result[ modelProperty ] = this.splitValue(
			styleParser.getValueForAttr( this.getAttribute() )
		);
		applied.push( this.getAttribute() );
	}
	const parsed = styleParser.getParsed();
	for ( const key in parsed ) {
		if ( !parsed.hasOwnProperty( key ) ) {
			continue;
		}
		if ( applied.indexOf( key ) !== -1 ) {
			continue;
		}
		externalStyle[ key ] = parsed[ key ];
	}

	if ( Object.keys( externalStyle ).length > 0 ) {
		result.externalStyle = externalStyle;
	}
};

bs.vec.ui.TableStyle.prototype.toDomElements = function ( section, dataElement, domElement, attributes ) { // eslint-disable-line no-unused-vars
	if ( section !== this.applyTo ) {
		return;
	}

	if ( !dataElement.hasOwnProperty( 'attributes' ) ) {
		return;
	}
	if ( !dataElement.attributes.hasOwnProperty( this.getModelProperty() ) ) {
		return;
	}

	const value = dataElement.attributes[ this.getModelProperty() ];
	this.setValue( value );

	let style = domElement.getAttribute( 'style' );
	if ( !style ) {
		style = '';
	}
	const styleParser = new bs.vec.util.StyleAttributeParser( style );
	styleParser.addToStyle( this.getAttribute(), this.getValue() );
	domElement.setAttribute( 'style', styleParser.toString() );
};

bs.vec.ui.TableStyle.prototype.shouldOverrideAction = function () {
	return true;
};
