<?php

/**
 *
 * @since             1.0.0
 * @package           SeerBit
 * @author            Shadrach Odekhiran
 *
 * @wordpress-plugin
 * Plugin Name:       SeerBit
 * Plugin URI:        https://www.seerbit.com/
 * Description:       SeerBit is a WordPress plugin that allows merchants to manage their SeerBit account.
 * Version:           1.0.0
 * Author:            Shadrach Odekhiran
 * Author URI:        http://shadrachodek.com/
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       seerbit
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Plugin Constants.
 */
define( 'SEERBIT_PLUGIN_PATH', trailingslashit( plugin_dir_path(__FILE__ ) ) );
define( 'SEERBIT_PLUGIN_URL', trailingslashit( plugins_url( '/', __FILE__ ) ) );
const SEERBIT_PLUGIN_VERSION = '1.0.0';

/**
 * Loading Necessary Scripts.
 */

add_action( 'admin_enqueue_scripts', 'load_scripts' );

function load_scripts() {

    wp_enqueue_style('font-awesome-4-7', 'https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css');
    wp_enqueue_style('semantic-ui', 'https://cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css');
    wp_enqueue_style('fontisto', 'https://cdn.jsdelivr.net/npm/fontisto@v3.0.4/css/fontisto/fontisto.min.css');
    wp_enqueue_style('primereact', 'https://cdnjs.cloudflare.com/ajax/libs/primereact/4.2.2/resources/primereact.min.css');
    wp_enqueue_style('primereact-themes', 'https://cdnjs.cloudflare.com/ajax/libs/primereact/4.2.2/resources/themes/nova-light/theme.min.css');

    wp_enqueue_script(
        'wp-seerbit',
        SEERBIT_PLUGIN_URL . "assets/js/seerbit.js",
        ['jquery', 'wp-element'],
        SEERBIT_PLUGIN_VERSION,
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
        'wp-seerbit',
        'localizer', [
            'apiUrl' => home_url('/wp-json'),
            'nonce' => wp_create_nonce('wp_rest'),
            'url' => SEERBIT_PLUGIN_URL,
            'dir' => SEERBIT_PLUGIN_PATH,
            'path_url' => esc_attr( get_admin_url( null, 'admin.php?page=seerbit' ) )
        ]);
}



require_once SEERBIT_PLUGIN_PATH  . 'classes/class-create-admin-page.php';
