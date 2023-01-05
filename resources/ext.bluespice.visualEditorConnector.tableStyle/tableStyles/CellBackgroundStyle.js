bs.util.registerNamespace( 'bs.vec.ui' );

bs.vec.ui.CellBackgroundStyle = function() {
	bs.vec.ui.CellBackgroundStyle.super.apply( this );
	this.section = bs.vec.ui.TableStyle.static.SECTION_CELL;
	this.applyTo = bs.vec.ui.TableStyle.static.ELEMENT_CELL;
};

OO.inheritClass( bs.vec.ui.CellBackgroundStyle , bs.vec.ui.TableStyle );

bs.vec.ui.CellBackgroundStyle.prototype.getAttribute = function() {
	return 'background-color';
};

bs.vec.ui.CellBackgroundStyle.prototype.getUnit = function() {
	return bs.vec.ui.TableStyle.static.UNIT_NONE;
};

bs.vec.ui.CellBackgroundStyle.prototype.cleanColor = function ( $element ) {
	var classes = $element[0].classList.values();
	for (const cellClass of classes) {
		if (cellClass.match(/col-\S+/)) {
			$element[0].classList.remove(cellClass);
		}
	}
	$element[0].style.backgroundColor = "";
	$element[0].removeAttribute('style');
	return $element;
};

bs.vec.ui.CellBackgroundStyle.prototype.decorate = function ( $element ) {
	$element = this.cleanColor($element);
	if ( this.value.hasOwnProperty( 'colorCode' ) ) {
		return $element.css( this.getAttribute(), this.value.colorCode );
	} else if ( this.value.hasOwnProperty( 'colorClass' ) ) {
		return $element.addClass( this.value.colorClass );
	}
};

bs.vec.ui.CellBackgroundStyle.prototype.getTool = function() {
	return {
		widget: bs.vec.ui.widget.CellBackgroundWidget,
		displaySection: bs.vec.ui.TableStyle.static.TYPE_QUICK
	};
};

/**
 * This is called when command related to this tableStyle is executed
 * context: bs.vec.ui.TableAction
 *
 * @param Object subject
 * @param Object args
 */
bs.vec.ui.CellBackgroundStyle.prototype.executeAction = function( subject, args ) {
	if ( !args.hasOwnProperty( 'value' ) ) {
		return;
	}
	var	data = {};

	if ( args.value.hasOwnProperty( 'code' ) ) {
		data = { colorCode: args.value.code };
	} else if ( args.value.hasOwnProperty( 'class' ) ) {
		data = { colorClass: args.value.class };
	}

	subject.node.element.cellBackgroundColor = data;
	return subject;
};

bs.vec.ui.CellBackgroundStyle.prototype.getModelProperty = function() {
	return 'cellBackgroundColor';
};

bs.vec.ui.CellBackgroundStyle.prototype.toDataElement = function( section, domElement, result ) {
	var style, styleParser, classes;
	if ( !this.applies( section ) ) {
		return;
	}
	style = domElement.getAttribute( 'style' );
	if ( style ) {
		styleParser = new bs.vec.util.StyleAttributeParser( style );
		if ( styleParser.getValueForAttr( this.getAttribute() ) ) {
			result.cellBackgroundColor = {
				colorCode: styleParser.getValueForAttr( this.getAttribute() )
			};
		}
	} else {
		classes = domElement.getAttribute( 'class' );
		if ( !classes ) {
			return;
		}
		classes = classes.split( ' ' );
		if ( classes.length === 0 || classes.length > 1 ) {
			return;
		}

		result.cellBackgroundColor = {
			colorClass: classes[0]
		};
	}
};

bs.vec.ui.CellBackgroundStyle.prototype.toDomElements = function( section, dataElement, domElement, attributes ) {
	var value, style, styleParser;

	if ( !this.applies( section ) ) {
		return;
	}
	// if no changes were done with background-color property in current cell
	if ( !dataElement.hasOwnProperty( 'cellBackgroundColor' ) ) {
		return;
	}

	value = dataElement.cellBackgroundColor;
	style = domElement.getAttribute( 'style' );
	if ( !style ) {
		style = '';
	}
	styleParser = new bs.vec.util.StyleAttributeParser( style );

	// clearing background style and colors from domElement
	// if bg-color was fully cleared from cell value will be an empty object
	styleParser.addToStyle( this.getAttribute(), "" );
	domElement.setAttribute( 'style', styleParser.toString() );
	domElement.setAttribute( 'class', "" );

	if ( !$.isEmptyObject( value ) && value.hasOwnProperty( 'colorCode' ) ) {
		styleParser.addToStyle( this.getAttribute(), value.colorCode );
		domElement.setAttribute( 'style', styleParser.toString() );
	} else if ( !$.isEmptyObject( value ) && value.hasOwnProperty( 'colorClass' ) ) {
		domElement.setAttribute( 'class', value.colorClass );
	}
	return domElement;
};

bs.vec.registry.TableStyle.register( "cellBackgroundColor", new bs.vec.ui.CellBackgroundStyle() );
