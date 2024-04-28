import { REVISION } from "./constants.js";

export { Ship } from "./ship/Ship.js";
export { WaveCreator } from "./ship/WaveCreator.js";
export { WaveMotion } from "./ship/WaveMotion.js";
export { ShipState } from "./ship/ShipState.js";
export { StateModule } from "./ship/StateModule.js";
export { HullResistance } from "./ship/HullResistance.js";
export { PropellerInteraction } from "./ship/PropellerInteraction.js";
export { downloadShip } from "./fileIO/dowloadShip.js";
export { loadShip } from "./fileIO/loadShip.js";
export { FuelConsumption } from "./ship/FuelConsumption.js";
export { Positioning } from "./ship/Positioning.js";
export { Manoeuver } from "./ship/Manoeuver.js";
export { BaseObject } from "./ship/BaseObject.js";
export { DerivedObject } from "././ship/DerivedObject.js";

import { linearFromArrays, bilinear, bisectionSearch } from "./math/interpolation.js";

export const f = {
	linearFromArrays,
	bilinear,
	bisectionSearch
};

if ( typeof window !== "undefined" ) {

	if ( window.__VESSEL__ ) {

		console.warn( "WARNING: Multiple instances of Vessel.js being imported." );

	} else {

		window.__VESSEL__ = REVISION;

	}

}
