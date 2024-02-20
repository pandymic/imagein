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
      $response = (object)[ 'code' => 200, 'payload' => (object)[ 'path' => $filename ] ];
    } else if ( move_uploaded_file( $_FILES['file']['tmp_name'], __DIR__ . '/' . $filename ) ) {
      $response = (object)[ 'code' => 201, 'payload' => (object)[ 'path' => $filename ] ];
    }
  }

  http_response_code( $response->code  );
  header( 'Content-Type: application/json' );
  print json_encode( $response->payload );

}