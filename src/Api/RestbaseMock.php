<?php

namespace BlueSpice\VisualEditorConnector\Api;

use ApiVisualEditor;
use ConfigFactory;
use ApiBase;
use WikiPage;
use Title;
use WikitextContent;
use BlueSpice\VisualEditorConnector\Api\Format\RestbaseMock as RestbaseMockFormat;

class RestbaseMock extends ApiVisualEditor {

	/**
	 *
	 * @param \ApiMain $main
	 * @param string $name
	 */
	public function __construct( \ApiMain $main, $name ) {
		$config = ConfigFactory::getDefaultInstance()->makeConfig( 'visualeditor' );
		parent::__construct( $main, $name, $config );
	}

	/**
	 *
	 */
	public function execute() {
		$this->serviceClient->mount( '/restbase/', $this->getVRSObject() );
		$path = $this->getParameter( 'path' );

		if ( strpos( $path, 'v1/transform/wikitext/to/html/' ) === 0 ) {
			$pageName = preg_replace( '#^v1/transform/wikitext/to/html/(.*?)/\d*?$#', '$1', $path );
			$this->mockWikiTextToHtml( $pageName );
		}
		if ( strpos( $path, 'v1/page/html/' ) === 0 ) {
			$pageName = preg_replace( '#^v1/page/html/#', '', $path );
			$this->mockGetPageHtml( $pageName );
		}
	}

	/**
	 *
	 * @return array
	 */
	public function getAllowedParams() {
		return [
			'path' => [
				ApiBase::PARAM_REQUIRED => true,
			]
		];
	}

	private function mockWikiTextToHtml( $pageName ) {
		$title = Title::newFromText( $pageName );
		$wikitext = $this->getParameter( 'wikitext' );
		$html = $this->requestRestbase(
			'POST',
			'transform/wikitext/to/html/' . urlencode( $title->getPrefixedDBkey() ),
			[
				'wikitext' => $wikitext
			]
		);
		$result = $this->getResult();
		$result->addValue( null, 'html', $html );
	}

	private function mockGetPageHtml( $pageName ) {
		$result = $this->getResult();

		$pageNameParts = explode( '?', $pageName, 2 );
		$actualPageName = $pageNameParts[0];

		$title = Title::newFromText( $actualPageName );

		if( $title instanceof Title === false ) {
			return;
		}

		if ( !$title->userCan( 'read' ) ) {
			return;
		}

		$wikiPage = WikiPage::factory( $title );
		$content = $wikiPage->getContent();

		if ( $content instanceof WikitextContent ) {
			$rawWikiText = $content->getNativeData();
			$html = $this->requestRestbase(
				'POST',
				'transform/wikitext/to/html/' . urlencode( $title->getPrefixedDBkey() ),
				[
					'wikitext' => $rawWikiText
				]
			);
			$result->addValue( null, 'html', $html );
		}
	}

	/**
	 *
	 * @return RestbaseMockFormat
	 */
	public function getCustomPrinter() {
		return new RestbaseMockFormat( $this->getMain() );
	}
}