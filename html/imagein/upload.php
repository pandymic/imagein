<?php

/**
 * Please note that this is a very rudimentary file upload handler.
 * This data should go through thorough validation and sanitization 
 * before it is used in production.
 */

if ( !empty( $_POST['name'] ) && !empty( $_FILES ) ) {

  $response = (object)[ 'code' => 400, 'payload' => 'Error' ];
  
  if ( !empty( $_FILES['file'] ) && is_array( $_FILES['file'] ) && 0 === $_FILES['file']['error'] ) {
    $filename = 'file/' . md5_file( $_FILES['file']['tmp_name'] ) . '.webp';
    if ( file_exists( __DIR__ . '/' . $filename ) ) {
      $response = (object)[ 'code' => 200, 'payload' => (object)[ 'path' => $filename, 'base64' => 'data:image/png;base64,' . base64_encode( file_get_contents( __DIR__ . '/' . $filename ) ) ] ];
    } else if ( move_uploaded_file( $_FILES['file']['tmp_name'], __DIR__ . '/' . $filename ) ) {
      $response = (object)[ 'code' => 201, 'payload' => (object)[ 'path' => $filename, 'base64' => 'data:image/png;base64,' . base64_encode( file_get_contents( __DIR__ . '/' . $filename ) ) ] ];
    }
  }

  http_response_code( $response->code  );
  header( 'Content-Type: application/json' );
  header( 'Access-Control-Allow-Origin: ' . $_SERVER['HTTP_ORIGIN'] );
  header( 'Access-Control-Allow-Credentials: true' );
  print json_encode( $response->payload );

}