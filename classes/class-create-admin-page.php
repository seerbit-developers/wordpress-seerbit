<?php

/**
 *
 * @link       https://www.seerbit.com
 * @since      1.0.0
 *
 */

/**
 *
 * @package    SeerBit
 * @author     Shadrach Odekhiran <shadrach.odekhiran@gmail.com>
 */
class Create_Admin_Page {

	public function __construct( ) {
		add_action('admin_menu', [ $this, 'create_menu' ]);
	}

    public function create_menu() {
        $capability = 'manage_options';
        $slug = 'seerbit';

        add_menu_page(
            __('SeerBit', 'seerbit'),
            __('SeerBit', 'seerbit'),
            $capability,
            $slug,
            [ $this, 'menu_page_template' ],
            'dashicons-welcome-widgets-menus'
        );
    }

    public function menu_page_template() {
        echo '<div class="wrap">
                <div id="root"></div>
                <div id="app-modal"></div>
             </div>';
    }


}

new Create_Admin_Page();
