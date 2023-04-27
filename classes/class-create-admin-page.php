<?php

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}


class Create_Admin_Page {

	public function __construct( ) {
		add_action('admin_menu', [ $this, 'create_menu' ]);
	}

    public function create_menu() {
        $capability = 'manage_options';
        $slug = 'seerbit-merchants';

        add_menu_page(
            __('Seerbit Merchants', 'seerbit'),
            __('Seerbit Merchants', 'seerbit'),
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
