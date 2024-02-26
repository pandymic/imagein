<html>

<head>

<title>Imagein File Replace</title>

<link rel="stylesheet" href="./style.css">
<script src="script.js"></script>

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
<figure><?php

$files = glob( __DIR__ . '/file/*.webp' );
if ( is_array( $files ) ) {
  foreach( $files as $file ) {
    
    $href = 'file/' . basename( $file, '.webp' ) . '.webp';
    $src = 'data:image/webp;base64,' . base64_encode( file_get_contents( __DIR__ . '/' . $href ) );
    
    print '<a href="' . htmlspecialchars( $href ) . '" title="' . basename( $file ) . '"><img src="' . $src . '"></a>';
  }
}

?></figure>

</body>

</html