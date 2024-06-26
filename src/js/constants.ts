const animationContainer = document.getElementById( 'webp-container' ) as HTMLImageElement;
const flashOverlay = document.getElementById( 'flash-overlay' ) as HTMLDivElement;

if ( !animationContainer ) {
	throw new Error( 'No animationContainer found' );
}

export { animationContainer, flashOverlay };
