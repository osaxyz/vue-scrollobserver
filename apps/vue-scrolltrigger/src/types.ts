import type { MaybeRefOrGetter } from "vue"

/**
 * Called when the element enters the viewport, or the root if one is set.
 */
export type ScrollTriggerHandler = (
    entry: IntersectionObserverEntry,
    el: Element,
) => void

/**
 * Element to observe against. A string is passed to `document.querySelector()`
 * when observing starts. `null` means the viewport.
 */
export type ScrollTriggerRoot = Element | Document | string | null

export type ScrollTriggerOptions = {
    /** @default null (the viewport) */
    root?: ScrollTriggerRoot
    /** @default "0px" */
    rootMargin?: string
    /** @default 0.01 */
    threshold?: number | readonly number[]
    /** Stop observing after the handler runs once. */
    once?: boolean
    /** Skip the handler while this is true. */
    disabled?: MaybeRefOrGetter<boolean | undefined>
}

export type ScrollTriggerPluginOptions = ScrollTriggerOptions & {
    /**
     * Name of the globally registered directive, without the `v-` prefix.
     * Pass `false` to skip registration.
     * @default "scroll-trigger"
     */
    directive?: string | false
}

/**
 * `v-scroll-trigger` accepts a handler, or a handler with options.
 * `false`, `null` and `undefined` leave the element unobserved.
 */
export type ScrollTriggerDirectiveValue =
    | ScrollTriggerHandler
    | (ScrollTriggerOptions & { handler: ScrollTriggerHandler })
    | false
    | null
    | undefined
