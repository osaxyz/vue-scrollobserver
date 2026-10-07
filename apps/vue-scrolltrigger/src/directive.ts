import { type DirectiveBinding, type ObjectDirective, toValue } from "vue"
import { scrollTrigger } from "./core"
import type {
    ScrollTriggerDirectiveValue,
    ScrollTriggerHandler,
    ScrollTriggerOptions,
} from "./types"

export type ScrollTriggerDirective = ObjectDirective<
    Element,
    ScrollTriggerDirectiveValue,
    "once"
>

type Resolved = {
    handler: ScrollTriggerHandler | undefined
    options: ScrollTriggerOptions
}

type Binding = Resolved & {
    stop: () => void
}

const resolve = (
    defaults: ScrollTriggerOptions,
    { arg, modifiers, value }: DirectiveBinding<ScrollTriggerDirectiveValue>,
): Resolved => {
    const options: ScrollTriggerOptions = { ...defaults }
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
    a: ScrollTriggerOptions["threshold"],
    b: ScrollTriggerOptions["threshold"],
) => String(a) === String(b)

// Options that IntersectionObserver reads only when it is created.
const needsRestart = (a: ScrollTriggerOptions, b: ScrollTriggerOptions) =>
    a.root !== b.root ||
    a.rootMargin !== b.rootMargin ||
    a.once !== b.once ||
    !sameThreshold(a.threshold, b.threshold)

/**
 * Build a `v-scroll-trigger` directive that falls back to the given defaults.
 * `createScrollTrigger()` uses this to register a directive tied to its
 * options.
 */
export const createScrollTriggerDirective = (
    defaults: ScrollTriggerOptions = {},
): ScrollTriggerDirective => {
    const bindings = new WeakMap<Element, Binding>()

    const start = (el: Element, resolved: Resolved) => {
        const binding: Binding = {
            ...resolved,
            stop: () => {},
        }
        if (binding.handler) {
            // Read the handler from the binding so updates apply without
            // recreating the observer.
            binding.stop = scrollTrigger(
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
 * <section v-scroll-trigger="onEnter">…</section>
 * <section v-scroll-trigger.once="onEnter">…</section>
 * <section v-scroll-trigger="{ handler: onEnter, rootMargin: '0px 0px -20% 0px' }">…</section>
 * ```
 */
export const vScrollTrigger: ScrollTriggerDirective =
    createScrollTriggerDirective()
