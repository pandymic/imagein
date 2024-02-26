This is an ambitious pet project. Javascript is a bit of a mess since it's mostly just a proof-of-concept. Inspired by a terrible project management system whose comment/discussion functionality doesn't support embedding images or media of any sort.

The purpose of this script is two-fold.

1. The *File Dropper* component allows users to drop-in hyperlinks to uploaded images when creating comments. 
2. The *File Replacer* component converts those hyperlinks to `<img>` tags when viewing the content in the future.

Currently all client-side functionality is handled using Bookmarklets, but this can be rolled into a browser extension if it proves useful.

## File Dropper

A universal file upload script. Supports Drag-and-drop as well as Copy-and-paste functionality. Images are automatically scaled and optimized to webp client-side before being uploaded to the server. Images are named with the md5 hash of their binary contents. This provides a convenient pattern to match against in the File Replacer function. It also provides a (slight) measure of protection against duplicate images.

The dropper opens a `<dialog>` modal over the page. After an image is successfully uploaded to the server its absolute URL is returned and dropped into the browser at the current cursor position. Either inserts at the caret or replaces the curren selection.

### Assumptions & Notes

* For privacy the github repo does not include any URL's or paths to the actual production environment. Instead, all of these values are stored server-side in a configuration file called `imagein.conf`. It's assumed that the file is a valid PHP script with a return statement on its last line. It lives in the folder `/etc` relative to the project directory (i.e. `../../etc` relative to the web root.)
* The base URL as well as the CSS string in the bookmarklet below are generated server-side for conveninence. See `index.php` in the web root.
* An example of this configuration file is as follows
<pre>
&lt;?php

return (object)[
  'baseUrl' => '<i>BASE_URL_TO_APP</i>',
  'testFile' => 'file/' . basename( array_pop( glob( __DIR__ . '/../html/imagein/file/*.webp' ) ), '.webp' ) . '.webp'
];
</pre>

### Bookmarklet

#### Script loader method.
<pre>
javascript:(a=>{const b=a.createElement("SCRIPT");b.src="<i>[base-url-to-app]</i>/drop.js?baseUrl=<i>[base-url-to-app]</i>/&css=LnBhbmR5bWljLWltYWdlaW57cG9zaXRpb246cmVsYXRpdmU7YmFja2dyb3VuZC1jb2xvcjojZmZmO2NvbG9yOiM2NjY7d2lkdGg6NTEycHg7aGVpZ2h0OjUxMnB4O2JvcmRlci1yYWRpdXM6NjBweDt0cmFuc2l0aW9uOm9wYWNpdHkgMzc1bXMgZWFzZS1vdXQsc2NhbGUgMjUwbXMgZWFzZS1vdXQgMTI1bXM7b3ZlcmZsb3c6dmlzaWJsZX0ucGFuZHltaWMtaW1hZ2Vpbjo6YmFja2Ryb3B7YmFja2dyb3VuZC1jb2xvcjojMDAwO29wYWNpdHk6Ljg1fS5wYW5keW1pYy1pbWFnZWluOmJlZm9yZXtjb250ZW50OiIiO3Bvc2l0aW9uOmFic29sdXRlO3RvcDoxMHB4O3JpZ2h0OjEwcHg7Ym90dG9tOjEwcHg7bGVmdDoxMHB4O2JvcmRlcjo1cHggZGFzaGVkIGN1cnJlbnRjb2xvcjtib3JkZXItcmFkaXVzOjUwcHg7dHJhbnNpdGlvbjpzY2FsZSAxMjVtcyBlYXNlLWlufS5wYW5keW1pYy1pbWFnZWluOmFmdGVye2NvbnRlbnQ6IkRyYWcgZmlsZSBoZXJlLiI7cG9zaXRpb246YWJzb2x1dGU7dG9wOjUwJTtsZWZ0OjUwJTttYXgtd2lkdGg6NzV2dzt0cmFuc2xhdGU6LTUwJSAtNTAlO2NvbG9yOmN1cnJlbnRjb2xvcjtmb250LWZhbWlseTptb25vc3BhY2U7Zm9udC1zaXplOjV2aDtsaW5lLWhlaWdodDoxLjE7dGV4dC1hbGlnbjpjZW50ZXJ9LnBhbmR5bWljLWltYWdlaW4ucGFuZHltaWMtaW1hZ2Vpbi1kcmFnOmFmdGVye2NvbnRlbnQ6IkRyb3AgZmlsZSEifS5wYW5keW1pYy1pbWFnZWluLnBhbmR5bWljLWltYWdlaW4tZXJyb3J7Y29sb3I6I2MzMH0ucGFuZHltaWMtaW1hZ2Vpbi5wYW5keW1pYy1pbWFnZWluLWRyYWd7Y29sb3I6IzA2Y30ucGFuZHltaWMtaW1hZ2Vpbi5wYW5keW1pYy1pbWFnZWluLWRyYWc6YmVmb3Jle3NjYWxlOi45NX0ucGFuZHltaWMtaW1hZ2Vpbi5wYW5keW1pYy1pbWFnZWluLXN1Y2Nlc3N7cG9pbnRlci1ldmVudHM6bm9uZTtjb2xvcjojMGMzfS5wYW5keW1pYy1pbWFnZWluOm5vdChbZGF0YS1wYW5keW1pYy1pbWFnZWluLW1lc3NhZ2U9IiJdKTphZnRlcntjb250ZW50OmF0dHIoZGF0YS1wYW5keW1pYy1pbWFnZWluLW1lc3NhZ2UpICFpbXBvcnRhbnR9LnBhbmR5bWljLWltYWdlaW4gYnV0dG9ue2NvbG9yOiM2NjY7cG9zaXRpb246YWJzb2x1dGU7bGVmdDpjYWxjKDUwJSAtIDQwcHgpO2JvdHRvbTotMTIwcHg7YmFja2dyb3VuZC1jb2xvcjojZmZmO2JvcmRlcjowO3dpZHRoOjgwcHg7aGVpZ2h0OjgwcHg7Ym9yZGVyLXJhZGl1czo0MHB4O2N1cnNvcjpwb2ludGVyO3RyYW5zaXRpb246Y29sb3IgMTI1bXMgZWFzZS1pbixzY2FsZSAxMjVtcyBlYXNlLWluO2ZvbnQtc2l6ZTo1MHB4O2Rpc3BsYXk6ZmxleDtqdXN0aWZ5LWNvbnRlbnQ6Y2VudGVyO2FsaWduLWl0ZW1zOmNlbnRlcjtsaW5lLWhlaWdodDoxfS5wYW5keW1pYy1pbWFnZWluIGJ1dHRvbjpob3Zlcntjb2xvcjojMDAwO3NjYWxlOjEuMDV9LnBhbmR5bWljLWltYWdlaW4gYnV0dG9uOmJlZm9yZXtjb250ZW50OiIiO3Bvc2l0aW9uOmFic29sdXRlO3RvcDo1cHg7cmlnaHQ6NXB4O2JvdHRvbTo1cHg7bGVmdDo1cHg7Ym9yZGVyOjVweCBkYXNoZWQgY3VycmVudGNvbG9yO2JvcmRlci1yYWRpdXM6MzVweH0=&_"+Date.now();document.body.appendChild(b)})(document);

</pre>

#### Direct code injection method.
<pre>
javascript:(()=>{window.pandymicImagein=window.pandymicImagein||{config:{css:!1,init:!1,searchParams:{"baseUrl":"<i>[base-url-to-app]</i>","css":"LnBhbmR5bWljLWltYWdlaW57cG9zaXRpb246cmVsYXRpdmU7YmFja2dyb3VuZC1jb2xvcjojZmZmO2NvbG9yOiM2NjY7d2lkdGg6NTEycHg7aGVpZ2h0OjUxMnB4O2JvcmRlci1yYWRpdXM6NjBweDt0cmFuc2l0aW9uOm9wYWNpdHkgMzc1bXMgZWFzZS1vdXQsc2NhbGUgMjUwbXMgZWFzZS1vdXQgMTI1bXM7b3ZlcmZsb3c6dmlzaWJsZX0ucGFuZHltaWMtaW1hZ2Vpbjo6YmFja2Ryb3B7YmFja2dyb3VuZC1jb2xvcjojMDAwO29wYWNpdHk6Ljg1fS5wYW5keW1pYy1pbWFnZWluOmJlZm9yZXtjb250ZW50OiIiO3Bvc2l0aW9uOmFic29sdXRlO3RvcDoxMHB4O3JpZ2h0OjEwcHg7Ym90dG9tOjEwcHg7bGVmdDoxMHB4O2JvcmRlcjo1cHggZGFzaGVkIGN1cnJlbnRjb2xvcjtib3JkZXItcmFkaXVzOjUwcHg7dHJhbnNpdGlvbjpzY2FsZSAxMjVtcyBlYXNlLWlufS5wYW5keW1pYy1pbWFnZWluOmFmdGVye2NvbnRlbnQ6IkRyYWcgZmlsZSBoZXJlLiI7cG9zaXRpb246YWJzb2x1dGU7dG9wOjUwJTtsZWZ0OjUwJTttYXgtd2lkdGg6NzV2dzt0cmFuc2xhdGU6LTUwJSAtNTAlO2NvbG9yOmN1cnJlbnRjb2xvcjtmb250LWZhbWlseTptb25vc3BhY2U7Zm9udC1zaXplOjV2aDtsaW5lLWhlaWdodDoxLjE7dGV4dC1hbGlnbjpjZW50ZXJ9LnBhbmR5bWljLWltYWdlaW4ucGFuZHltaWMtaW1hZ2Vpbi1kcmFnOmFmdGVye2NvbnRlbnQ6IkRyb3AgZmlsZSEifS5wYW5keW1pYy1pbWFnZWluLnBhbmR5bWljLWltYWdlaW4tZXJyb3J7Y29sb3I6I2MzMH0ucGFuZHltaWMtaW1hZ2Vpbi5wYW5keW1pYy1pbWFnZWluLWRyYWd7Y29sb3I6IzA2Y30ucGFuZHltaWMtaW1hZ2Vpbi5wYW5keW1pYy1pbWFnZWluLWRyYWc6YmVmb3Jle3NjYWxlOi45NX0ucGFuZHltaWMtaW1hZ2Vpbi5wYW5keW1pYy1pbWFnZWluLXN1Y2Nlc3N7cG9pbnRlci1ldmVudHM6bm9uZTtjb2xvcjojMGMzfS5wYW5keW1pYy1pbWFnZWluOm5vdChbZGF0YS1wYW5keW1pYy1pbWFnZWluLW1lc3NhZ2U9IiJdKTphZnRlcntjb250ZW50OmF0dHIoZGF0YS1wYW5keW1pYy1pbWFnZWluLW1lc3NhZ2UpICFpbXBvcnRhbnR9LnBhbmR5bWljLWltYWdlaW4gYnV0dG9ue2NvbG9yOiM2NjY7cG9zaXRpb246YWJzb2x1dGU7bGVmdDpjYWxjKDUwJSAtIDQwcHgpO2JvdHRvbTotMTIwcHg7YmFja2dyb3VuZC1jb2xvcjojZmZmO2JvcmRlcjowO3dpZHRoOjgwcHg7aGVpZ2h0OjgwcHg7Ym9yZGVyLXJhZGl1czo0MHB4O2N1cnNvcjpwb2ludGVyO3RyYW5zaXRpb246Y29sb3IgMTI1bXMgZWFzZS1pbixzY2FsZSAxMjVtcyBlYXNlLWluO2ZvbnQtc2l6ZTo1MHB4O2Rpc3BsYXk6ZmxleDtqdXN0aWZ5LWNvbnRlbnQ6Y2VudGVyO2FsaWduLWl0ZW1zOmNlbnRlcjtsaW5lLWhlaWdodDoxfS5wYW5keW1pYy1pbWFnZWluIGJ1dHRvbjpob3Zlcntjb2xvcjojMDAwO3NjYWxlOjEuMDV9LnBhbmR5bWljLWltYWdlaW4gYnV0dG9uOmJlZm9yZXtjb250ZW50OiIiO3Bvc2l0aW9uOmFic29sdXRlO3RvcDo1cHg7cmlnaHQ6NXB4O2JvdHRvbTo1cHg7bGVmdDo1cHg7Ym9yZGVyOjVweCBkYXNoZWQgY3VycmVudGNvbG9yO2JvcmRlci1yYWRpdXM6MzVweH0="}},run:()=>{var e;!0!==c.config.css&&(c.config.css=!0,(e=document.createElement("STYLE")).textContent=atob(c.config.searchParams.css),document.body.appendChild(e)),!0!==c.config.init&&(c.config.cursor={activeElement:document.activeElement,selection:window.getSelection()},"Range"===c.config.cursor.selection.type||"Caret"===c.config.cursor.selection.type?(c.config.cursor.range=c.config.cursor.selection.getRangeAt(0),c.init()):(delete c.config.cursor,c.config.cursor={}))},dropTarget:null,createDropTarget:()=>{const r=document.createElement("DIALOG"),t=document.createElement("INPUT"),e=document.createElement("BUTTON");return r.dataset.pandymicImageinMessage="",r.addEventListener("close",e=>{c.config.init=!1,delete c.config.cursor,c.config.cursor=null,c.dropTarget.remove(),delete c.dropTarget,c.dropTarget=null}),t.type="file",t.accept="image/png, image/jpeg, image/webp",t.addEventListener("change",e=>{var r=Array.from(t.files);0==r.length?dropError("File error!"):1!==r.length?dropError("Multiple files not supported!"):c.fileHandler(r[0])}),r.addEventListener("click",e=>{t.click()}),r.filePickerToggle=t,e.textContent="×",e.addEventListener("click",e=>{e.preventDefault(),e.stopPropagation(),r.close()}),r.appendChild(e),document.body.appendChild(r),r.showModal(),r},dropHandler:e=>{e.preventDefault(),c.dropTarget.classList.remove("pandymic-imagein-drag");e=Array.from(e.dataTransfer.files);0==e.length?dropError("File error!"):1!==e.length?dropError("Multiple files not supported!"):c.fileHandler(e[0])},pasteHandler:async e=>{e.preventDefault();e=await(async r=>{for(let e=0;e{if(0!==s.type.indexOf("image/"))c.dropError("Invalid file type!");else{const t=new FileReader;t.addEventListener("load",e=>{const r=new Image;r.addEventListener("load",e=>{Promise.resolve(createImageBitmap(r)).then(e=>{var r=960,t=document.createElement("CANVAS"),a=t.getContext("2d",{alpha:!0}),{width:n,height:i}=e,o=(t.width=n,(t.height=i)/n);r{var r;null!==e&&((r=new FormData).append("file",e),r.append("base64",d),r.append("name",s.name),fetch(c.config.searchParams.baseUrl+"upload.php",{method:"POST",type:"multipart/form-data",body:r}).then(e=>e.json()).then(e=>{var r,t;c.dropTarget.removeEventListener("drop",c.dropHandler),c.dropTarget.removeEventListener("paste",c.pasteHandler),c.dropTarget.classList.add("pandymic-imagein-success"),c.dropTarget.dataset.pandymicImageinMessage="Upload successful!","INPUT"===c.config.cursor.activeElement.nodeName||"TEXTAREA"===c.config.cursor.activeElement.nodeName?(r=c.config.cursor.activeElement).value=r.value.substring(0,r.selectionStart)+c.config.searchParams.baseUrl+e.path+r.value.substring(r.selectionEnd,r.value.length):(c.config.cursor.range.deleteContents(),"true"===c.config.cursor.activeElement.contentEditable?((t=document.createElement("A")).href=c.config.searchParams.baseUrl+e.path,t.textContent=c.config.searchParams.baseUrl+e.path):t=document.createTextNode(c.config.searchParams.baseUrl+e.path),c.config.cursor.range.insertNode(t)),setTimeout(()=>{c.dropTarget.style.opacity=0,c.dropTarget.style.scale=.5,setTimeout(()=>{c.config.init=!1,delete c.config.cursor,c.config.cursor=null,c.dropTarget.remove(),delete c.dropTarget,c.dropTarget=null},500)},1e3)}))},"image/webp")})}),r.src=t.result}),t.addEventListener("error",e=>{c.dropError("Error reading file!")}),t.readAsDataURL(s)}},dropError:e=>{c.dropTarget.classList.add("pandymic-imagein-error"),c.dropTarget.dataset.pandymicImageinMessage=e},init:()=>{c.config.init=!0,c.dropTarget=c.createDropTarget(),c.dropTarget.classList.add("pandymic-imagein"),c.dropTarget.addEventListener("dragenter",e=>{e.preventDefault(),c.dropTarget.dataset.pandymicImageinMessage.length&&(c.dropTarget.dataset.pandymicImageinMessage=""),c.dropTarget.classList.remove("pandymic-imagein-error"),c.dropTarget.classList.add("pandymic-imagein-drag")}),c.dropTarget.addEventListener("dragover",e=>{e.preventDefault(),c.dropTarget.dataset.pandymicImageinMessage.length&&(c.dropTarget.dataset.pandymicImageinMessage=""),c.dropTarget.classList.remove("pandymic-imagein-error"),c.dropTarget.classList.add("pandymic-imagein-drag")}),c.dropTarget.addEventListener("dragleave",e=>{e.preventDefault(),c.dropTarget.classList.remove("pandymic-imagein-drag")}),c.dropTarget.addEventListener("drop",c.dropHandler),c.dropTarget.addEventListener("paste",c.pasteHandler)}};let c=window.pandymicImagein;"complete"!==document.readyState?document.addEventListener("DOMContentLoaded",e=>{c.run()}):c.run()})();
</pre>

## File Replacer

This is a simple bookmarklet that finds the matching file absolute URL and replaces it with an `<img>` tag that loads the source image directly on the page. Currently only supports anchor tags whose textContent matches the URL pattern exactly.

### Assumptions & Notes

* For privacy the github repo does not include any URL's or paths to the actual production environment. Instead, all of these values are stored server-side in a configuration file called `imagein.conf`. It's assumed that the file is a valid PHP script with a return statement on its last line. It lives in the folder `/etc` relative to the project directory (i.e. `../../etc` relative to the web root.)
* The base URL as well as its regular expression escaped variant in the bookmarklet below are generated server-side for conveninence. See `test.php` in the web root.

### Bookmarklet
<pre>
javascript:((t,e)=>{for(var n=0;n<t.length;n++)t[n].textContent.match(e)&&1===t[n].childNodes.length&&3===t[n].childNodes[0].nodeType&&(t[n].dataset.originalText=t[n].textContent,t[n].innerHTML='<img src="'+encodeURI(t[n].textContent)+'" style="width:100%;height:auto;max-width:100%">')})(document.getElementsByTagName("*"),/^<i>[base-url-to-app-regex-escaped]</i>\/file\/[a-fA-F0-9]+\.webp$/);
</pre>
