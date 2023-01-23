<?php

/**
 *
 * @since             1.0.0
 * @package           Seerbit_Merchants
 * @author            Shadrach Odekhiran
 *
 * @wordpress-plugin
 * Plugin Name:       WordPress Seerbit Merchants Plugin
 * Plugin URI:        https://www.seerbit.com/seerbit-merchants-uri/
 * Description:       Seerbit merchants account manager.
 * Version:           1.0.0
 * Author:            Shadrach Odekhiran
 * Author URI:        http://shadrachodek.com/
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       seerbit-merchants
 * Domain Path:       /languages
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Bootstrap the plugin.
 */
//require_once 'vendor/autoload.php';

/**
 * Plugin Constants.
 */
define( 'SEERBIT_MERCHANTS_PLUGIN_PATH', trailingslashit( plugin_dir_path(__FILE__ ) ) );
define( 'SEERBIT_MERCHANTS_PLUGIN_URL', trailingslashit( plugins_url( '/', __FILE__ ) ) );
const SEERBIT_MERCHANTS_PLUGIN_VERSION = '1.0.0';

/**
 * Loading Necessary Scripts.
 */

add_action( 'admin_enqueue_scripts', 'load_scripts' );

function load_scripts() {
    wp_enqueue_script(
        'wp-seerbit-merchants',
        SEERBIT_MERCHANTS_PLUGIN_URL . 'dist/bundle.js',
        ['jquery', 'wp-element'],
        SEERBIT_MERCHANTS_PLUGIN_VERSION,
        true
    );

    wp_localize_script(
        'wp-seerbit-merchants',
        'localizer', [
            'apiUrl' => home_url('/wp-json'),
            'nonce' => wp_create_nonce('wp_rest'),
        ]);
}

require_once SEERBIT_MERCHANTS_PLUGIN_PATH  . 'classes/class-create-admin-page.php';
