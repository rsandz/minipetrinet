
/**
 * Implementation of Subject/Observable class.
 */
class Observable<Events extends string> {
    eventListeners: [Events, Function][]

    constructor() {
        this.eventListeners = [];
    }

    /**
     * Fire a specified event.
     */
    // @ts-ignore
    fire(event: Events, ...args: unknown[]) {
        this.eventListeners.forEach((observer) => {
            const [cbEvent, cb] = observer
            if (cbEvent === event) {
                cb()
            }
        })
    }

    /**
     * Register an event listener.
     */
    on(event: Events, cb: Function) {
        this.eventListeners.push([event, cb])
    }

    /**
     * Deregister an event listener.
     */
    off(event: Events, cb: Function) {
        this.eventListeners.splice(this.eventListeners.indexOf([event, cb]), 1)
    }
}

export default Observable