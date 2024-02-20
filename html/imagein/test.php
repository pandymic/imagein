<?php

$imagein_conf = include __DIR__ . '/../../etc/imagein.conf';

$imagein_test_url = $imagein_conf->baseUrl . $imagein_conf->testFile;
$imagein_test_preg = '/^' . preg_quote( $imagein_conf->baseUrl . 'file/', '/' ) . '[a-fA-F0-9]+' . preg_quote( '.webp', '/' ) . '$/';

?>
<html>

<head>

<title>Pandymic Imagein File Replacer</title>

<style>

body {
  font-family: sans-serif;
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

<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer sem risus, imperdiet auctor facilisis malesuada, tincidunt eu dolor. Donec rhoncus erat a arcu placerat vehicula. Nullam sed sem nec magna congue tristique a eu enim. Etiam pretium orci quam, sit amet pellentesque lorem vulputate quis. Nam elementum neque at erat mattis venenatis. Sed metus sapien, elementum ac rhoncus eu, consequat in enim. Donec dictum ipsum ut blandit ultricies.</p>
<p><a href="<?php print htmlspecialchars( $imagein_test_url ); ?>"><?php print $imagein_test_url; ?></a></p>
<p>In vel ligula nec sem venenatis eleifend id non diam. In et ligula ac lectus dignissim placerat ut aliquam est. Ut efficitur facilisis sem sit amet suscipit. Curabitur ac erat quam. Fusce scelerisque a enim a feugiat. Duis dui velit, eleifend vitae placerat ut, tristique at nulla. Aliquam pellentesque, orci nec luctus elementum, massa metus posuere nisl, non pulvinar lacus quam in diam. Phasellus ac consectetur orci, vel malesuada ipsum.</p>

<hr>

<pre style="white-space:wrap;">
javascript:(function(a){for(var i = 0; i &lt; a.length; i++) {if ( a[i].textContent.match(&lt;?php print $imagein_test_preg; ?&gt;) ) {a[i].dataset.originalText = a[i].textContent;a[i].innerHTML = '&lt;img src=&quot;' + encodeURI( a[i].textContent ) + '&quot; style=&quot;width:100%;height:auto;max-width:100%&quot;&gt;';}}})(document.getElementsByTagName('*'));
</pre>

<div><button onclick="javascript:(function(a){for(var i = 0; i < a.length; i++) {if ( a[i].textContent.match(<?php print $imagein_test_preg; ?>) ) {a[i].dataset.originalText = a[i].textContent;a[i].innerHTML = '<img src=&quot;' + encodeURI( a[i].textContent ) + '&quot; style=&quot;width:100%;height:auto;max-width:100%&quot;>';}}})(document.getElementsByTagName('*'));">Run!</button></div>

</body>

</html>