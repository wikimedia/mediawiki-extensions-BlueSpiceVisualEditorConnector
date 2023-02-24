bs.util.registerNamespace( 'bs.vec.dm' );

bs.vec.dm.ExplicitLineBreakNode = function () {
	// Parent constructor
	bs.vec.dm.ExplicitLineBreakNode .super.apply( this, arguments );
};

/* Inheritance */
OO.inheritClass( bs.vec.dm.ExplicitLineBreakNode, ve.dm.LeafNode );

bs.vec.dm.ExplicitLineBreakNode.static.name = 'explicitBreak';

bs.vec.dm.ExplicitLineBreakNode.static.isContent = true;

bs.vec.dm.ExplicitLineBreakNode.static.matchTagNames = [ 'span' ];

bs.vec.dm.ExplicitLineBreakNode.static.matchFunction = function ( element ) {
	return element.classList.contains( 'bs-vec-line-break' );
};


bs.vec.dm.ExplicitLineBreakNode.static.toDomElements = function ( data, doc ) {
	// Its impossible to create a <br> element in DOM directly,
	// it must be wrapped in another element
	var el = doc.createElement('span');
	// Add class
	el.classList.add( 'bs-vec-line-break' );
	return [ el ];
};

/* Registration */
ve.dm.modelRegistry.register( bs.vec.dm.ExplicitLineBreakNode );
