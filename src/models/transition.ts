import Place from "./place";

class Transition {
  probability: number;
  inPlace: Place[];
  outPlace: Place[];

  firing: boolean;
  triggered: boolean;

  /**
   * @param probability The probability that this transition fires.
   */
  constructor(probability: number) {
    this.probability = probability;
    this.inPlace = [];
    this.outPlace = [];
    this.firing = false;
    this.triggered = false;
  }

  /**
   * Add a place to the input.
   */
  addInPlace(place: Place): void {
    this.inPlace.push(place);
  }

  /**
   * Remove a place from the input.
   */
  removeInPlace(place: Place): void {
    this.inPlace.splice(this.inPlace.indexOf(place), 1);
  }

  /**
   * Add a place to the output.
   */
  addOutPlace(place: Place): void {
    this.outPlace.push(place);
  }

  /**
   * Remove a place from the output.
   */
  removeOutPlace(place: Place): void {
    this.outPlace.splice(this.outPlace.indexOf(place), 1);
  }

  /**
   * Simulate the first part of transition where
   * we are consuming tokens.
   */
  simulateConsume(): void {
    // Whether this transition has been triggered by probability
    this.triggered = Math.random() <= this.probability;

    // If consuming token and creating in output
    this.firing = true;

    if (this.inPlace.length > 0) {
      this.firing = this.inPlace.every((place) => place.tokens > 0);

      if (this.firing && this.triggered) {
        this.inPlace.forEach((place) => place.removeToken());
      }
    }
  }

  /**
   * Simulate second part of transition where we are creating tokens.
   */
  simulateEject() {
    if (this.outPlace.length > 0) {
      if (this.firing && this.triggered) {
        this.outPlace.forEach((place) => place.addToken());
      }
      this.firing = false;
    }
  }

  /**
   * Simulate both consumption and creation of tokens
   * for this transition.
   *
   * Note that this doesn't work if multiple transitions
   * need to be simulated: All transitions need to consume first
   * followed by and creation.
   *
   * Useful for unit testing.
   */
  simulate() {
    this.simulateConsume();
    this.simulateEject();
  }
}

export default Transition;
