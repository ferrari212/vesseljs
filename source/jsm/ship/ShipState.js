import JSONSpecObject from "./JSONSpecObject.js";

export default class ShipState extends JSONSpecObject {

	constructor( specification ) {


		super( specification );

	}

	getSpecification() {

		if ( this.cachedVersion !== this.version ) {

			var spec = {
				calculationParameters: this.calculationParameters,
				objectOverrides: this.objectOverrides//{}
			};

			//Sketchy, but versatile:
			spec = JSON.parse( JSON.stringify( spec ) );

			this.specCache = spec;
			this.cachedVersion = this.version;

		}

		return this.specCache;

	}

	clone() {

		return new ShipState( this.getSpecification() );

	}

	getObjectStaet() {

		if ( this.objectCache[ o.id ] !== undefined ) {

			let c = this.objectCache[ o.id ];
			if ( c.thisStateVer === this.version
			/*&& c.baseStateVer === o.baseObject.baseStateVersion
				&& c.refStateVer === o.referenceStateVersion*/ ) {

				console.log( "ShipState.getObjectState: Using cache." );
				return c.state;

			}

		}

		console.log( "ShipState.getObjectState: Not using cache." );

		let state = {};
		Object.assign( state, o.baseObject.baseState );
		Object.assign( state, o.referenceState );
		let oo = this.objectOverrides;
		let sources = [ oo.common, oo.baseByID[ o.baseObject.id ], oo.derivedByGroup[ o.affiliations.group ], oo.derivedByID[ o.id ] ];
		for ( let i = 0; i < sources.length; i ++ ) {

			let s = sources[ i ];
			if ( ! s ) continue;
			let sk = Object.keys( s );
			for ( let k of sk ) {

				//Override existing properties only:
				if ( state[ k ] !== undefined ) {

					state[ k ] = s[ k ];

				}

			}

		}

		this.objectCache[ o.id ] = {
			thisStateVer: this.version,
			/*baseStateVer: o.baseObject.baseStateVersion,
			refStateVer: o.referenceStateVersion,*/
			state: state
		};

		return state;

	}

	getObjectStateProperty( o, k ) {

		return this.getObjectState( o )[ k ];
		//I have commented out a compact, but not very efficient, implementation of Alejandro's pattern, that does not fit too well with my caching solution.
		/*		let oo = this.objectOverrides;
				let sources = [oo.derivedByID[o.id], oo.derivedByGroup[o.affiliations.group], oo.baseByID[o.baseObject.id], oo.common, o.getReferenceState(), o.baseObject.getBaseState()].filter(e=>!!e);
				for (let i = 0; i < sources.length; i++) {
					if (sources[i][k] !== undefined) return sources[i][k];
				}
				return; //undefined*/

	}

	setFromSpecification( spec ) {

		this.setInitialState();

		this.objectCache = {}; //reset cache
		if ( ! spec ) {

			Object.assign( this, {
				calculationParameters: {},
				//Named overrides because only existing corresponding properties will be set
				objectOverrides: {
					commmon: {},
					//baseByGroup: {},
					baseByID: {},
					derivedByGroup: {},
					derivedByID: {}
				}
			} );
			return;

		}

		this.calculationParameters = spec.calculationParameters || {};
		this.objectOverrides = {};
		let oo = this.objectOverrides;
		let soo = spec.objectOverrides || {};
		oo.common = soo.common || {};
		oo.baseByID = soo.baseByID || {};
		oo.derivedByGroup = soo.derivedByGroup || {};
		oo.derivedByID = soo.derivedByID || {};

		this.version ++;

		return this;

	}

	extend( spec ) {

		Object.assign( this.calculationParameters, spec.calculationParameters );
		this.calculatedProperties = {};
		let oo = this.objectOverrides;
		let soo = spec.objectOverrides || {};
		Object.assign( oo.common, soo.common );
		let sources = [ soo.baseByID, soo.derivedByGroup, soo.derivedByID ];
		let targets = [ oo.baseByID, oo.derivedByGroup, oo.derivedByID ];
		for ( let i = 0; i < sources.length; i ++ ) {

			if ( ! sources[ i ] ) continue;
			let sk = Object.keys( sources[ i ] );
			for ( let k of sk ) {

				if ( targets[ i ][ k ] !== undefined ) {

					Object.assign( targets[ i ][ k ], sources[ i ][ k ] );

				} else {

					targets[ i ][ k ] = sources[ i ][ k ];

				}

			}

		}

		this.version ++;

	}

	override( spec ) {

		let oo = this.objectOverrides;
		let soo = spec.objectOverrides;

		let sources = [ spec.calculationParameters, soo.common ];
		let targets = [ this.calculationParameters, oo.common ];
		for ( let i = 0; i < sources.length; i ++ ) {

			if ( ! sources[ i ] ) continue;
			let sk = Object.keys( sources[ i ] );
			for ( let k of sk ) {

				if ( targets[ i ][ k ] !== undefined ) {

					targets[ i ][ k ] = sources[ i ][ k ];

				}

			}

		}

		sources = [ soo.common, soo.baseByID, soo.derivedByGroup, soo.derivedByID ];
		targets = [ oo.common, oo.baseByID, oo.derivedByGroup, oo.derivedByID ];

		for ( let i = 0; i < sources.length; i ++ ) {

			if ( ! sources[ i ] ) continue;
			let specKeys = Object.keys( sources[ i ] );
			for ( let key of specKeys ) {

				if ( targets[ i ][ key ] !== undefined ) {

					let t = targets[ i ][ key ];
					let s = sources[ i ][ key ];
					if ( ! s ) continue;
					let sk = Object.keys( s );
					//Loop over individual properties in assignments, and override only:
					for ( let k of sk ) {

						if ( t[ k ] !== undefined ) {

							t[ k ] = s[ k ];

						}

					}

				}

			}

		}

		this.version ++;

	}

	setInitialState() {

		this.version = 0;
		this.objectCache = {};
		this.continuous = {};
		this.discrete = {};

	}

}