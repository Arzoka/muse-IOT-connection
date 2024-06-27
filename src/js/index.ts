import AnimationCharacter from './classes/AnimationCharacter.ts';
import { animationContainer } from './constants.ts';

/*
animationcharacter.state:
1: walking
2: falling
3: fainted
4: gettingup
 */

const animationcharacter = new AnimationCharacter( animationContainer, 1, 1 );

animationcharacter.render();

// detect POST method on this website

animationcharacter.setEntityNumber( Math.floor( Math.random() * 3 ) + 1 as 1 | 2 | 3 );

let errorCount = 0;

setInterval( async () => {
	try {
		const response = await fetch( 'http://localhost:3000/status', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		} );

		if ( response.ok ) {
			const data = await response.json();
			if ( data.message.includes( 'Shoot_' ) ) {
				const entityNumber = Number( data.message.split( '_' )[1] );
				if ( entityNumber >= 1 && entityNumber <= 3 ) {
					animationcharacter.shoot( entityNumber );
				}
			}
			errorCount = 0;
		} else {
			console.error( 'Network response was not ok.' );
			errorCount++;
		}
	} catch ( error ) {
		console.error( 'Fetch error:', error );
		errorCount++;
		if ( errorCount === 10 ) {
			alert( 'Connection between client and server lost. Please have a super' +
				'visor restart the server, refresh the page, and check connection between Arduino and computer, apologies for the inconvenience!' );
		}
	}
}, 1000 );
