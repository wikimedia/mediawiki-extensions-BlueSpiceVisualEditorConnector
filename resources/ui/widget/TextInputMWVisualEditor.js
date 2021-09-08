bs = bs || {};
bs.ui = bs.ui || {};
bs.ui.widget = bs.ui.widget || {};

bs.ui.widget.TextInputMWVisualEditor = function ( config ) {
	OO.ui.MultilineTextInputWidget.call( this, config );
	var me = this;
	me.selector = config.selector || '.bs-vec-widget';
	me.visualEditor = null;
	me.config = config;
	me.currentValue = config.value || '';
};
OO.initClass( bs.ui.widget.TextInputMWVisualEditor );
OO.inheritClass( bs.ui.widget.TextInputMWVisualEditor, OO.ui.MultilineTextInputWidget );

bs.ui.widget.TextInputMWVisualEditor.prototype.init = function() {
	// nothing to do here. Method must exist for interface reasons.
};

bs.ui.widget.TextInputMWVisualEditor.prototype.onFocus = function() {
	if( this.visualEditor ) {
		return;
	}
	this.makeVisualEditor( this.config );
	$( this.config.selector ).hide();
};

/**
 *
 * @returns {string}
 */
bs.ui.widget.TextInputMWVisualEditor.prototype.getValue = function() {
	var promise = this.visualEditor.getWikiText();
	var me = this;
	promise.done( function ( value ) {
		// keep track of actual value anyway to be on the safe side
		me.currentValue = value;
	} );
	return promise;
};

/**
 *
 * @param {string} value
 * @returns {undefined}
 */
bs.ui.widget.TextInputMWVisualEditor.prototype.setValue = function( value ) {
	if( !this.visualEditor ) {
		this.currentValue = value;
		return;
	}

	this.visualEditor.clearSurfaces();
	this.visualEditor.addSurface(
		ve.dm.converter.getModelFromDom(
			ve.createDocumentFromHtml( value )
		)
	);
};

bs.ui.widget.TextInputMWVisualEditor.prototype.makeVisualEditor = function( config ) {
	var me = this;
	config = config || me.config;
	me.emit( 'editorStartup', this );
	bs.vec.createEditor( config.id, {
		renderTo: config.selector,
		value: me.currentValue,
		format: config.format
	}).done( function( target ){
		me.visualEditor = target;
		me.visualEditor.getSurface().getModel().on( 'history', me.onHistoryChange, [], me );
	}).then( function(){
		me.emit( 'editorStartupComplete', this );
	});
};

bs.ui.widget.TextInputMWVisualEditor.prototype.onHistoryChange = function() {
	// we do not need to track the actual value, just that there was a change
	this.emit( 'change', this.currentValue );
};

bs.ui.widget.TextInputMWVisualEditor.prototype.getValidity = function() {
	// visual editor is always valid
	var $dfd = $.Deferred();
	$dfd.resolve();
	return $dfd.promise( this );
};
