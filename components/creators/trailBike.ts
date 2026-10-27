import { motionValue } from "framer-motion";

/**
 * Where the trail's bike is, in page coordinates, so the paraglider can fly
 * above it. CollabTrail writes these; ParagliderFlight reads them.
 */
export const trailBike = {
  /** 1 once the road is laid out */
  ready: motionValue(0),
  x: motionValue(0),
  y: motionValue(0),
  /** 1 riding right, -1 riding left */
  dir: motionValue(1),
  /** page y of the road's start and of the finish flag */
  startY: motionValue(0),
  endY: motionValue(0),
  startX: motionValue(0),
  endX: motionValue(0),
};
