import Observable from "./observable";
import Place from "./place";

type Events = "delete" | "update"

/**
 * Connects Places and Transitions.
 */
class Arc<Input, Output> extends Observable<Events> {

  multiplicity: number;
  input: Input;
  output: Output;

  constructor(multiplicity: number = 1, input: Input, output: Output) {
    super()
    this.multiplicity = multiplicity;
    this.input = input;
    this.output = output;
  }

  /**
   * Whether this arc is from place to transition.
   */
  isConsuming() {
    return this.input instanceof Place;
  }
}

export default Arc;
