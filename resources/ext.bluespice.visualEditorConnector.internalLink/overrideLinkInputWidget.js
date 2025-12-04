bs.vec.registerComponentPlugin(
	bs.vec.components.LINK_ANNOTATION_INSPECTOR,
	( component ) => {
		component.oojsplusTitleInput = new bs.vec.ui.OOJSPlusTitleAnnotationWidget();

		component.linkTypeIndex.getTabPanel( 'internal' ).$element.empty().append(
			component.oojsplusTitleInput.$element
		);
		component.oojsplusTitleInput.connect( component, { change: function () {
			this.updateActions();
		} } );
		component.annotationInput = component.oojsplusTitleInput;

		return {
			updateActions: function () {
				const inputWidget = this.oojsplusTitleInput;
				if (
					!inputWidget ||
					!inputWidget.getAnnotation() ||
					!( inputWidget.getAnnotation() instanceof ve.dm.MWInternalLinkAnnotation )
				) {
					return true;
				}
				this.actions.forEach( { actions: [ 'done', 'insert' ] }, ( action ) => {
					action.setDisabled( !inputWidget.internalPicker.getTitleObject() );
				} );
				return false;
			}
		};
	}
);
