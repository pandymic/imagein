This is an ambitious pet project. Javascript is a bit of a mess since it's mostly just a proof-of-concept. Inspired by a terrible project management system whose comment/discussion functionality doesn't support embedding images or media of any sort. This allows users to drop-in hyperlinks to uploaded images when creating comments. Then convert those hyperlinks to `<img>` tags when viewing the content in the future. Currently all client-side functionality is handled using Bookmarklets, but this can be rolled into a browser extension if it proves useful.

The purpose of this script is two-fold.

## File Dropper

A universal file upload script. Supports Drag-and-drop as well as Copy-and-paste functionality. Images are automatically scaled and optimized to webp client-side before being uploaded to the server. Images are named with the md5 hash of their binary contents. This provides a convenient pattern to match against in the File Replacer function. It also provides a (slight) measure of protection against duplicate images.

The dropper opens a `<dialog>` modal over the page. After an image is successfully uploaded to the server its absolute URL is returned and dropped into the browser at the current cursor position. Either inserts at the caret or replaces the curren selection.

### Assumptions & Notes

* For privacy the github repo does not include any URL's or paths to the actual production environment. Instead, all of these values are stored server-side in a configuration file called `imagein.conf`. It's assumed that the file is a valid PHP script with a return statement on its last line. It lives in the folder `/etc` relative to the project directory (i.e. `../../etc` relative to the web root.)
* The base URL as well as the CSS string in the bookmarklet below are generated server-side for conveninence. See `index.php` in the web root.

### Bookmarklet
<pre>
javascript:(function(a){const b = a.createElement( 'SCRIPT' ); b.src = '<i>[project-base-url]</i>/imagein.js?baseUrl=<i>[project-base-url]</i>&css=LnBhbmR5bWljLWltYWdlaW4geyAgcG9zaXRpb246IHJlbGF0aXZlOyAgYmFja2dyb3VuZC1jb2xvcjogI2ZmZjsgIGNvbG9yOiAjNjY2OyAgd2lkdGg6IDUxMnB4OyAgaGVpZ2h0OiA1MTJweDsgIGJvcmRlci1yYWRpdXM6NjBweDsgIHRyYW5zaXRpb246IG9wYWNpdHkgMzc1bXMgZWFzZS1vdXQsIHNjYWxlIDI1MG1zIGVhc2Utb3V0IDEyNW1zO30ucGFuZHltaWMtaW1hZ2Vpbjo6YmFja2Ryb3AgeyAgYmFja2dyb3VuZC1jb2xvcjogIzAwMDsgIG9wYWNpdHk6IDAuODU7fS5wYW5keW1pYy1pbWFnZWluOmJlZm9yZSB7ICBjb250ZW50OiAnJzsgIHBvc2l0aW9uOiBhYnNvbHV0ZTsgIHRvcDogMTBweDsgIHJpZ2h0OiAxMHB4OyAgYm90dG9tOiAxMHB4OyAgbGVmdDogMTBweDsgIGJvcmRlcjogNXB4IGRhc2hlZCBjdXJyZW50Y29sb3I7ICBib3JkZXItcmFkaXVzOiA1MHB4fS5wYW5keW1pYy1pbWFnZWluOmFmdGVyIHsgIGNvbnRlbnQ6ICdEcmFnIGZpbGUgaGVyZS4nOyAgdGV4dC1hbGlnbjogY2VudGVyOyAgcG9zaXRpb246IGFic29sdXRlOyAgdG9wOiA1MCU7ICBsZWZ0OiA1MCU7ICBtYXgtd2lkdGg6IDc1dnc7ICB0cmFuc2xhdGU6IC01MCUgLTUwJTsgIGNvbG9yOiBjdXJyZW50Y29sb3I7ICBmb250LWZhbWlseTogbW9ub3NwYWNlOyAgZm9udC1zaXplOiA1dmh9LnBhbmR5bWljLWltYWdlaW4ucGFuZHltaWMtaW1hZ2Vpbi1kcmFnOmFmdGVyIHsgIGNvbnRlbnQ6ICdEcm9wIGZpbGUhJ30ucGFuZHltaWMtaW1hZ2Vpbi5wYW5keW1pYy1pbWFnZWluLWVycm9yIHsgIGNvbG9yOiAjYzMwfS5wYW5keW1pYy1pbWFnZWluLnBhbmR5bWljLWltYWdlaW4tZHJhZyB7ICBjb2xvcjogIzA2Y30ucGFuZHltaWMtaW1hZ2Vpbi5wYW5keW1pYy1pbWFnZWluLXN1Y2Nlc3MgeyAgcG9pbnRlci1ldmVudHM6IG5vbmU7ICBjb2xvcjogIzBjM30ucGFuZHltaWMtaW1hZ2Vpbjpub3QoW2RhdGEtcGFuZHltaWMtaW1hZ2Vpbi1tZXNzYWdlPSIiXSk6YWZ0ZXIgeyAgY29udGVudDogYXR0ciggZGF0YS1wYW5keW1pYy1pbWFnZWluLW1lc3NhZ2UgKSAhaW1wb3J0YW50fQ=='; document.body.appendChild(b) })(document)
</pre>

## File Replacer

This is a simple bookmarklet that finds the matching file absolute URL and replaces it with an `<img>` tag that loads the source image directly on the page. Currently only supports anchor tags whose textContent matches the URL pattern exactly.

### Assumptions & Notes

* For privacy the github repo does not include any URL's or paths to the actual production environment. Instead, all of these values are stored server-side in a configuration file called `imagein.conf`. It's assumed that the file is a valid PHP script with a return statement on its last line. It lives in the folder `/etc` relative to the project directory (i.e. `../../etc` relative to the web root.)
* The base URL as well as its regular expression escaped variant in the bookmarklet below are generated server-side for conveninence. See `test.php` in the web root.

### Bookmarklet
<pre>
javascript:(function(a){for(var i = 0; i < a.length; i++) {if ( 'A' === a[i].nodeName && 1 === a[i].childNodes.length && a[i].childNodes[0].nodeType === 3 && a[i].childNodes[0].nodeValue.match(/^<i>[project-base-url-preg-escaped]</i>file\/[a-fA-F0-9]+\.webp$/) ) {a[i].target = '_blank'; a[i].dataset.originalText = a[i].childNodes[0].nodeValue;a[i].innerHTML = '&lt;img src="' + encodeURI( a[i].childNodes[0].nodeValue ) + '" style="width:100%;height:auto;max-width:100%"&gt;';}}})(document.getElementsByTagName('*'));
</pre>
