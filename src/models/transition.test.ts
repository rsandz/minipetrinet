import Place from "./place";
import Transition from "./transition";

describe("transition", () => {
  test("should remove token if empty output", () => {
    const p = new Place("a");
    const transition = new Transition(1.0);

    p.addToken();

    transition.addInPlace(p);
    transition.simulate();

    expect(p.tokens).toBe(0);
  });

  test("should add token if empty input", () => {
    const p = new Place("a");
    const transition = new Transition(1.0);

    transition.addOutPlace(p);
    transition.simulate();

    expect(p.tokens).toBe(1);
  })

  test("should transition 2 places", () => {
    const place1 = new Place("a");
    const place2 = new Place("b");
    const transition = new Transition(1.0);

    place1.addToken();

    transition.addInPlace(place1);
    transition.addOutPlace(place2);
    transition.simulate();

    expect(place1.tokens).toEqual(0);
    expect(place2.tokens).toEqual(1);
  });

  test("should not transition 2 places if 0 prob", () => {
    const place1 = new Place("a");
    const place2 = new Place("b");
    const transition = new Transition(0);

    place1.addToken();

    transition.addInPlace(place1);
    transition.addOutPlace(place2);
    transition.simulate();

    expect(place1.tokens).toEqual(1);
    expect(place2.tokens).toEqual(0);
  });

  test("should not transition if missing token in input", () => {
    const place1 = new Place("a");
    const place2 = new Place("b");
    const place3 = new Place("c");
    const transition = new Transition(0);

    place1.addToken();

    transition.addInPlace(place1);
    transition.addInPlace(place2);
    transition.addOutPlace(place3);
    transition.simulate();

    expect(place1.tokens).toEqual(1);
    expect(place2.tokens).toEqual(0);
    expect(place3.tokens).toEqual(0);
  });
});
