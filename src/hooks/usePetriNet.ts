import React, { useContext, useEffect, useState } from "react";
import DiagramPlace from "../diagram/diagramPlace";
import DiagramTransition from "../diagram/diagramTransition";
import PetriNetDiagram from "../diagram/petriNetDiagram";
import PetriNet from "../models/petrinet";

interface PlaceData {
  id: string;
  tokens: number;
}

interface TransitionData {
  id: string;
  probability: number;
}

interface PetriNetContextDefault {
  petriNetDiagram: PetriNetDiagram | null;
  petriNet: PetriNet;
}

/**
 * Allow components access to the petri net model.
 */
const PetriNetContext = React.createContext<PetriNetContextDefault>({
  petriNetDiagram: null,
  petriNet: new PetriNet(),
});

interface UsePetriNetArgs {
  onSelect?: (type: "place" | "transition" | null, id: string) => void;
}

/**
 * Access the petri net model.
 */
export function usePetriNet(args?: UsePetriNetArgs) {
  const { petriNetDiagram, petriNet } = useContext(PetriNetContext);
  const { onSelect } = args || {};

  useEffect(() => {
    // Only bind on select if the callback is defined.
    if (onSelect) {
      const handleSelect = () => {
        const node = petriNetDiagram?.selected;
        if (node instanceof DiagramPlace) {
          onSelect("place", node.place.id);
        } else if (node instanceof DiagramTransition) {
          onSelect("transition", node.transition.id);
        } else {
          // Nothing selected
          onSelect(null, "");
        }
      };
      petriNetDiagram?.on("select", handleSelect);
      return () => petriNetDiagram?.off("select", handleSelect);
    }
  });

  return {
    petriNetDiagram: petriNetDiagram,
    petriNet: petriNet,
  };
}

/**
 * Access a place model.
 */
export function usePlace(id: string) {
  const { petriNet } = usePetriNet();
  const place = petriNet.getPlace(id);

  const [data, setData] = useState<PlaceData>({
    id: place.id,
    tokens: place.tokens,
  });

  const handleSetTokens = (tokens: number) => {
    place.setToken(tokens);
  };

  useEffect(() => {
    const handleUpdate = () => {
      setData({
        id: place.id,
        tokens: place.tokens,
      });
    };
    place.on("update", handleUpdate);
    return () => place.off("update", handleUpdate);
  }, [place]);

  return {
    data: data,
    setTokens: handleSetTokens,
  };
}

export function useTransition(id: string) {
  const { petriNet } = usePetriNet();
  const transition = petriNet.getTransition(id);
  const [data, setData] = useState<TransitionData>({
    id: transition.id,
    probability: transition.probability,
  });

  useEffect(() => {
    transition.on("update", () => {
      setData({
        id: transition.id,
        probability: transition.probability,
      });
    });
  });

  return {
    data,
    setProbability: (probability: number) =>
      transition.setProbability(probability),
  };
}

export default PetriNetContext;
