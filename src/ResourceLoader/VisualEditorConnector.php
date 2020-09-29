<?php

namespace BlueSpice\VisualEditorConnector\ResourceLoader;

use BlueSpice\ExtensionAttributeBasedRegistry;
use Config;
use MediaWiki\MediaWikiServices;
use ResourceLoaderContext;
use ResourceLoaderFileModule;

class VisualEditorConnector extends ResourceLoaderFileModule {
	/**
	 * @inheritDoc
	 */
	public function __construct( array $options = [], $localBasePath = null, $remoteBasePath = null ) {
		if ( isset( $options['packageFiles'] ) ) {
			$options['packageFiles'] = [];
		}
		if ( !is_array( $options['packageFiles'] ) ) {
			$options['packageFiles'] = [ $options['packageFiles'] ];
		}
		$options['packageFiles'][] = [
			'name' => 'bsVecConfig.json',
			'callback' => [ $this, 'getJSConfig' ]
		];
		parent::__construct( $options, $localBasePath, $remoteBasePath );
	}

	/**
	 * @inheritDoc
	 */
	public function getConfig() {
		return MediaWikiServices::getInstance()->getConfigFactory()->makeConfig( 'bsg' );
	}

	/**
	 * @param ResourceLoaderContext $context
	 * @param Config $config
	 * @param array|null $callbackParams
	 * @return array
	 */
	protected function getJSConfig(
		ResourceLoaderContext $context, Config $config, ?array $callbackParams
	) {
		$registry = new ExtensionAttributeBasedRegistry(
			'BlueSpiceVisualEditorConnectorPluginModules'
		);

		$pluginModules = [];
		foreach ( $registry->getAllKeys() as $key ) {
			$moduleName = $registry->getValue( $key );
			$pluginModules[] = $moduleName;
		}

		$tagRegistry = new ExtensionAttributeBasedRegistry(
			'BlueSpiceVisualEditorConnectorTagDefinitions'
		);
		$tagDefinitions = [];
		foreach ( $tagRegistry->getAllKeys() as $key ) {
			$moduleName = $tagRegistry->getValue( $key );
			$tagDefinitions[] = $moduleName;
		}

		return [
			"bsVECColorPickerColors" => $config->get( 'VisualEditorConnectorColorPickerColors' ),
			"bsVECColorPickerColorsBackground" =>
				$config->get( 'VisualEditorConnectorColorPickerColorsBackground' ),
			"bsVECellBorderColors" => $config->get( 'VisualEditorConnectorCellBorderColors' ),
			"bsVECPluginModules" => $pluginModules,
			"bsgVisualEditorConnectorTableStyleRegistry" =>
				$config->get( 'VisualEditorConnectorTableStyleRegistry' ),
			"bsVECSimpleSaveProcess" => $config->get( 'VisualEditorConnectorSimpleSaveProcess' ),
			"bsVECTagDefinitions" => $tagDefinitions,
			"bsVECUploadType" => $config->get( 'VisualEditorConnectorUploadDialogType' ),
			"bsgVisualEditorConnectorPasteFilename" =>
				$config->get( 'VisualEditorConnectorPasteFilename' ),
		];
	}
}
