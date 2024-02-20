<html>

<head>

<title>Imagein File Replace</title>

<style>

body {
  font-family: sans-serif;
}

h1 {
  font-size: 2rem;
}

div {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

div a {
  display: block;
  aspect-ratio: 1 / 1;
  flex: min( 256px, 5vw ) 1 1;
  min-width: 256px;
  max-height: max( 512px, 10vw );
  overflow: hidden;
}

div a img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none;
}

</style>

</head>

<body>

<h1>Imagein File Drop &amp; Replace</h1>
<p></p>

<h2>Documentation</h2>
<ul>
  <li><a href="./drop.php">Imagein File Drop Sandbox &amp; Bookmarklet</a></li>
  <li><a href="./replace.php">Imagein File Replace Sandbox &amp; Bookmarklet</a></li>
</ul>

<h2>Gallery</h2>
<p>Click to copy URL.</p>
<div><?php

$files = glob( __DIR__ . '/file/*.webp' );
if ( is_array( $files ) ) {
  foreach( $files as $file ) {
    
    $href = 'file/' . basename( $file, '.webp' ) . '.webp';
    $src = 'data:image/webp;base64,' . base64_encode( file_get_contents( __DIR__ . '/' . $href ) );
    
    print '<a href="' . htmlspecialchars( $href ) . '" title="' . basename( $file ) . '"><img src="' . $src . '"></a>';
  }
}

?></div>

<script>

document.addEventListener( 'DOMContentLoaded', ( e ) => {
  
  document.querySelectorAll( 'div > a' ).forEach( ( link ) => {
    
    link.addEventListener( 'click', ( e ) => {
      e.preventDefault();
      window.navigator.clipboard.writeText( e.target.href );
    } );
    
  } );
  
} );

</script>

</body>

</html