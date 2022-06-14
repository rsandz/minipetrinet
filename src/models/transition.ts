import Observable from "./observable";

type Events = "delete" | "update";

class Transition extends Observable<Events> {
  id: string;
  probability: number;
  firing: boolean;

  /**
   * @param probability The probability that this transition fires.
   */
  constructor(id: string, probability: number) {
    super();
    this.id = id;
    this.probability = probability;
    this.firing = false;
  }

  rollProbability(): boolean {
    return Math.random() < this.probability;
  }

  setProbability(probability: number) {
    this.probability = probability;
    this.fire("update");
  }

}

export default Transition;
