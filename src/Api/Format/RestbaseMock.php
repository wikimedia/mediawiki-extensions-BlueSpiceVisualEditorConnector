<?php

namespace BlueSpice\VisualEditorConnector\Api\Format;

use ApiFormatBase;

class RestbaseMock extends ApiFormatBase {

	/**
	 *
	 */
	public function execute() {
		$data = $this->getResult()->getResultData();
		if ( isset( $data['html'] ) ) {
			$this->printText( $data['html'] );
		}
	}

	/**
	 *
	 * @return string
	 */
	public function getMimeType() {
		return 'text/html';
	}

}