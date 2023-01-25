<?php

/**
 * The admin-specific functionality of the plugin.
 *
 * @link       https://www.seerbit.com
 * @since      1.0.0
 *
 * @package    Seerbit_Merchants
 * @subpackage Seerbit_Merchants/admin
 */

/**
 * The admin-specific functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the admin-specific stylesheet and JavaScript.
 *
 * @package    Seerbit_Merchants
 * @subpackage Seerbit_Merchants/admin
 * @author     Shadrach Odekhiran <shadrach.odekhiran@gmail.com>
 */
class Create_Admin_Page {

	public function __construct( ) {
		add_action('admin_menu', [ $this, 'create_menu' ]);
	}

    public function create_menu() {
        $capability = 'manage_options';
        $slug = 'seerbit-merchants';

        add_menu_page(
            __('Seerbit Merchants', 'seerbit_merchants'),
            __('Seerbit Merchants', 'seerbit_merchants'),
            $capability,
            $slug,
            [ $this, 'menu_page_template' ],
            'dashicons-buddicons-replies'
        );
    }

    public function menu_page_template() {
        echo '<div class="wrap"><div id="root"></div></div>';
    }


}

new Create_Admin_Page();
