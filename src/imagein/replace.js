( ( tags, preg ) => 
  {
    for( var i = 0; i < tags.length; i++) {

      if ( tags[i].textContent.match( preg ) && 1 === tags[i].childNodes.length && 3 === tags[i].childNodes[0].nodeType ) {
        tags[i].dataset.originalText = tags[i].textContent;
        tags[i].innerHTML = '<img src="' + encodeURI( tags[i].textContent ) + '" style="width:100%;height:auto;max-width:100%">';
      }
    }
  }
)( document.getElementsByTagName('*'), / / );