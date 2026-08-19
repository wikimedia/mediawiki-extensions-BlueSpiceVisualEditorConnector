bs.vec.registerComponentPlugin(
	bs.vec.components.LINK_ANNOTATION_INSPECTOR,
	( component ) => {
		if ( !component.linkTypeIndex || !component.linkTypeIndex.getTabPanel ) {
			return {};
		}
		const internalPanel = component.linkTypeIndex.getTabPanel( 'internal' );
		if ( !internalPanel ) {
			return {};
		}

		component.oojsplusTitleInput = new bs.vec.ui.OOJSPlusTitleAnnotationWidget();

		internalPanel.$element.empty().append(
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
					!this.linkTypeIndex ||
					!this.linkTypeIndex.getCurrentTabPanelName ||
					this.linkTypeIndex.getCurrentTabPanelName() !== 'internal' ||
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
