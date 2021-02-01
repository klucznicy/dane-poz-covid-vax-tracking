<?php
/**
 * Spreadsheet field
 *
 * @package     spreadhseet-field
 * @author      Łukasz Garczewski
 * @copyright   2020 Łukasz Garczewski
 * @license     GPL-3.0-or-later
 *
 * @wordpress-plugin
 * Plugin Name: Spreadsheet field
 * Plugin URI:
 * Description:
 * Version: 0.1
 * Author: Łukasz Garczewski
 * Author URI:
 * Text Domain: spreadhseet-field
 * Domain Path: /languages
 * License: GPL v3 or later
 * License URI: https://www.gnu.org/licenses/gpl-3.0.txt
 */

add_filter( 'the_content', 'lu_substitute_tag', 1 );
function lu_substitute_tag( string $content ) {
  $cache_key = 'klucznicy_spreadsheet_field';
  $fields = array(
    0 => array(
      'name' => 'spreadsheet_field'
    ),
    1 => array(
      'name' => 'spreadsheet_last_data',
      'processor' => 'process_last_data_date'
    ),
    2 => array(
      'name' => 'spreadsheet_total_vaxers'
    )
  );

  $result = wp_cache_get( $cache_key );

  if ( empty( $result ) ) {
    $url = 'https://docs.google.com/spreadsheets/d/1RQAg-gqb8MfzXF30QC9CCAVpWF5U5YkL8gnnq54q4C8/htmlembed?single=true&gid=1720779961&range=B2:B4&widget=false&chrome=false&headers=false';
    $response = wp_remote_get( $url );

    if ( !is_array( $response ) || is_wp_error( $response ) ) {
      return $content;
    }

    $body    = $response['body']; // use the content

    preg_match_all( '/<td class=\"s[0-9]+\"[ ="a-z]*>([-0-9a-z ]+)<\/td>/', $body, $result );

    wp_cache_set( $cache_key, $result, '' /* group */, 60 * 60 );
  }

  //@TODO: convert this to a shortcode
  foreach ( $fields as $i => $needle ) {
    $replacement = $result[1][$i];

    if ( isset( $needle['processor'] ) && function_exists( $needle['processor'] ) ) {
      $replacement = $needle['processor']( $replacement );
    }

    $content = str_replace( $needle['name'], $replacement, $content );
  }

  return $content;
}

function process_last_data_date( $date ) {
  return wp_date(
    get_option( 'date_format' ),
    strtotime( $date )
  );
}
