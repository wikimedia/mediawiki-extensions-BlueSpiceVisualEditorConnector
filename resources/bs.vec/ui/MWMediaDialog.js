bs.util.registerNamespace( 'bs.vec.ui' );

bs.vec.ui.MWMediaDialog = function BsVecUiMWMediaDialog( config ) {
	bs.vec.ui.MWMediaDialog.super.call( this, config );

	this.uploadType = mw.config.get( 'bsVECUploadType' );
};

OO.inheritClass( bs.vec.ui.MWMediaDialog, ve.ui.MWMediaDialog );

ve.ui.MWMediaDialog.static.actions.push( {
		action: 'cancelchoose',
		label: OO.ui.deferMsg( 'visualeditor-dialog-media-goback' ),
		flags: [ 'safe', 'back' ],
		modes: [ 'info_file' ]
	},{
		action: 'link',
		label: OO.ui.deferMsg( 'bs-visualeditorconnector-dialog-media-link' ),
		flags: [ 'primary' ],
		modes: [ 'info_file' ]
	},
	{
		action: 'choose',
		label: OO.ui.deferMsg( 'bs-visualeditorconnector-dialog-media-embed' ),
		flags: [ 'progressive' ],
		modes: [ 'info_file' ]
	} );

bs.vec.ui.MWMediaDialog.prototype.initialize = function () {
	this.initComponentPlugins();
	bs.vec.ui.MWMediaDialog.super.prototype.initialize.call( this );
	this.overwriteUploadBooklet();

	for( var i = 0; i < this.componentPlugins.length; i++ ) {
		var plugin = this.componentPlugins[i];
		plugin.initialize();
	}
};

bs.vec.ui.MWMediaDialog.prototype.overwriteUploadBooklet = function () {
	this.setNewUploadBooklet();
	this.reestablishUploadBookletEventWiring();
};

bs.vec.ui.MWMediaDialog.prototype.setNewUploadBooklet = function () {
	switch ( this.uploadType ) {
		case 'simple':
			this.mediaUploadBooklet = new bs.vec.ui.ForeignStructuredUpload.BookletLayoutSimple( {
				$overlay: this.$overlay
			} );
			break;
		case 'one-click':
			this.mediaUploadBooklet = new bs.vec.ui.ForeignStructuredUpload.BookletLayoutOneClick( {
				$overlay: this.$overlay
			} );
			break;
		case 'original':
		default:
			this.mediaUploadBooklet = new bs.vec.ui.ForeignStructuredUpload.BookletLayout( {
				$overlay: this.$overlay
			} );
			break;
	}

	for( var i = 0; i < this.componentPlugins.length; i++ ) {
		var plugin = this.componentPlugins[i];
		plugin.setNewUploadBooklet();
	}
};

bs.vec.ui.MWMediaDialog.prototype.reestablishUploadBookletEventWiring = function () {
	this.mediaUploadBooklet.connect( this, {
		set: 'onMediaUploadBookletSet',
		uploadValid: 'onUploadValid',
		infoValid: 'onInfoValid'
	} );

	var uploadTab = this.searchTabs.getTabPanel( 'upload' );
	this.searchTabs.removeTabPanels( [ uploadTab ] );

	this.searchTabs.addTabPanels( [
		new OO.ui.TabPanelLayout( 'upload', {
			label: ve.msg( 'visualeditor-dialog-media-search-tab-upload' ),
			content: [ this.mediaUploadBooklet ]
		} )
	] );
};

bs.vec.ui.MWMediaDialog.prototype.getReadyProcess = function ( data ) {
	return bs.vec.ui.MWMediaDialog.super.prototype.getReadyProcess.call( this, data )
		.next( function () {
			if ( data.hasOwnProperty( 'file' ) ) {
				// If there is file set (like on paste),
				// switch to upload panel
				this.searchTabs.setTabPanel( 'upload' );
				this.sizeWidget.validateDimensions();
			}
		}, this );
};

bs.vec.ui.MWMediaDialog.prototype.initComponentPlugins = function() {
	this.componentPlugins = [];

	var pluginCallbacks = bs.vec.getComponentPlugins(
		bs.vec.components.MEDIA_DIALOG
	);

	for( var i = 0; i < pluginCallbacks.length; i++ ) {
		var callback = pluginCallbacks[i];
		this.componentPlugins.push( callback( this ) );
	}
};

bs.vec.ui.MWMediaDialog.prototype.getSetupProcess = function ( data ) {
	var parentProcess = bs.vec.ui.MWMediaDialog.super.prototype.getSetupProcess.call( this, data );
	for( var i = 0; i < this.componentPlugins.length; i++ ) {
		var plugin = this.componentPlugins[i];
		parentProcess = plugin.getSetupProcess( parentProcess, data );
	}
	return parentProcess;
};

bs.vec.ui.MWMediaDialog.prototype.switchPanels = function ( panel, stopSearchRequery ) {
	switch ( panel ) {
		case 'search':
			this.setSize( 'larger' );
			this.selectedImageInfo = null;
			if ( !stopSearchRequery ) {
				this.search.getQuery().setValue( '*' );
				this.search.getQuery().focus().select();
			}
			// Set the edit panel
			this.panels.setItem( this.mediaSearchPanel );
			this.searchTabs.setTabPanel( 'search' );
			this.searchTabs.toggleMenu( true );
			this.actions.setMode( this.imageModel ? 'change' : 'select' );
			// Layout pending items
			this.search.runLayoutQueue();
			break;
		case 'imageInfo':
		case 'edit':
			bs.vec.ui.MWMediaDialog.parent.prototype.switchPanels.apply( this, [ panel, stopSearchRequery ] );
			switch ( this.selectedImageInfo.mediatype ) {
				case 'OFFICE':
					this.actions.setMode( 'info_file' );
					break;
			}
			break;
		default:
			bs.vec.ui.MWMediaDialog.parent.prototype.switchPanels.apply( this, [ panel, stopSearchRequery ] );
			break;
	}
	this.currentPanel = panel || 'imageinfo';
};

bs.vec.ui.MWMediaDialog.prototype.uploadPageNameSet = function ( pageName ) {
	var imageInfo;
	if ( pageName === 'insert' ) {
		imageInfo = this.mediaUploadBooklet.upload.getImageInfo();
		this.selectedImageInfo = imageInfo;
		this.confirmSelectedImage();
		this.switchPanels( 'edit' );
	} else {
		bs.vec.ui.MWMediaDialog.parent.prototype.uploadPageNameSet.call( this, pageName );
	}
};

bs.vec.ui.MWMediaDialog.prototype.getActionProcess = function ( action ) {
	var process = null;

	if ( action === 'link' ) {
		process = new OO.ui.Process( this.linkFile() );
	}
	else {
		process = bs.vec.ui.MWMediaDialog.super.prototype.getActionProcess.call( this, action );
	}

	for( var i = 0; i < this.componentPlugins.length; i++ ) {
		var plugin = this.componentPlugins[i];
		plugin.getActionProcess( process, action );
	}

	return process;

};

bs.vec.ui.MWMediaDialog.prototype.linkFile = function () {
	var title = this.selectedImageInfo.title || this.selectedImageInfo.canonicaltitle,
		titleObject = mw.Title.newFromText( title ),
		linkAnnotation = ve.dm.MWInternalLinkAnnotation.static.newFromTitle( titleObject );

	this.getFragment()
		.insertContent( title )
		.annotateContent( 'set', linkAnnotation );

	this.close( { action: 'link' } );
};
