document.addEventListener( 'DOMContentLoaded', e => {
  document.querySelectorAll( 'figure > a' ).forEach( link => {
    
    link.isCopied = false;

    link.addEventListener( 'click', e => {

      e.preventDefault();
      window.navigator.clipboard.writeText( e.target.href );

      e.target.classList.add( 'copied' );
      if ( false !== e.target.isCopied ) {
        clearTimeout( e.target.isCopied );
        e.target.isCopied = false;
      }
      e.target.isCopied = setTimeout( () => {
        e.target.classList.remove( 'copied' );
        e.target.isCopied = false;
      }, 350 );

    } );
    
  } );
  
  document.querySelectorAll( 'pre' ).forEach( pre => {

    const button = document.createElement( 'BUTTON' );
    button.textContent = 'Copy!';

    button.addEventListener( 'click', e => {

      e.preventDefault();
      window.navigator.clipboard.writeText( pre.textContent );

      pre.classList.add( 'copied' );
      if ( false !== pre.isCopied ) {
        clearTimeout( pre.isCopied );
        pre.isCopied = false;
      }
      pre.isCopied = setTimeout( () => {
        pre.classList.remove( 'copied' );
        pre.isCopied = false;
      }, 350 );

    } );

    const wrapper = document.createElement( 'DIV' );
    wrapper.classList.add( 'pre-wrapper' );
    wrapper.appendChild( button );

    pre.parentNode.insertBefore( wrapper, pre );
    wrapper.insertBefore( pre, button );

  } );
  
} );