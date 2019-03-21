( function( mw, $, bs, moment, d, undefined ) {
	bs.util.registerNamespace( 'bs.vec.ui.ForeignStructuredUpload' );

	bs.vec.ui.ForeignStructuredUpload.BookletLayout = function( config ) {
		bs.vec.ui.ForeignStructuredUpload.BookletLayout.parent.call( this, config );

		this.uploadType = config.uploadType;
	};

	OO.inheritClass( bs.vec.ui.ForeignStructuredUpload.BookletLayout, mw.ForeignStructuredUpload.BookletLayout );

	bs.vec.ui.ForeignStructuredUpload.BookletLayout.prototype.initialize = function () {
		var booklet = this;
		return mw.ForeignStructuredUpload.BookletLayout.parent.prototype.initialize.call( this ).then(
			function () {
				return $.when(
					// Point the CategoryMultiselectWidget to the right wiki
					booklet.upload.getApi().then( function ( api ) {
						// If this is a ForeignApi, it will have a apiUrl, otherwise we don't need to do anything
						if ( api.apiUrl ) {
							// Can't reuse the same object, CategoryMultiselectWidget calls #abort on its mw.Api instance
							booklet.categoriesWidget.api = new mw.ForeignApi( api.apiUrl );
						}
						return $.Deferred().resolve();
					} ),
					// Set up booklet fields and license messages to match configuration
					booklet.upload.loadConfig().then( function ( config ) {
						var fields = config.fields;

						// Hide disabled fields
						booklet.descriptionField.toggle( !!fields.description );
						booklet.categoriesField.toggle( !!fields.categories );
						booklet.dateField.toggle( !!fields.date );
						// Update form validity
						booklet.onInfoFormChange();
					}, function ( errorMsg ) {
						booklet.getPage( 'upload' ).$element.msg( errorMsg );
						return $.Deferred().resolve();
					} )
				);
			}
		).catch(
			// Always resolve, never reject
			function () { return $.Deferred().resolve(); }
		);
	};

	bs.vec.ui.ForeignStructuredUpload.BookletLayout.prototype.renderUploadForm = function () {
		var fieldset,
			layout = this;

		this.selectFileWidget = new OO.ui.SelectFileWidget( {
			showDropTarget: true
		} );

		fieldset = new OO.ui.FieldsetLayout();
		fieldset.addItems( [
			new OO.ui.FieldLayout( this.selectFileWidget, {
				align: 'top'
			} )
		] );
		this.uploadForm = new OO.ui.FormLayout( { items: [ fieldset ] } );

		// Validation
		this.selectFileWidget.on( 'change', this.onUploadFormChange.bind( this ) );

		this.selectFileWidget.on( 'change', function () {
			var file = layout.getFile();

			// Set the date to lastModified once we have the file
			if ( layout.getDateFromLastModified( file ) !== undefined ) {
				layout.dateWidget.setValue( layout.getDateFromLastModified( file ) );
			}

			// Check if we have EXIF data and set to that where available
			layout.getDateFromExif( file ).done( function ( date ) {
				layout.dateWidget.setValue( date );
			} );

			layout.updateFilePreview();
		} );

		return this.uploadForm;
	};

	bs.vec.ui.ForeignStructuredUpload.BookletLayout.prototype.onUploadFormChange = function () {
		var file = this.selectFileWidget.getValue(),
			valid = !!file;
		this.emit( 'uploadValid', valid );
	};

	bs.vec.ui.ForeignStructuredUpload.BookletLayout.prototype.clear = function () {
		mw.ForeignStructuredUpload.BookletLayout.parent.prototype.clear.call( this );

		this.categoriesWidget.setItemsFromData( [] );
		this.dateWidget.setValue( '' ).setValidityFlag( true );
	};

	bs.vec.ui.ForeignStructuredUpload.BookletLayout.prototype.uploadFile = function () {
		var deferred = $.Deferred(),
			startTime = mw.now(),
			layout = this,
			file = this.getFile();

		if ( this.filekey ) {
			if ( file === null ) {
				// Someone gonna get-a hurt real bad
				throw new Error( 'filekey not passed into file select widget, which is impossible. Quitting while we\'re behind.' );
			}

			// Stashed file already uploaded.
			deferred.resolve();
			this.uploadPromise = deferred;
			this.emit( 'fileUploaded' );
			return deferred;
		}

		if ( this.uploadType === 'one-click' ) {
			// Generate random name based on orig name
			var nameBits = file.name.split( '.' );
			var extension = nameBits.pop();
			nameBits.push( new Date().getTime() );
			nameBits.push( extension );
			var randomName = nameBits.join( '.' );
			this.setFilename( randomName );
		} else {
			this.setPage( 'info' );
			this.setFilename( file.name );
		}

		this.upload.setFile( file );
		// The original file name might contain invalid characters, so use our sanitized one
		this.upload.setFilename( this.getFilename() );

		this.uploadPromise = this.upload.uploadToStash();
		this.uploadPromise.then( function () {
			deferred.resolve();
			layout.emit( 'fileUploaded' );
		}, function () {
			// These errors will be thrown while the user is on the info page.
			layout.getErrorMessageForStateDetails().then( function ( errorMessage ) {
				deferred.reject( errorMessage );
			} );
		}, function ( progress ) {
			var elapsedTime = mw.now() - startTime,
				estimatedTotalTime = ( 1 / progress ) * elapsedTime,
				estimatedRemainingTime = moment.duration( estimatedTotalTime - elapsedTime );
			layout.emit( 'fileUploadProgress', progress, estimatedRemainingTime );
		} );

		// If there is an error in uploading, come back to the upload page
		deferred.fail( function () {
			layout.setPage( 'upload' );
		} );

		return deferred;
	};

	bs.vec.ui.ForeignStructuredUpload.BookletLayout.prototype.uploadSingleStep = function() {
		var dfd = $.Deferred();
		this.uploadFile().done( function() {
			this.saveFile().then( function() {
				dfd.resolve();
			}.bind( this ), function( error ) {
				dfd.reject( error );
			} );
		}.bind( this ) ).fail( function() {
			dfd.reject();
		} );
		return dfd;
	};

	bs.vec.ui.ForeignStructuredUpload.BookletLayout.prototype.renderInfoForm = function () {
		bs.vec.ui.ForeignStructuredUpload.BookletLayout.super.prototype.renderInfoForm.apply( this );

		this.descriptionWidget.setRequired( false );
		return this.infoForm;
	};

	bs.vec.ui.ForeignStructuredUpload.BookletLayout.prototype.onInfoFormChange = function () {
		var layout = this;
		$.when(
			this.filenameWidget.getValidity()
		).done( function () {
			layout.emit( 'infoValid', true );
		} ).fail( function () {
			layout.emit( 'infoValid', false );
		} );
	};
} ) ( mediaWiki, jQuery, blueSpice, moment, document );
