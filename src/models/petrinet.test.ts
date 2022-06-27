import PetriNet from "./petrinet";

describe("petrinet", () => {
  test("should remove token if empty output", () => {
    const petri = new PetriNet();
    const p1 = petri.createPlace();
    const t1 = petri.createTransition(1.0);

    petri.connect(p1, t1);
    p1.addToken();

    petri.simulate(1);
    expect(p1.tokens).toBe(0);
  });

  test("should add token if empty input", () => {
    const petri = new PetriNet();
    const p1 = petri.createPlace();
    const t1 = petri.createTransition(1.0);

    petri.connect(t1, p1);
    petri.simulate(1);

    expect(p1.tokens).toBe(1);
  });

  test("should transition 2 places", () => {
    const petri = new PetriNet();
    const p1 = petri.createPlace();
    const p2 = petri.createPlace();
    const t1 = petri.createTransition(1.0);

    p1.addToken();

    petri.connect(p1, t1);
    petri.connect(t1, p2);
    petri.simulate();

    expect(p1.tokens).toEqual(0);
    expect(p2.tokens).toEqual(1);
  });

  test("should not transition 2 places if 0 prob", () => {
    const petri = new PetriNet();
    const p1 = petri.createPlace();
    const p2 = petri.createPlace();
    const t1 = petri.createTransition(0);

    p1.addToken();

    petri.connect(p1, t1);
    petri.connect(t1, p2);
    petri.simulate();

    expect(p1.tokens).toEqual(1);
    expect(p2.tokens).toEqual(0);
  });

  test("should not transition if missing token in input", () => {
    const petri = new PetriNet();
    const p1 = petri.createPlace();
    const p2 = petri.createPlace();
    const p3 = petri.createPlace();
    const t1 = petri.createTransition(1.0);

    p1.addToken();

    petri.connect(p1, t1);
    petri.connect(p2, t1);
    petri.connect(t1, p3);
    petri.simulate();

    expect(p1.tokens).toEqual(1);
    expect(p2.tokens).toEqual(0);
    expect(p3.tokens).toEqual(0);
  });

  test("Deletes a transition", () => {
    const petri = new PetriNet();

    const p1 = petri.createPlace();
    const p2 = petri.createPlace();
    const t1 = petri.createTransition(1.0);
    const transitionDeleteCb = jest.fn();
    const consumeArcDeleteCb = jest.fn();
    const generateArcDeleteCb = jest.fn();

    p1.addToken();

    const a1 = petri.connect(p1, t1);
    const a2 = petri.connect(t1, p2);
    t1.on("delete", transitionDeleteCb);
    a1.on("delete", consumeArcDeleteCb);
    a2.on("delete", generateArcDeleteCb);

    petri.delete(t1);
    petri.simulate();

    expect(p1.tokens).toBe(1);
    expect(p2.tokens).toBe(0);
    expect(Object.values(petri.generatingArcs).flat()).toEqual([]);
    expect(transitionDeleteCb).toBeCalled();
    expect(consumeArcDeleteCb).toBeCalled();
    expect(generateArcDeleteCb).toBeCalled();
  });

  test("Deletes a place", () => {
    const petri = new PetriNet();

    const p1 = petri.createPlace();
    const p2 = petri.createPlace();
    const t1 = petri.createTransition(1.0);
    const placeDeleteCb = jest.fn();
    const consumeArcDeleteCb = jest.fn();

    const a1 = petri.connect(p1, t1);
    petri.connect(t1, p2);
    p1.on("delete", placeDeleteCb);
    a1.on("delete", consumeArcDeleteCb);

    petri.delete(p1);
    petri.simulate();

    expect(p1.tokens).toBe(0);
    expect(p2.tokens).toBe(1);
    expect(Object.values(petri.consumingArcs).flat()).toEqual([]);
    expect(placeDeleteCb).toBeCalled();
    expect(consumeArcDeleteCb).toBeCalled();
  });

  test("simulates circular flow correctly", () => {
    const petri = new PetriNet();

    const p1 = petri.createPlace();
    const p2 = petri.createPlace();
    const t1 = petri.createTransition(1.0);
    const t2 = petri.createTransition(1.0);

    // Create Circular token flow.
    petri.connect(p1, t1);
    petri.connect(t1, p2);
    petri.connect(p2, t2);
    petri.connect(t2, p1);

    p1.addToken();
    expect(petri.getMarkings()).toEqual({
      place0: 1,
      place1: 0,
    });

    petri.simulate(1);
    // Should not move token from p1 to p2, then from p2 to p1.
    expect(petri.getMarkings()).toEqual({
      place0: 0,
      place1: 1,
    });
  });

  test("generate lots of token simulation", () => {
    const petri = new PetriNet();

    const p1 = petri.createPlace();
    const t1 = petri.createTransition(1.0);
    const t2 = petri.createTransition(1.0);

    petri.connect(t1, p1);
    petri.connect(t2, p1);

    petri.simulate(1000);

    expect(petri.getMarkings()).toEqual({
      place0: 2000,
    });
  });
});
