// I tried hard with toolFactory registration, but
// eventually gave up. This is a hacky but working
// solution.
mw.hook( 've.activationComplete' ).add( () => {
	$( '.bs-data-after-content' ).hide();
} );

mw.hook( 've.deactivationComplete' ).add( () => {
	$( '.bs-data-after-content' ).show();
} );
