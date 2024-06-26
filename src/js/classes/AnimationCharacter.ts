/**
 * AnimationCharacter class
 * @description Class for creating an animation character
 * @class AnimationCharacter
 * @constructor
 * @param {HTMLImageElement} element - The element to render the animation character
 * @param {1 | 2 | 3} [entityNumber=1] - The entity number of the character
 * @param {1 | 2 | 3 | 4} [state=1] - The state of the character
 *
 * @function getElement - Get the element of the character
 * @function getEntityNumber - Get the entity number of the character
 * @function getState - Get the state of the character
 * @function setState - Set the state of the character
 * @function setEntityNumber - Set the entity number of the character
 * @function getWebp - Get the webp of the character
 * @function render - Render the character to given Element using src tag
 */
import { flashOverlay } from '../constants.ts';

export default class AnimationCharacter {
	private entityNumber: 1 | 2 | 3;
	private state: 1 | 2 | 3 | 4;
	private readonly element: HTMLImageElement;

	constructor( element: HTMLImageElement | null, entityNumber: 1 | 2 | 3 = 1, state: 1 | 2 | 3 | 4 = 1 ) {
		if ( !element ) {
			throw new Error( 'Element is required' );
		}

		this.element = element;
		this.state = state;
		this.entityNumber = entityNumber;
	}

	public getElement() {
		return this.element;
	}

	public getEntityNumber() {
		return this.entityNumber;
	}

	public getState() {
		return {
			1: 'walking',
			2: 'falling',
			3: 'fainted',
			4: 'gettingup',
		}[this.state];
	}

	public setState( state: 1 | 2 | 3 | 4 ) {
		this.state = state;
		this.render();
	}

	public setEntityNumber( entityNumber: 1 | 2 | 3 ) {
		this.entityNumber = entityNumber;
	}

	public getWebp() {
		return `../src/anim/${ this.getState() }-${ this.entityNumber }.webp`;
	}

	public shoot( entityNumber: number ) {
		if ( this.entityNumber === entityNumber && this.state === 1 ) {
			flashOverlay.animate( [
				{ backgroundColor: 'green' },
				{ backgroundColor: 'transparent' },
			], {
				duration: 500,
				iterations: 1,
			} );
			this.setState( 2 );
			setTimeout( () => {
				this.setState( 3 );
				setTimeout( () => {
					this.setState( 4 );
					setTimeout( () => {
						this.setState( 1 );
					}, 1000 );
				}, 1000 );
			}, 2000 );

		}
		else {
			flashOverlay.animate( [
				{ backgroundColor: 'red' },
				{ backgroundColor: 'transparent' },
			], {
				duration: 500,
				iterations: 1,
			} );
		}
	}

	public render() {
		this.element.src = this.getWebp();
	}
}
