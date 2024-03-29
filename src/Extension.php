<?php
/**
 * VisualEditorConnector Extension for BlueSpice
 *
 * Provides a visual editor widget for various form fields.
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, version 3.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along
 * with this program; if not, write to the Free Software Foundation, Inc.,
 * 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301, USA.
 *
 * This file is part of BlueSpice MediaWiki
 * For further information visit https://bluespice.com
 *
 * @author     Markus Glaser
 * @subpackage VisualEditorConnector
 * @copyright  Copyright (C) 2018 Hallo Welt! GmbH, All rights reserved.
 * @license    http://www.gnu.org/copyleft/gpl.html GPL-3.0-only
 * @filesource
 */
namespace BlueSpice\VisualEditorConnector;

class Extension extends \BlueSpice\Extension {
	public static function onRegistration() {
		if ( isset( $GLOBALS[ 'wgVisualEditorPreloadModules' ] ) ) {
			$GLOBALS[ 'wgVisualEditorPreloadModules' ][] = "ext.bluespice.visualEditorConnector";
			$GLOBALS[ 'wgVisualEditorPreloadModules' ][] = "ext.bluespice.visualEditorConnector.tags";
			$GLOBALS[ 'wgVisualEditorPreloadModules' ][] = "ext.bluespice.visualEditorConnector.softHyphen";
			$GLOBALS[ 'wgVisualEditorPreloadModules' ][] = "ext.bluespice.visualEditorConnector.lineBreak";
			$GLOBALS[ 'wgVisualEditorPreloadModules' ][] = "ext.bluespice.visualEditorConnector.styleInspector";
			$GLOBALS[ 'wgVisualEditorPreloadModules' ][] = "ext.bluespice.visualEditorConnector.textAlignment";
			$GLOBALS[ 'wgVisualEditorPreloadModules' ][] = "ext.bluespice.visualEditorConnector.textIndentation";
			$GLOBALS[ 'wgVisualEditorPreloadModules' ][] = "ext.bluespice.visualEditorConnector.internalLink";
		}
	}
}
