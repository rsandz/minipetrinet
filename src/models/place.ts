import Observable from "./observable";

type Events = "tokenAdded" | "tokenRemoved" | "delete";

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
    this.fire("tokenAdded");
  }

  removeToken(amount: number = 1) {
    this.tokens -= amount;
    this.fire("tokenRemoved");
  }
}

export default Place;
