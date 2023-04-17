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
add_action( 'admin_enqueue_scripts', 'enqueue_bootstrap_styles' );

function load_scripts() {

    wp_enqueue_style('font-awesome-4-7', 'https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css');
    wp_enqueue_style('semantic-ui', 'https://cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css');
    wp_enqueue_style('fontisto', 'https://cdn.jsdelivr.net/npm/fontisto@v3.0.4/css/fontisto/fontisto.min.css');
    wp_enqueue_style('primereact', 'https://cdnjs.cloudflare.com/ajax/libs/primereact/9.2.0/resources/primereact.min.css');
    wp_enqueue_style('primereact-themes', 'https://cdnjs.cloudflare.com/ajax/libs/primereact/9.2.0/resources/themes/nova-light/theme.min.css');

    wp_enqueue_script(
        'wp-seerbit-merchants',
        SEERBIT_MERCHANTS_PLUGIN_URL . 'dist/bundle.js',
        ['wp-element'],
        SEERBIT_MERCHANTS_PLUGIN_VERSION,
        true
    );

    wp_enqueue_script(
        'seerbit-api',
        'https://checkout.seerbitapi.com/api/v2/seerbit.js',
        [],
        null,
        true
    );

    wp_localize_script(
        'wp-seerbit-merchants',
        'localizer', [
            'apiUrl' => home_url('/wp-json'),
            'nonce' => wp_create_nonce('wp_rest'),
            'url' => SEERBIT_MERCHANTS_PLUGIN_URL,
            'dir' => SEERBIT_MERCHANTS_PLUGIN_PATH,
            'path_url' => esc_attr( get_admin_url( null, 'admin.php?page=seerbit-merchants' ) )
        ]);
}

function enqueue_bootstrap_styles(){
    wp_enqueue_style('bootstrap_css', 'https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/css/bootstrap.css');
}

require_once SEERBIT_MERCHANTS_PLUGIN_PATH  . 'classes/class-create-admin-page.php';
