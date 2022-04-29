interface Observer {
    update: () => void;
}

/**
 * Implementation of Subject/Observable class.
 */
class Observable {
    observers: Observer[];

    constructor() {
        this.observers = [];
    }

    notifyObservers() {
        this.observers.forEach(o => o.update());
    }

    registerObserver(o: Observer) {
        this.observers.push(o);
    }
}

export {Observable, Observer}