<?php

$imagein_conf = include __DIR__ . '/../../etc/imagein.conf';

$imagein_script_url = $imagein_conf->baseUrl . 'imagein.js?baseUrl=' . htmlspecialchars( $imagein_conf->baseUrl ) . '&css=' . htmlspecialchars( $imagein_conf->cssString );
$imagein_script_embed = preg_replace( '/[\r\n]+/', '', preg_replace( '/console\.(log|dir)\(.*/', '', preg_replace( '/\/\/.*/', '', preg_replace( '/^\s+/', '', file_get_contents( __DIR__ . '/imagein.js' ) ) ) ) );
$imagein_script_embed = str_replace( 'searchParams: Object.fromEntries( new URL( document.currentScript.src ).searchParams )', 'searchParams: ' . json_encode( (object)[ 'baseUrl' => $imagein_conf->baseUrl, 'css' => $imagein_conf->cssString ] ), $imagein_script_embed );

?>
<html>

<head>

<title>Imagein File Drop</title>

<style>

body {
  font-family: sans-serif;
}

div[contentEditable] {
  
  padding: 15px;
  border: 1px solid #efefef;
  
}

pre {
  
  padding: 15px;
  border: 1px solid #ccc;
  background-color: #efefef;
  
  font-family: monospace;
  white-space: wrap;
}

</style>

</head>

<body>

<h1>Imagein File Drop Sandbox &amp; Bookmarklet</h1>
<div contentEditable>
  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer sem risus, imperdiet auctor facilisis malesuada, tincidunt eu dolor. Donec rhoncus erat a arcu placerat vehicula. Nullam sed sem nec magna congue tristique a eu enim. Etiam pretium orci quam, sit amet pellentesque lorem vulputate quis. Nam elementum neque at erat mattis venenatis. Sed metus sapien, elementum ac rhoncus eu, consequat in enim. Donec dictum ipsum ut blandit ultricies.</p>
  <p>&nbsp;</p>
  <p>In vel ligula nec sem venenatis eleifend id non diam. In et ligula ac lectus dignissim placerat ut aliquam est. Ut efficitur facilisis sem sit amet suscipit. Curabitur ac erat quam. Fusce scelerisque a enim a feugiat. Duis dui velit, eleifend vitae placerat ut, tristique at nulla. Aliquam pellentesque, orci nec luctus elementum, massa metus posuere nisl, non pulvinar lacus quam in diam. Phasellus ac consectetur orci, vel malesuada ipsum.</p>
</div>

<hr>
<pre>
javascript:(function(a){const b = a.createElement( 'SCRIPT' ); b.src = '<?php print $imagein_script_url; ?>&_' + Date.now(); document.body.appendChild(b) })(document);
</pre>
<pre>
javascript:<?php print $imagein_script_embed; ?>
</pre>

</body>

</html>