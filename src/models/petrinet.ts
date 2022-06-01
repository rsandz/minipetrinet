import Arc from "./arc";
import Node, { ResolveOpposite } from "./node";
import Place from "./place";
import Transition from "./transition";

/**
 * Represents a petri net that can be simulated.
 */
class PetriNet {
  places: Place[];
  transitions: Transition[];
  consumingArcs: Record<string, Arc<Place, Transition>[]>;
  generatingArcs: Record<string, Arc<Transition, Place>[]>;

  placeIndex: number;
  transitionIndex: number;

  constructor() {
    this.places = [];
    this.transitions = [];
    this.consumingArcs = Object();
    this.generatingArcs = Object();

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
    const transition = new Transition(
      "transition" + this.transitionIndex.toString(),
      fireProbability
    );
    this.transitions.push(transition);
    this.transitionIndex++;

    this.consumingArcs[transition.id] = [];
    this.generatingArcs[transition.id] = [];

    return transition;
  }

  /**
   * Delete specified transition from this petri net.
   */
  delete(node: Transition): void;
  /**
   * Delete specified place from this petri net.
   */
  delete(node: Place): void;
  delete(node: Place | Transition): void {
    if (node instanceof Place) {
      this.places.splice(this.places.indexOf(node), 1);
      Object.entries(this.consumingArcs).forEach(([key, arcs]) => {
        this.consumingArcs[key] = arcs.filter((arc) => arc.input !== node);
      });
      Object.entries(this.generatingArcs).forEach(([key, arcs]) => {
        this.generatingArcs[key] = arcs.filter((arc) => arc.output !== node);
      });
    } else {
      this.transitions.splice(this.transitions.indexOf(node), 1);
      delete this.consumingArcs[node.id];
      delete this.generatingArcs[node.id];
    }
  }

  connect(from: Transition, to: Place): void;
  connect(from: Place, to: Transition): void;
  connect(from: Place | Transition, to: Place | Transition): void {
    if (from instanceof Place && to instanceof Transition) {
      const arc = new Arc(1, from, to);
      this.consumingArcs[to.id].push(arc);
    } else if (from instanceof Transition && to instanceof Place) {
      const arc = new Arc(1, from, to);
      this.generatingArcs[from.id].push(arc);
    }
  }

  /**
   * Run the petri net for a set number of cycles.
   *
   * @param cycles The number of cycles to run petri net.
   */
  simulate(cycles: number = 1) {
    for (let i = 0; i < cycles; i++) {
      // Run all consumes first so that markers don't travel more than
      // one transition in chains.
      this.transitions.forEach((transition) => {
        if (!transition.rollProbability()) {
          return;
        }
        transition.firing = this.consumingArcs[transition.id].every(
          (arc) => arc.input.tokens >= arc.multiplicity
        );
        if (transition.firing) {
          this.consumingArcs[transition.id].forEach((arc) => {
            arc.input.removeToken(arc.multiplicity);
          });
        }
      });

      this.transitions.forEach((transition) => {
        if (transition.firing) {
          this.generatingArcs[transition.id].forEach((arc) => {
            arc.output.addToken(arc.multiplicity);
          });
        }
        transition.firing = false;
      });
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
