<?php

namespace BlueSpice\VisualEditorConnector\SimpleFarmer\DynamicConfiguration;

use BlueSpice\SimpleFarmer\DynamicConfigurationBase;

class VirtualRestConfig extends DynamicConfigurationBase {
	protected function doApply() {
		$this->globals['wgVirtualRestConfig']['modules']['parsoid']['domain'] = $this->instanceName;
	}
}