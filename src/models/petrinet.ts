import Place from "./place";
import Transition from "./transition";

/**
 * Represents a petri net that can be simulated.
 */
class PetriNet {
  places: Place[];
  placeIndex: number;
  transitions: Transition[];
  transitionIndex: number;

  constructor() {
    this.places = [];
    this.transitions = [];

    this.placeIndex = 0;
    this.transitionIndex = 0;
  }

  /**
   * Create a place in this petri net.
   */
  createPlace(): Place {
    const place = new Place("place" + this.placeIndex.toString());
    this.places.push(place);
    this.placeIndex++;
    return place;
  }

  /**
   * Create a transition in this petri net.
   */
  createTransition(fireProbability: number): Transition {
    const transition = new Transition(fireProbability);
    this.transitions.push(transition);
    this.transitionIndex++;
    return transition;
  }

  /**
   * Run the petri net for a set number of cycles.
   *
   * @param cycles The number of cycles to run petri net.
   */
  simulate(cycles: number = 1) {
    for (let i = 0; i < cycles; i++) {
      this.transitions.forEach((transition) => transition.simulateConsume());
      this.transitions.forEach((transition) => transition.simulateEject());
    }
  }

  /**
   * Get markings array which represent tokens at each place.
   */
  getMarkings(): number[] {
    return this.places.map((place) => place.tokens);
  }
}

export default PetriNet;
