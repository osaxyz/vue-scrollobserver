import { vi } from "vitest"

// IntersectionObserver that only reports entries when a test calls `emit()`.
export class MockIntersectionObserver {
    static instances: MockIntersectionObserver[] = []

    readonly targets = new Set<Element>()
    is_disconnected = false

    constructor(
        readonly callback: IntersectionObserverCallback,
        readonly options: IntersectionObserverInit = {},
    ) {
        MockIntersectionObserver.instances.push(this)
    }

    observe(el: Element) {
        this.targets.add(el)
    }

    unobserve(el: Element) {
        this.targets.delete(el)
    }

    disconnect() {
        this.targets.clear()
        this.is_disconnected = true
    }

    takeRecords(): IntersectionObserverEntry[] {
        return []
    }

    emit(el: Element, is_intersecting: boolean) {
        if (!this.targets.has(el)) {
            return
        }
        const entry = {
            target: el,
            isIntersecting: is_intersecting,
            intersectionRatio: is_intersecting ? 1 : 0,
        } as IntersectionObserverEntry
        this.callback([entry], this as unknown as IntersectionObserver)
    }
}

// Report an entry for `el` from every observer that is watching it.
export const emitIntersection = (el: Element, is_intersecting = true) => {
    for (const observer of MockIntersectionObserver.instances) {
        observer.emit(el, is_intersecting)
    }
}

// Observers that are still watching `el`.
export const observersOf = (el: Element) =>
    MockIntersectionObserver.instances.filter((observer) =>
        observer.targets.has(el),
    )

export const stubIntersectionObserver = () => {
    MockIntersectionObserver.instances = []
    vi.stubGlobal("IntersectionObserver", MockIntersectionObserver)
}
