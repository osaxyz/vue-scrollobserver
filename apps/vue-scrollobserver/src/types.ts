import type { MaybeRefOrGetter } from "vue"

/**
 * Called when the element enters the viewport, or the root if one is set.
 */
export type IntersectHandler = (
    entry: IntersectionObserverEntry,
    el: Element,
) => void

/**
 * Element to observe against. A string is passed to `document.querySelector()`
 * when observing starts. `null` means the viewport.
 */
export type IntersectRoot = Element | Document | string | null

export type IntersectOptions = {
    /** @default null (the viewport) */
    root?: IntersectRoot
    /** @default "0px" */
    rootMargin?: string
    /** @default 0.01 */
    threshold?: number | readonly number[]
    /** Stop observing after the handler runs once. */
    once?: boolean
    /** Skip the handler while this is true. */
    disabled?: MaybeRefOrGetter<boolean | undefined>
}

export type IntersectPluginOptions = IntersectOptions & {
    /**
     * Name of the globally registered directive, without the `v-` prefix.
     * Pass `false` to skip registration.
     * @default "intersect"
     */
    directive?: string | false
}

/**
 * `v-intersect` accepts a handler, or a handler with options.
 * `false`, `null` and `undefined` leave the element unobserved.
 */
export type IntersectDirectiveValue =
    | IntersectHandler
    | (IntersectOptions & { handler: IntersectHandler })
    | false
    | null
    | undefined
