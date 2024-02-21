(function(){
  window.pandymicImagein = window.pandymicImagein || {
    config: {
      css: false,
      init: false,
      searchParams: Object.fromEntries( new URL( document.currentScript.src ).searchParams )
    },
    run: () => {
      if ( true !== p.config.css ) {
        p.config.css = true;
        const style = document.createElement( 'STYLE' );
        style.textContent = atob( p.config.searchParams.css );
        document.body.appendChild( style );
      }
      if ( true !== p.config.init ) {
        p.config.cursor = {
          activeElement: document.activeElement,
          selection: window.getSelection()
        };
        if ( 'Range' === p.config.cursor.selection.type || 'Caret' === p.config.cursor.selection.type ) {
          p.config.cursor.range = p.config.cursor.selection.getRangeAt(0);
          p.init();
        } else {
          delete p.config.cursor;
          p.config.cursor = {};
        }
      }
    },
    dropTarget: null,
    createDropTarget: () => {
      
      const dialog = document.createElement( 'DIALOG' ), input = document.createElement( 'INPUT' ), close = document.createElement( 'BUTTON' );
      dialog.dataset.pandymicImageinMessage = '';
      dialog.addEventListener( 'close', ( e ) => {
        p.config.init = false;
        delete p.config.cursor;
        p.config.cursor = null;
        p.dropTarget.remove();
        delete p.dropTarget;
        p.dropTarget = null;
      } );
      
      input.type = 'file';
      input.accept = 'image/png, image/jpeg, image/webp';
      input.addEventListener( 'change', ( e ) => {
        const files = Array.from( input.files );
        if ( 0 == files.length ) {
          dropError( 'File error!' );
        } else if ( 1 !== files.length ) {
          dropError( 'Multiple files not supported!' );
        } else {
          p.fileHandler( files[0] );
        }
      } );
      
      dialog.addEventListener( 'click', ( e ) => {
        input.click();
      } );
      dialog.filePickerToggle = input;
      
      close.textContent = '×';
      close.addEventListener( 'click', ( e ) => {
        e.preventDefault();
        e.stopPropagation();
        dialog.close();
      } );
      dialog.appendChild( close );
      
      document.body.appendChild( dialog );
      
      dialog.showModal();
      
      return dialog;
    },
    dropHandler: ( e ) => {
      e.preventDefault();
      p.dropTarget.classList.remove( 'pandymic-imagein-drag' );
      const files = Array.from( e.dataTransfer.files );
      if ( 0 == files.length ) {
        dropError( 'File error!' );
      } else if ( 1 !== files.length ) {
        dropError( 'Multiple files not supported!' );
      } else {
        p.fileHandler( files[0] );
      }
    },
    pasteHandler: async ( e ) => {
      e.preventDefault();
      
      const file = await ( async ( dataTransfer ) => {
        for ( let i = 0; i < dataTransfer.items.length; i++ ) {
          const item = dataTransfer.items[i];
          if ( 'file' === item.kind && 0 === item.type.indexOf( 'image/' ) ) {
            return item.getAsFile();
          }
        }
        return false;
      } )( e.clipboardData );
      
      if ( false === file ) {
        dropError( 'Pasted content is invalid!' );
      } else {
        p.fileHandler( file );
      }

    },
    fileHandler: ( file ) => {
      if ( 0 !== file.type.indexOf( 'image/' ) ) {
        p.dropError( 'Invalid file type!' );
      } else {
        
        const reader = new FileReader();
        reader.addEventListener( 'load', ( e ) => {
          const image = new Image();
          image.addEventListener( 'load', ( e ) => {
            
            Promise.resolve( createImageBitmap( image ) ).then( ( bitmap ) => {
              
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
              const dataurl = canvas.toDataURL( 'image/webp' );

              canvas.toBlob( ( blob ) => {
                if ( null !== blob ) {
                  const formData = new FormData();
                  formData.append( 'file', blob );
                  formData.append( 'base64', dataurl );
                  formData.append( 'name', file.name );
                  fetch( p.config.searchParams.baseUrl + 'upload.php', { method: 'POST', type: 'multipart/form-data', body: formData } )
                  .then( function( response ) {
                    return response.json();
                  } )
                  .then( function( result ) {

                    p.dropTarget.removeEventListener( 'drop', p.dropHandler );
                    p.dropTarget.removeEventListener( 'paste', p.pasteHandler );

                    p.dropTarget.classList.add( 'pandymic-imagein-success' );
                    p.dropTarget.dataset.pandymicImageinMessage = 'Upload successful!';
                    
                    if ( 'INPUT' === p.config.cursor.activeElement.nodeName || 'TEXTAREA' === p.config.cursor.activeElement.nodeName ) {
                      var field = p.config.cursor.activeElement;
                      field.value = field.value.substring( 0, field.selectionStart ) + p.config.searchParams.baseUrl + result.path + field.value.substring( field.selectionEnd, field.value.length );
                    } else {
                      p.config.cursor.range.deleteContents();
                      var link;
                      if ( 'true' === p.config.cursor.activeElement.contentEditable ) {
                        link = document.createElement( 'A' );
                        link.href = p.config.searchParams.baseUrl + result.path;
                        link.textContent = p.config.searchParams.baseUrl + result.path;
                      } else {
                        link = document.createTextNode( p.config.searchParams.baseUrl + result.path );
                      }
                      p.config.cursor.range.insertNode( link );
                    }
                    
                    setTimeout( () => {
                      
                      p.dropTarget.style.opacity = 0;
                      p.dropTarget.style.scale = 0.5;
                      
                      setTimeout( () => {
                        p.config.init = false;
                        delete p.config.cursor;
                        p.config.cursor = null;
                        p.dropTarget.remove();
                        delete p.dropTarget;
                        p.dropTarget = null;
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
         p.dropError( 'Error reading file!' );
        } );
        reader.readAsDataURL( file );
        
      }

    },
    dropError: ( message ) => {
      p.dropTarget.classList.add( 'pandymic-imagein-error' );
      p.dropTarget.dataset.pandymicImageinMessage = message;
    },
    init: () => {
      
      p.config.init = true;
      p.dropTarget = p.createDropTarget();
      p.dropTarget.classList.add( 'pandymic-imagein' );
      
      p.dropTarget.addEventListener( 'dragenter', ( e ) => {
        e.preventDefault();
        if ( p.dropTarget.dataset.pandymicImageinMessage.length ) p.dropTarget.dataset.pandymicImageinMessage = '';
        p.dropTarget.classList.remove( 'pandymic-imagein-error' );
        p.dropTarget.classList.add( 'pandymic-imagein-drag' );
      });

      p.dropTarget.addEventListener( 'dragover', ( e ) => {
        e.preventDefault();
        if ( p.dropTarget.dataset.pandymicImageinMessage.length ) p.dropTarget.dataset.pandymicImageinMessage = '';
        p.dropTarget.classList.remove( 'pandymic-imagein-error' );
        p.dropTarget.classList.add( 'pandymic-imagein-drag' );
      });

      p.dropTarget.addEventListener( 'dragleave', ( e ) => {
        e.preventDefault();
        p.dropTarget.classList.remove( 'pandymic-imagein-drag' );
      });

      p.dropTarget.addEventListener( 'drop', p.dropHandler );
      p.dropTarget.addEventListener( 'paste', p.pasteHandler );

    }
  };
  let p = window.pandymicImagein;
  if ( 'complete' !== document.readyState ) document.addEventListener( 'DOMContentLoaded', ( e ) => { p.run(); } );
  else p.run();
})();