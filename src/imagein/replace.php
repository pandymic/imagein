<?php

$imagein_conf = include __DIR__ . '/../../etc/imagein.conf';

$imagein_test_url = $imagein_conf->baseUrl . $imagein_conf->testFile;
$imagein_replace_script = str_replace( ',/ /);', ',/^' . preg_quote( $imagein_conf->baseUrl . 'file/', '/' ) . '[a-fA-F0-9]+' . preg_quote( '.webp', '/' ) . '$/);', file_get_contents( __DIR__ . '/replace.js' ) );

?>
<html>

<head>

<title>Imagein File Replace</title>

<link rel="stylesheet" href="./style.css">
<script src="script.js"></script>

</head>

<body>

<h1>Imagein File Replace Sandbox &amp; Bookmarklet</h1>
<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer sem risus, imperdiet auctor facilisis malesuada, tincidunt eu dolor. Donec rhoncus erat a arcu placerat vehicula. Nullam sed sem nec magna congue tristique a eu enim. Etiam pretium orci quam, sit amet pellentesque lorem vulputate quis. Nam elementum neque at erat mattis venenatis. Sed metus sapien, elementum ac rhoncus eu, consequat in enim. Donec dictum ipsum ut blandit ultricies.</p>
<p><a href="<?php print htmlspecialchars( $imagein_test_url ); ?>"><?php print $imagein_test_url; ?></a></p>
<p>In vel ligula nec sem venenatis eleifend id non diam. In et ligula ac lectus dignissim placerat ut aliquam est. Ut efficitur facilisis sem sit amet suscipit. Curabitur ac erat quam. Fusce scelerisque a enim a feugiat. Duis dui velit, eleifend vitae placerat ut, tristique at nulla. Aliquam pellentesque, orci nec luctus elementum, massa metus posuere nisl, non pulvinar lacus quam in diam. Phasellus ac consectetur orci, vel malesuada ipsum.</p>

<div><button onclick="javascript:<?php print htmlentities( $imagein_replace_script ); ?>">Run!</button></div>

<hr>

<pre>
javascript:<?php print htmlentities( $imagein_replace_script ); ?>
</pre>

</body>

</html>