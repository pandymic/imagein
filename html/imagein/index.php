<?php

$imagein_conf = include __DIR__ . '/../../etc/imagein.conf';

$imagein_script_url = $imagein_conf->baseUrl . 'imagein.js?baseUrl=' . htmlspecialchars( $imagein_conf->baseUrl ) . '&css=' . htmlspecialchars( $imagein_conf->cssString );

?>
<html>

<head>

<title>Imagein File Dropper</title>

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

<div contentEditable>
  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer sem risus, imperdiet auctor facilisis malesuada, tincidunt eu dolor. Donec rhoncus erat a arcu placerat vehicula. Nullam sed sem nec magna congue tristique a eu enim. Etiam pretium orci quam, sit amet pellentesque lorem vulputate quis. Nam elementum neque at erat mattis venenatis. Sed metus sapien, elementum ac rhoncus eu, consequat in enim. Donec dictum ipsum ut blandit ultricies.</p>
  <p>&nbsp;</p>
  <p>In vel ligula nec sem venenatis eleifend id non diam. In et ligula ac lectus dignissim placerat ut aliquam est. Ut efficitur facilisis sem sit amet suscipit. Curabitur ac erat quam. Fusce scelerisque a enim a feugiat. Duis dui velit, eleifend vitae placerat ut, tristique at nulla. Aliquam pellentesque, orci nec luctus elementum, massa metus posuere nisl, non pulvinar lacus quam in diam. Phasellus ac consectetur orci, vel malesuada ipsum.</p>
</div>

<hr>
<pre>
javascript:(function(a){const b = a.createElement( 'SCRIPT' ); b.src = '<?php print $imagein_script_url; ?>'; document.body.appendChild(b) })(document)
</pre>
<?php /* <button onclick="javascript:(function(a){const b = a.createElement( 'SCRIPT' ); b.src = '<?php print $imagein_script_url; ?>&_' + Date.now(); document.body.appendChild(b) })(document)">Insert Image</button> */ ?>

</body>

</html>