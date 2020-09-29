<?php

namespace BlueSpice\VisualEditorConnector\Hook\BeforePageDisplay;

use BlueSpice\ExtensionAttributeBasedRegistry;
use BlueSpice\Hook\BeforePageDisplay;

class AddModules extends BeforePageDisplay {

	/**
	 * Skip if not in visual edit mode or Extension disabled
	 * @return bool
	 */
	protected function skipProcessing() {
		if ( !$this->getConfig()->get( 'VisualEditorConnectorEnableVisualEditor' ) ) {
			return true;
		}
		$action = $this->getContext()->getRequest()->getVal(
			'action',
			$this->getContext()->getRequest()->getVal( 'veaction', 'view' )
		);

		if ( $action === 'edit' || $action === 'editsource' ) {
			return false;
		}

		return true;
	}

	protected function doProcess() {
		$registry = new ExtensionAttributeBasedRegistry(
			'BlueSpiceVisualEditorConnectorPluginModules'
		);

		$pluginModules = [];
		foreach ( $registry->getAllKeys() as $key ) {
			$moduleName = $registry->getValue( $key );
			$pluginModules[] = $moduleName;
		}

		$this->out->addJsConfigVars(
			'bsVECColorPickerColors',
			$this->getConfig()->get( 'VisualEditorConnectorColorPickerColors' )
		);
		$this->out->addJsConfigVars(
			'bsVECColorPickerColorsBackground',
			$this->getConfig()->get( 'VisualEditorConnectorColorPickerColorsBackground' )
		);
		$this->out->addJsConfigVars(
			'bsVECellBorderColors',
			$this->getConfig()->get( 'VisualEditorConnectorCellBorderColors' )
		);

		$this->out->addJsConfigVars( 'bsVECPluginModules', $pluginModules );

		$tableStyles = $this->getConfig()->get( 'VisualEditorConnectorTableStyleRegistry' );
		$this->out->addJsConfigVars( 'bsgVisualEditorConnectorTableStyleRegistry', $tableStyles );

		$this->out->addJsConfigVars(
			'bsVECSimpleSaveProcess',
			$this->getConfig()->get( 'VisualEditorConnectorSimpleSaveProcess' )
		);

		$tagRegistry = new ExtensionAttributeBasedRegistry(
			'BlueSpiceVisualEditorConnectorTagDefinitions'
		);
		$tagDefinitions = [];
		foreach ( $tagRegistry->getAllKeys() as $key ) {
			$moduleName = $tagRegistry->getValue( $key );
			$tagDefinitions[] = $moduleName;
		}
		$this->out->addJsConfigVars( 'bsVECTagDefinitions', $tagDefinitions );

		$uploadType = $this->getConfig()->get( 'VisualEditorConnectorUploadDialogType' );
		$this->out->addJsConfigVars( 'bsVECUploadType', $uploadType );

		$this->out->addJsConfigVars(
			'bsgVisualEditorConnectorPasteFilename',
			$this->getConfig()->get( 'VisualEditorConnectorPasteFilename' )
		);

		$this->out->addModules( [
			"ext.bluespice.visualEditorConnector",
		] );
	}

}
