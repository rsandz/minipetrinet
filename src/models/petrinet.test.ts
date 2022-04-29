import PetriNet from "./petrinet";

describe("petrinet", () => {
  test("simulates circular flow correctly", () => {
    const petri = new PetriNet();

    const p1 = petri.createPlace();
    const p2 = petri.createPlace();
    const t1 = petri.createTransition(1.0);
    const t2 = petri.createTransition(1.0);

    // Create Circular token flow.
    t1.addInPlace(p1);
    t1.addOutPlace(p2);
    t2.addInPlace(p2);
    t2.addOutPlace(p1);

    p1.addToken();
    expect(petri.getMarkings()).toEqual([1, 0]);

    petri.simulate(1);
    // Should not move token from p1 to p2, then from p2 to p1.
    expect(petri.getMarkings()).toEqual([0, 1]);
  });

  test("generate lots of token simulation", () => {
    const petri = new PetriNet();

    const p1 = petri.createPlace();
    const t1 = petri.createTransition(1.0);
    const t2 = petri.createTransition(1.0);

    t1.addOutPlace(p1);
    t2.addOutPlace(p1);

    petri.simulate(1000);

    expect(petri.getMarkings()).toEqual([2000]);
  });
});
