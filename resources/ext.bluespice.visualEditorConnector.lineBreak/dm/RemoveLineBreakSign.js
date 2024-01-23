bs.util.registerNamespace('bs.vec.dm');

bs.vec.dm.RemoveLineBreakSign = function () {
	// Parent constructor
	bs.vec.dm.RemoveLineBreakSign.super.apply(this, arguments);
};

/* Inheritance */
OO.inheritClass(bs.vec.dm.RemoveLineBreakSign, ve.dm.BreakNode);

bs.vec.dm.RemoveLineBreakSign.static.toDataElement = function (domElement, doc) {
	if (domElement[0].nextSibling) {
		var prevSibling = domElement[0].previousSibling;
		if ( prevSibling && prevSibling.textContent === "\n" ) {
			domElement[0].nextSibling.textContent = domElement[0].nextSibling.textContent.trim();
		}
	}
};

/* Registration */
ve.dm.modelRegistry.register(bs.vec.dm.RemoveLineBreakSign);
