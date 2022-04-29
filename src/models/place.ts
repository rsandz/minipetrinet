import { Observable } from "./observable";

class Place extends Observable {
  tokens: number;
  id: string;

  constructor(id: string) {
    super();
    this.tokens = 0;
    this.id = id;
  }

  addToken() {
    this.tokens++;
    this.notifyObservers();
  }

  removeToken() {
    this.tokens--;
    this.notifyObservers();
  }
}

export default Place;
