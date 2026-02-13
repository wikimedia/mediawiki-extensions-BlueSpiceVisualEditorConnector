bs.util.registerNamespace( 'bs.vec.ui' );

mw.hook( 'visualeditorplus.table.actions' ).add( ( context, data ) => {
	let tableStyleKey;
	let tableStyle;
	const tableStyleRegistry = bs.vec.registry.TableStyle.registry;
	for ( tableStyleKey in tableStyleRegistry ) {
		if ( !tableStyleRegistry.hasOwnProperty( tableStyleKey ) ) {
			continue;
		}
		tableStyle = tableStyleRegistry[ tableStyleKey ];
		if ( tableStyle.applies( 'cell' ) ) {
			data.push( tableStyle.getTool() );
		}
	}
} );

mw.hook( 'visualeditorplus.table.col.actions' ).add( ( context, colActions ) => {
	bs.vec.ui.DuplicateCol = function () {
		ve.ui.TableLineContextItem.apply( this, arguments );
	};
	OO.inheritClass( bs.vec.ui.DuplicateCol, ve.ui.TableLineContextItem );
	bs.vec.ui.DuplicateCol.static.name = 'duplicateCol';
	bs.vec.ui.DuplicateCol.static.group = 'table-col';
	bs.vec.ui.DuplicateCol.static.icon = 'tableDuplicateCol';

	bs.vec.ui.DuplicateCol.static.title =
		OO.ui.deferMsg( 'bs-vec-contextitem-column-duplicate' );
	bs.vec.ui.DuplicateCol.static.commandName = 'duplicateColumn';
	ve.ui.contextItemFactory.register( bs.vec.ui.DuplicateCol );
	colActions.push( 'duplicateCol' );

	bs.vec.ui.WidthCol = function () {
		ve.ui.TableLineContextItem.apply( this, arguments );
	};
	OO.inheritClass( bs.vec.ui.WidthCol, ve.ui.TableLineContextItem );
	bs.vec.ui.WidthCol.static.name = 'widthColumn';
	bs.vec.ui.WidthCol.static.group = 'table-col';
	bs.vec.ui.WidthCol.static.icon = 'columnWidth';

	bs.vec.ui.WidthCol.static.title =
		OO.ui.deferMsg( 'bs-vec-table-style-column-width' );
	bs.vec.ui.WidthCol.static.commandName = 'widthColumn';
	ve.ui.contextItemFactory.register( bs.vec.ui.WidthCol );

	colActions.push( 'widthColumn' );
} );
mw.hook( 'visualeditorplus.table.row.actions' ).add( ( context, rowActions ) => {
	bs.vec.ui.DuplicateRow = function () {
		ve.ui.TableLineContextItem.apply( this, arguments );
	};
	OO.inheritClass( bs.vec.ui.DuplicateRow, ve.ui.TableLineContextItem );
	bs.vec.ui.DuplicateRow.static.name = 'duplicateRow';
	bs.vec.ui.DuplicateRow.static.group = 'table-row';
	bs.vec.ui.DuplicateRow.static.icon = 'tableDuplicateRow';

	bs.vec.ui.DuplicateRow.static.title =
		OO.ui.deferMsg( 'bs-vec-contextitem-row-duplicate' );
	bs.vec.ui.DuplicateRow.static.commandName = 'duplicateRow';
	ve.ui.contextItemFactory.register( bs.vec.ui.DuplicateRow );

	rowActions.push( 'duplicateRow' );

	bs.vec.ui.HeightRow = function () {
		ve.ui.TableLineContextItem.apply( this, arguments );
	};
	OO.inheritClass( bs.vec.ui.HeightRow, ve.ui.TableLineContextItem );
	bs.vec.ui.HeightRow.static.name = 'heightRow';
	bs.vec.ui.HeightRow.static.group = 'table-row';
	bs.vec.ui.HeightRow.static.icon = 'rowHeight';

	bs.vec.ui.HeightRow.static.title =
		OO.ui.deferMsg( 'bs-vec-table-style-row-height' );
	bs.vec.ui.HeightRow.static.commandName = 'heightRow';
	ve.ui.contextItemFactory.register( bs.vec.ui.HeightRow );

	rowActions.push( 'heightRow' );
} );
