<?php
namespace BlueSpice\VisualEditorConnector\Hook\BSPageTemplatesModifyTargetUrl;
use BlueSpice\PageTemplates\Hook\BSPageTemplatesModifyTargetUrl;

class UseVisualEditor extends BSPageTemplatesModifyTargetUrl {
	protected function doProcess() {
		$this->targetUrl = $this->targetTitle->getLinkURL(
			[
				'veaction' => 'edit',
				'preload' => $this->preloadTitle ? $this->preloadTitle->getPrefixedDBkey() : '',
				'redlink' => '1'
			]
		);
		return true;
	}
}
