window.pandymicImagein = window.pandymicImagein || {
  config: {
    css: false,
    init: false,
    searchParams: Object.fromEntries( new URL( document.currentScript.src ).searchParams )
  },
  run: () => {
    if ( true !== window.pandymicImagein.config.css ) {
      window.pandymicImagein.config.css = true;
      const style = document.createElement( 'STYLE' );
      style.textContent = atob( window.pandymicImagein.config.searchParams.css );
      document.body.appendChild( style );
    }
    if ( true !== window.pandymicImagein.config.init ) {
      window.pandymicImagein.config.cursor = {
        activeElement: document.activeElement,
        selection: window.getSelection()
      };
      if ( 'Range' === window.pandymicImagein.config.cursor.selection.type || 'Caret' === window.pandymicImagein.config.cursor.selection.type ) {
        window.pandymicImagein.config.cursor.range = window.pandymicImagein.config.cursor.selection.getRangeAt(0);
        window.pandymicImagein.init();
      } else {
        delete window.pandymicImagein.config.cursor;
        window.pandymicImagein.config.cursor = {};
      }
    }
  },
  dropTarget: null,
  createDropTarget: () => {
    
    const dialog = document.createElement( 'DIALOG' );
    dialog.dataset.pandymicImageinMessage = '';
    dialog.addEventListener( 'close', ( e ) => {
      window.pandymicImagein.config.init = false;
      delete window.pandymicImagein.config.cursor;
      window.pandymicImagein.config.cursor = null;
      window.pandymicImagein.dropTarget.remove();
      delete window.pandymicImagein.dropTarget;
      window.pandymicImagein.dropTarget = null;
    } );
    
    document.body.appendChild( dialog );
    
    dialog.showModal();
    
    return dialog;
  },
  dropHandler: ( e ) => {
    e.preventDefault();
    window.pandymicImagein.dropTarget.classList.remove( 'pandymic-imagein-drag' );

    const files = Array.from( e.dataTransfer.files );
    
    console.log( 'files', files);
    
    if ( 0 == files.length ) {
      dropError( 'File error!' );
    } else if ( 1 !== files.length ) {
      dropError( 'Multiple files not supported!' );
    } else {
      window.pandymicImagein.fileHandler( files[0] );
    }
  },
  pasteHandler: async ( e ) => {
    e.preventDefault();
    
    const file = await ( async ( dataTransfer ) => {
      console.dir( dataTransfer );
      for ( let i = 0; i < dataTransfer.items.length; i++ ) {
        const item = dataTransfer.items[i];
        if ( 'file' === item.kind && 0 === item.type.indexOf( 'image/' ) ) {
          console.log( 'dataTransfer item', item );
          return item.getAsFile();
        }
      }
      return false;
    } )( e.clipboardData );
    
    if ( false === file ) {
      dropError( 'Pasted content is invalid!' );
    } else {
      console.log( 'paste image file', file );
      window.pandymicImagein.fileHandler( file );
    }

  },
  fileHandler: ( file ) => {
    if ( 0 !== file.type.indexOf( 'image/' ) ) {
      window.pandymicImagein.dropError( 'Invalid file type!' );
    } else {
      
      const reader = new FileReader();
      reader.addEventListener( 'load', ( e ) => {
        
        console.log( 'reader load event', e );
        console.log( 'reader load this', this );
        console.log( 'reader load reader.result', reader.result );
        
        const image = new Image();
        image.addEventListener( 'load', ( e ) => {
          
          console.log( 'reader load image load', image );
          console.dir( image );
          
          Promise.resolve( createImageBitmap( image ) ).then( ( bitmap ) => {
            console.log( 'reader load createImageBitmap Promise bitmap', bitmap );
            
            const maxSize = 960;
            
            const canvas = document.createElement( 'CANVAS' );
            const context = canvas.getContext( "2d", { alpha: true } );
            
            const { width, height } = bitmap;
            
            canvas.width = width;
            canvas.height = height;

            const ratio = height / width;
            
            if ( height > maxSize && ratio >= 1 ) {
              canvas.width = maxSize / ratio;
              canvas.height = maxSize;
            } else if ( width > maxSize && ratio <= 1 ) {
              canvas.width = maxSize;
              canvas.height = maxSize * ratio;
            }
            
            context.drawImage( bitmap, 0, 0, width, height, 0, 0, canvas.width, canvas.height );

            canvas.toBlob( ( blob ) => {
              if ( null !== blob ) {
                const formData = new FormData();
                formData.append( 'file', blob );
                formData.append( 'name', file.name );
                fetch( 'upload.php', { method: 'POST', type: 'multipart/form-data', body: formData } )
                .then( function( response ) {
                  return response.json();
                } )
                .then( function( result ) {
                  console.log( 'fetch result', result );
                  
                  window.pandymicImagein.dropTarget.removeEventListener( 'drop', window.pandymicImagein.dropHandler );
                  window.pandymicImagein.dropTarget.removeEventListener( 'paste', window.pandymicImagein.pasteHandler );

                  window.pandymicImagein.dropTarget.classList.add( 'pandymic-imagein-success' );
                  window.pandymicImagein.dropTarget.dataset.pandymicImageinMessage = 'Upload successful!';

                  console.log( window.pandymicImagein.config.searchParams.baseUrl + result.path );
                  console.log( 'window.pandymicImagein.config.activeElement', window.pandymicImagein.config.activeElement );
                  console.dir( window.pandymicImagein.config.activeElement );
                  
                  console.dir( window.pandymicImagein.config.cursor ); 
                  
                  // window.pandymicImagein.config.cursor.activeElement.focus();
                  window.pandymicImagein.config.cursor.range.deleteContents();
                  
                  var link;
                  if ( 'true' === window.pandymicImagein.config.cursor.activeElement.contentEditable ) {
                    link = document.createElement( 'A' );
                    link.href = window.pandymicImagein.config.searchParams.baseUrl + result.path;
                    link.textContent = window.pandymicImagein.config.searchParams.baseUrl + result.path;
                  } else {
                    link = document.createTextNode( window.pandymicImagein.config.searchParams.baseUrl + result.path );
                  }
                  window.pandymicImagein.config.cursor.range.insertNode( link );
                  
                  setTimeout( () => {
                    
                    window.pandymicImagein.dropTarget.style.opacity = 0;
                    window.pandymicImagein.dropTarget.style.scale = 0.5;
                    
                    setTimeout( () => {
                      window.pandymicImagein.config.init = false;
                      delete window.pandymicImagein.config.cursor;
                      window.pandymicImagein.config.cursor = null;
                      window.pandymicImagein.dropTarget.remove();
                      delete window.pandymicImagein.dropTarget;
                      window.pandymicImagein.dropTarget = null;
                    }, 500 );
                    
                  }, 1000 );
                  
                } );
              }
            }, 'image/webp' );
            
            
          } );
          
        } );
        image.src = reader.result;
        
      } );
      reader.addEventListener( 'error', ( e ) => {
       window.pandymicImagein.dropError( 'Error reading file!' );
      } );
      reader.readAsDataURL( file );
      
    }

  },
  dropError: ( message ) => {
    window.pandymicImagein.dropTarget.classList.add( 'pandymic-imagein-error' );
    window.pandymicImagein.dropTarget.dataset.pandymicImageinMessage = message;
  },
  init: () => {
    
    window.pandymicImagein.config.init = true;
    
    console.log( 'window.pandymicImagein', window.pandymicImagein );
    
    window.pandymicImagein.dropTarget = window.pandymicImagein.createDropTarget();
    window.pandymicImagein.dropTarget.classList.add( 'pandymic-imagein' );
    
    window.pandymicImagein.dropTarget.addEventListener( 'dragenter', ( e ) => {
      e.preventDefault();
      if ( window.pandymicImagein.dropTarget.dataset.pandymicImageinMessage.length ) window.pandymicImagein.dropTarget.dataset.pandymicImageinMessage = '';
      window.pandymicImagein.dropTarget.classList.remove( 'pandymic-imagein-error' );
      window.pandymicImagein.dropTarget.classList.add( 'pandymic-imagein-drag' );
    });

    window.pandymicImagein.dropTarget.addEventListener( 'dragover', ( e ) => {
      e.preventDefault();
      if ( window.pandymicImagein.dropTarget.dataset.pandymicImageinMessage.length ) window.pandymicImagein.dropTarget.dataset.pandymicImageinMessage = '';
      window.pandymicImagein.dropTarget.classList.remove( 'pandymic-imagein-error' );
      window.pandymicImagein.dropTarget.classList.add( 'pandymic-imagein-drag' );
    });

    window.pandymicImagein.dropTarget.addEventListener( 'dragleave', ( e ) => {
      e.preventDefault();
      window.pandymicImagein.dropTarget.classList.remove( 'pandymic-imagein-drag' );
    });

    window.pandymicImagein.dropTarget.addEventListener( 'drop', window.pandymicImagein.dropHandler );
    window.pandymicImagein.dropTarget.addEventListener( 'paste', window.pandymicImagein.pasteHandler );

  },
  reset: () => {
    console.dir( 'reset' );
  }
};

if ( 'complete' !== document.readyState ) {
  document.addEventListener( 'DOMContentLoaded', ( e ) => { window.pandymicImagein.run(); } );
} else {
  window.pandymicImagein.run();
}