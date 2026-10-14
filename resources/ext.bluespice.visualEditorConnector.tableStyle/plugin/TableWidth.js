bs.util.registerNamespace( 'bs.ui.plugin' );

bs.ui.plugin.TableWidth = function ( config ) {
	bs.ui.plugin.TableWidth.super.call( this, config );
};

// Keeping it for backwards compatibility
ve.dm.MWTableNode.static.classAttributes.tablefullwidth = { tablefullwidth: true };

OO.inheritClass( bs.ui.plugin.TableWidth, bs.vec.ui.plugin.MWTableDialog );

bs.ui.plugin.TableWidth.DEFAULT_WIDTH = '100%';

/**
 * Normalizes user input to a CSS width. A missing unit defaults to %.
 *
 * @param {string} input
 * @return {string|null} null if the input is not a valid width
 */
bs.ui.plugin.TableWidth.normalize = function ( input ) {
	const trimmed = ( input || '' ).trim();
	if ( !trimmed ) {
		return bs.ui.plugin.TableWidth.DEFAULT_WIDTH;
	}
	const match = trimmed.match( /^(\d+(?:\.\d+)?)\s*(%|px)?$/i );
	if ( !match || parseFloat( match[ 1 ] ) <= 0 ) {
		return null;
	}
	return match[ 1 ] + ( match[ 2 ] || '%' ).toLowerCase();
};

bs.ui.plugin.TableWidth.prototype.initialize = function () {
	this.component.widthInput = new OO.ui.TextInputWidget( {
		value: bs.ui.plugin.TableWidth.DEFAULT_WIDTH
	} );

	this.widthLayout = new OO.ui.FieldLayout( this.component.widthInput, {
		align: 'left',
		label: ve.msg( 'bs-vec-ve-table-width-label' )
	} );

	this.component.widthInput.connect( this, { change: 'onWidthChange' } );
	this.component.widthInput.$input.on( 'blur', this.onWidthBlur.bind( this ) );
	this.component.panel.$element.prepend( this.widthLayout.$element );
};

bs.ui.plugin.TableWidth.prototype.onWidthChange = function () {
	this.widthChanged = true;
	const valid = bs.ui.plugin.TableWidth.normalize( this.component.widthInput.getValue() ) !== null;
	this.component.widthInput.setValidityFlag( valid );
	this.component.updateActions();
};

bs.ui.plugin.TableWidth.prototype.onWidthBlur = function () {
	this.component.widthInput.setValue( this.getWidth() );
};

/**
 * Width as CSS value. Invalid input falls back to the width the dialog was opened with.
 *
 * @return {string}
 */
bs.ui.plugin.TableWidth.prototype.getWidth = function () {
	const width = bs.ui.plugin.TableWidth.normalize( this.component.widthInput.getValue() );
	return width !== null ? width : this.initialWidth;
};

bs.ui.plugin.TableWidth.prototype.getValues = function ( values ) {
	return ve.extendObject( values, {
		tablewidth: this.getWidth()
	} );
};

bs.ui.plugin.TableWidth.prototype.getSetupProcess = function ( parentProcess, data ) { // eslint-disable-line no-unused-vars
	parentProcess.next( function () {
		this.fragment = this.component.getFragment();
		if ( !this.fragment ) {
			return;
		}

		const tableNode = this.component.getFragment().getSelection().getTableNode( this.fragment.document );
		const rawWidth = ( tableNode.getAttribute( 'tablewidth' ) || '' ).trim();
		let width = bs.ui.plugin.TableWidth.normalize( rawWidth ) || rawWidth;

		// Backwards compatibility
		if ( tableNode.getAttribute( 'tablefullwidth' ) ) {
			width = bs.ui.plugin.TableWidth.DEFAULT_WIDTH;
		}

		this.initialWidth = width;
		this.component.widthInput.setValue( width );
		this.widthChanged = !rawWidth && !tableNode.getAttribute( 'tablefullwidth' );
		this.component.widthInput.setValidityFlag( true );

		ve.extendObject( this.component.initialValues, {
			tablewidth: this.widthChanged ? rawWidth : this.getWidth()
		} );
		this.component.updateActions();
	}, this );
	return parentProcess;
};

bs.ui.plugin.TableWidth.prototype.getActionProcess = function ( parentProcess, action ) {
	parentProcess.next( function () {
		let surfaceModel, fragment, initialFragment;
		if ( action === 'done' ) {
			initialFragment = this.fragment;
			if ( !initialFragment || !this.widthChanged ) {
				return;
			}
			surfaceModel = initialFragment.getSurface();
			fragment = surfaceModel.getLinearFragment(
				initialFragment.getSelection().tableRange, true
			);

			fragment.changeAttributes( {
				tablewidth: this.getWidth() || false,
				// Remove old class
				tablefullwidth: false
			} );
		}
	}, this );
	return parentProcess;
};

bs.vec.registerComponentPlugin(
	bs.vec.components.TABLE_DIALOG,
	( component ) => new bs.ui.plugin.TableWidth( component )
);
