import { type DirectiveBinding, type ObjectDirective, toValue } from "vue"
import { intersect } from "./core"
import type {
    IntersectDirectiveValue,
    IntersectHandler,
    IntersectOptions,
} from "./types"

export type IntersectDirective = ObjectDirective<
    Element,
    IntersectDirectiveValue,
    "once"
>

type Resolved = {
    handler: IntersectHandler | undefined
    options: IntersectOptions
}

type Binding = Resolved & {
    stop: () => void
}

const resolve = (
    defaults: IntersectOptions,
    { arg, modifiers, value }: DirectiveBinding<IntersectDirectiveValue>,
): Resolved => {
    const options: IntersectOptions = { ...defaults }
    if (arg) {
        options.root = arg
    }
    if (modifiers.once) {
        options.once = true
    }

    if (typeof value === "function") {
        return { handler: value, options }
    }
    if (!value) {
        return { handler: undefined, options }
    }
    const { handler, ...local } = value
    return { handler, options: { ...options, ...local } }
}

const sameThreshold = (
    a: IntersectOptions["threshold"],
    b: IntersectOptions["threshold"],
) => String(a) === String(b)

// Options that IntersectionObserver reads only when it is created.
const needsRestart = (a: IntersectOptions, b: IntersectOptions) =>
    a.root !== b.root ||
    a.rootMargin !== b.rootMargin ||
    a.once !== b.once ||
    !sameThreshold(a.threshold, b.threshold)

/**
 * Build a `v-intersect` directive that falls back to the given defaults.
 * `createIntersect()` uses this to register a directive tied to its
 * options.
 */
export const createIntersectDirective = (
    defaults: IntersectOptions = {},
): IntersectDirective => {
    const bindings = new WeakMap<Element, Binding>()

    const start = (el: Element, resolved: Resolved) => {
        const binding: Binding = {
            ...resolved,
            stop: () => {},
        }
        if (binding.handler) {
            // Read the handler from the binding so updates apply without
            // recreating the observer.
            binding.stop = intersect(
                el,
                (entry, target) => binding.handler?.(entry, target),
                {
                    ...binding.options,
                    // Read `disabled` from the binding for the same reason.
                    disabled: () => toValue(binding.options.disabled),
                },
            )
        }
        bindings.set(el, binding)
    }

    const stop = (el: Element) => {
        bindings.get(el)?.stop()
        bindings.delete(el)
    }

    return {
        mounted(el, binding) {
            start(el, resolve(defaults, binding))
        },
        updated(el, binding) {
            const current = bindings.get(el)
            const next = resolve(defaults, binding)
            if (
                current &&
                Boolean(current.handler) === Boolean(next.handler) &&
                !needsRestart(current.options, next.options)
            ) {
                current.handler = next.handler
                current.options = next.options
                return
            }
            stop(el)
            start(el, next)
        },
        beforeUnmount(el) {
            stop(el)
        },
        getSSRProps: () => ({}),
    }
}

/**
 * Run a handler when the element scrolls into view.
 *
 * @example
 * ```vue
 * <section v-intersect="onEnter">…</section>
 * <section v-intersect.once="onEnter">…</section>
 * <section v-intersect="{ handler: onEnter, rootMargin: '0px 0px -20% 0px' }">…</section>
 * ```
 */
export const vIntersect: IntersectDirective = createIntersectDirective()
