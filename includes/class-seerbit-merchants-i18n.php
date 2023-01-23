<?php

/**
 * Define the internationalization functionality
 *
 * Loads and defines the internationalization files for this plugin
 * so that it is ready for translation.
 *
 * @link       https://www.seerbit.com
 * @since      1.0.0
 *
 * @package    Seerbit_Merchants
 * @subpackage Seerbit_Merchants/includes
 */

/**
 * Define the internationalization functionality.
 *
 * Loads and defines the internationalization files for this plugin
 * so that it is ready for translation.
 *
 * @since      1.0.0
 * @package    Seerbit_Merchants
 * @subpackage Seerbit_Merchants/includes
 * @author     Shadrach Odekhiran <shadrach.odekhiran@gmail.com>
 */
class Seerbit_Merchants_i18n {


	/**
	 * Load the plugin text domain for translation.
	 *
	 * @since    1.0.0
	 */
	public function load_plugin_textdomain() {

		load_plugin_textdomain(
			'seerbit-merchants',
			false,
			dirname( dirname( plugin_basename( __FILE__ ) ) ) . '/languages/'
		);

	}



}
