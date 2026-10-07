<script setup lang="ts">
import { reactive, ref, useTemplateRef } from "vue"
import { useIntersect } from "vue-scrollobserver"
import { settings } from "./settings"

const cards = Array.from({ length: 6 }, (_, index) => index + 1)
const counts = reactive<Record<number, number>>({})

const countEntry = (card: number) => () => {
    counts[card] = (counts[card] ?? 0) + 1
}

const revealed = ref(new Set<number>())
const reveal = (card: number) => () => {
    revealed.value = new Set(revealed.value).add(card)
}

const footer = useTemplateRef("footer")
const { isIntersecting: is_footer_visible } = useIntersect(footer)
</script>

<template>
    <header class="status">
        <label class="toggle">
            <input
                v-model="settings.enabled"
                type="checkbox"
            >
            Enable handlers (plugin option)
        </label>
        <span>Footer is {{ is_footer_visible ? "in view" : "out of view" }}</span>
    </header>

    <main>
        <h1>vue-scrollobserver</h1>
        <p>Scroll down. Each card counts how many times it entered the viewport.</p>

        <section aria-labelledby="every-heading">
            <h2 id="every-heading">
                v-intersect
            </h2>
            <article
                v-for="card in cards"
                :key="card"
                v-intersect="countEntry(card)"
                class="card"
            >
                Card {{ card }} entered {{ counts[card] ?? 0 }} times
            </article>
        </section>

        <section aria-labelledby="once-heading">
            <h2 id="once-heading">
                v-intersect.once
            </h2>
            <article
                v-for="card in cards"
                :key="card"
                v-intersect.once="reveal(card)"
                class="card reveal"
                :class="{ 'is-revealed': revealed.has(card) }"
            >
                Card {{ card }} fades in once
            </article>
        </section>
    </main>

    <footer ref="footer">
        useIntersect tracks this footer.
    </footer>
</template>
