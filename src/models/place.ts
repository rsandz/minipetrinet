import Observable from "./observable";

type Events = "update" | "delete";

class Place extends Observable<Events> {
  tokens: number;
  id: string;

  constructor(id: string) {
    super();
    this.tokens = 0;
    this.id = id;
  }

  addToken(amount: number = 1) {
    this.tokens += amount;
    this.fire("update")
  }

  removeToken(amount: number = 1) {
    this.tokens -= amount;
    this.fire("update")
  }
}

export default Place;
