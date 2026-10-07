import { toValue } from "vue"
import type { IntersectHandler, IntersectOptions, IntersectRoot } from "./types"

export const DEFAULT_ROOT_MARGIN = "0px"
export const DEFAULT_THRESHOLD = 0.01

/**
 * Whether the browser has `IntersectionObserver`. Always `false` during SSR.
 */
export const isIntersectSupported = (): boolean =>
    typeof IntersectionObserver === "function"

const resolveRoot = (root: IntersectRoot | undefined) =>
    typeof root === "string" ? document.querySelector(root) : (root ?? null)

/**
 * Observe `el` and pass every entry to `callback`, entering or leaving.
 * Returns a function that stops observing. Does nothing where
 * `IntersectionObserver` is unavailable.
 */
export const observeIntersection = (
    el: Element,
    options: IntersectOptions,
    callback: (entry: IntersectionObserverEntry) => void,
): (() => void) => {
    if (!isIntersectSupported()) {
        return () => {}
    }

    const observer = new IntersectionObserver(
        (entries) => {
            for (const entry of entries) {
                callback(entry)
            }
        },
        {
            root: resolveRoot(options.root),
            rootMargin: options.rootMargin ?? DEFAULT_ROOT_MARGIN,
            threshold: (options.threshold ?? DEFAULT_THRESHOLD) as
                | number
                | number[],
        },
    )
    observer.observe(el)

    return () => observer.disconnect()
}

/**
 * Run `handler` each time `el` enters the viewport, or once with
 * `once: true`. Works outside components. Returns a function that stops
 * observing.
 *
 * @example
 * ```ts
 * const stop = intersect(el, (entry) => {
 *     entry.target.classList.add("is-visible")
 * }, { once: true })
 * ```
 */
export const intersect = (
    el: Element,
    handler: IntersectHandler,
    options: IntersectOptions = {},
): (() => void) => {
    const stop = observeIntersection(el, options, (entry) => {
        if (!entry.isIntersecting || toValue(options.disabled)) {
            return
        }
        if (options.once) {
            stop()
        }
        handler(entry, el)
    })
    return stop
}
