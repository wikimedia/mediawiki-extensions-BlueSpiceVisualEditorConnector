bs.util.registerNamespace( 'bs.vec.ui' );

bs.vec.ui.MWMediaDialog = function BsVecUiMWMediaDialog( config ) {
	bs.vec.ui.MWMediaDialog.super.call( this, config );

	this.uploadType = mw.config.get( 'bsVECUploadType' );
};

OO.inheritClass( bs.vec.ui.MWMediaDialog, ve.ui.MWMediaDialog );

bs.vec.ui.MWMediaDialog.prototype.initialize = function () {
	bs.vec.ui.MWMediaDialog.super.prototype.initialize.call( this );

	if ( this.uploadType !== 'original' ) {
		this.mediaUploadBooklet = new bs.vec.ui.ForeignStructuredUpload.BookletLayout( {
			$overlay: this.$overlay,
			uploadType: this.uploadType
		} );

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
	}

	this.runComponentPlugins();
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

bs.vec.ui.MWMediaDialog.prototype.runComponentPlugins = function() {
	var pluginCallbacks = bs.vec.getComponentPlugins(
			bs.vec.components.MEDIA_DIALOG
	);

	for( var i = 0; i < pluginCallbacks.length; i++ ) {
		var callback = pluginCallbacks[i];
		callback( this );
	}
};

bs.vec.ui.MWMediaDialog.prototype.switchPanels = function ( panel, stopSearchRequery ) {
	if( panel !== 'search' ) {
		bs.vec.ui.MWMediaDialog.parent.prototype.switchPanels.apply( this, [ panel, stopSearchRequery ] );
	} else {
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
	if ( action === 'upload' && this.uploadType !== 'original' ) {
		if ( this.uploadType === 'simple' ) {
			return new OO.ui.Process( this.mediaUploadBooklet.uploadFile() );
		} else if ( this.uploadType === 'one-click' ) {
			return new OO.ui.Process( this.mediaUploadBooklet.uploadSingleStep() );
		}
	} else {
		return bs.vec.ui.MWMediaDialog.super.prototype.getActionProcess.call( this, action );
	}
};
