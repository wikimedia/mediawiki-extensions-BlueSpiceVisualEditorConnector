<?php

namespace BlueSpice\VisualEditorConnector\Integration\PDFCreator\StyleBlockProvider;

use MediaWiki\Extension\PDFCreator\IStyleBlocksProvider;
use MediaWiki\Extension\PDFCreator\Utility\ExportContext;
use MediaWiki\ResourceLoader\ResourceLoader;

class Colors implements IStyleBlocksProvider {

	/**
	 * @param ResourceLoader $resourceLoader
	 */
	public function __construct(
		private readonly ResourceLoader $resourceLoader
	) {
	}

	/**
	 * @inheritDoc
	 */
	public function execute( string $module, ExportContext $context ): array {
		$base = dirname( __FILE__, 5 );
		$filePath = "$base/resources/ext.bluespice.visualEditorConnector.colors.less";
		if ( !file_exists( $filePath ) ) {
			return [];
		}
		$compiler = $this->resourceLoader->getLessCompiler();
		$lessCode = file_get_contents( $filePath );
		return [ 'VisualEditorConnector' => $compiler->parse( $lessCode )->getCss() ];
	}
}
