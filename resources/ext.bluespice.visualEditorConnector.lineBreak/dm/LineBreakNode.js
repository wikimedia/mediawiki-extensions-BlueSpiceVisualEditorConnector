bs.util.registerNamespace( 'bs.vec.dm' );

bs.vec.dm.LineBreakNode = function () {
	// Parent constructor
	bs.vec.dm.LineBreakNode .super.apply( this, arguments );
};

/* Inheritance */
OO.inheritClass( bs.vec.dm.LineBreakNode, ve.dm.BreakNode );


bs.vec.dm.LineBreakNode.static.toDomElements = function ( data, doc ) {
	var el = doc.createElement('br');
	return [ el ] ;
};

/* Registration */
ve.dm.modelRegistry.register( bs.vec.dm.LineBreakNode  );
