<?php

$imagein_conf = include __DIR__ . '/../../etc/imagein.conf';

$imagein_drop_style = base64_encode( file_get_contents( __DIR__ . '/drop.css' ) );

$imagein_drop_script = str_replace( 'searchParams:Object.fromEntries(new URL(document.currentScript.src).searchParams)', 'searchParams:' . json_encode( (object)[ 'baseUrl' => $imagein_conf->baseUrl, 'css' => $imagein_drop_style ] ), file_get_contents( __DIR__ . '/drop.js' ) );
$imagein_drop_script_url = $imagein_conf->baseUrl . 'drop.js?baseUrl=' . htmlspecialchars( $imagein_conf->baseUrl ) . '&css=' . htmlspecialchars( $imagein_drop_style );

?>
<html>

<head>

<title>Imagein File Drop</title>

<link rel="stylesheet" href="./style.css">
<script src="script.js"></script>

</head>

<body>

<h1>Imagein File Drop Sandbox &amp; Bookmarklet</h1>

<h2>Test Area</h2>
<h3>ContentEditable Div</h3>
<div contentEditable>
  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer sem risus, imperdiet auctor facilisis malesuada, tincidunt eu dolor. Nullam sed sem nec magna congue tristique a eu enim. Etiam pretium orci quam, sit amet pellentesque lorem vulputate quis. Nam elementum neque at erat mattis venenatis. Sed metus sapien, elementum ac rhoncus eu, consequat in enim. Donec dictum ipsum ut blandit ultricies.</p>
  <p>Donec rhoncus erat a arcu placerat vehicula.</p>
  <p>In vel ligula nec sem venenatis eleifend id non diam. In et ligula ac lectus dignissim placerat ut aliquam est. Ut efficitur facilisis sem sit amet suscipit. Curabitur ac erat quam. Fusce scelerisque a enim a feugiat. Duis dui velit, eleifend vitae placerat ut, tristique at nulla. Aliquam pellentesque, orci nec luctus elementum, massa metus posuere nisl, non pulvinar lacus quam in diam. Phasellus ac consectetur orci, vel malesuada ipsum.</p>
</div>
<h3>Form Textarea Field</h3>
<div><textarea rows="8">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer sem risus, imperdiet auctor facilisis malesuada, tincidunt eu dolor. Donec rhoncus erat a arcu placerat vehicula.

Donec rhoncus erat a arcu placerat vehicula.

Nullam sed sem nec magna congue tristique a eu enim. Etiam pretium orci quam, sit amet pellentesque lorem vulputate quis. Nam elementum neque at erat mattis venenatis. Sed metus sapien, elementum ac rhoncus eu, consequat in enim. Donec dictum ipsum ut blandit ultricies.</textarea></div>
<h3>Form Text Field</h3>
<div><input type="text" value="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer sem risus."></div>

<hr>
<h2>Bookmarklets</h2>
<h3>Script Loader</h3>
<pre>
javascript:(a=>{const b=a.createElement("SCRIPT");b.src="<?php print $imagein_drop_script_url; ?>&_"+Date.now();document.body.appendChild(b)})(document);
</pre>
<h3>Inline Script</h3>
<pre>
javascript:<?php print $imagein_drop_script; ?>
</pre>

</body>

</html>