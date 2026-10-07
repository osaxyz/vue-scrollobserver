# vue-scrolltrigger

Run code when an element scrolls into view in Vue 3, with a directive, a composable, or a plain function.<br>
<sub>要素が画面に入ったときに処理を実行する、Vue 3 向けのディレクティブ、composable、関数です。</sub>

<p align="center"><a href="#en">Read more in English</a> · <a href="#ja">日本語で読む</a></p>

<a id="en"></a>

## English

> **Important:** vue-scrolltrigger requires Vue 3.3 or later. It is the successor of `@osaxyz/intersect`, rewritten in TypeScript, and the directive is now `v-scroll-trigger` instead of `v-intersect`.

### Quick start

1. Install the package.

```sh
npm install vue-scrolltrigger
```

2. Register the plugin.

```ts
import { createApp } from "vue"
import { createScrollTrigger } from "vue-scrolltrigger"
import App from "./App.vue"

createApp(App).use(createScrollTrigger()).mount("#app")
```

3. Add `v-scroll-trigger` to an element.

```vue
<script setup lang="ts">
const onEnter = (entry: IntersectionObserverEntry) => {
    entry.target.classList.add("is-visible")
}
</script>

<template>
  <section v-scroll-trigger="onEnter">Runs every time it enters</section>
  <section v-scroll-trigger.once="onEnter">Runs only the first time</section>
</template>
```

4. Scroll the page. The handler runs when the element enters the viewport.

> **Tip:** Pass `rootMargin: "0px 0px -20% 0px"` to run the handler once the element is 20% of the screen above the bottom edge, instead of as soon as it appears.

To track whether an element is in view, use the composable. Outside components, use `scrollTrigger()`.

```ts
import { useTemplateRef } from "vue"
import { scrollTrigger, useScrollTrigger } from "vue-scrolltrigger"

const target = useTemplateRef("target")
const { isIntersecting } = useScrollTrigger(target)

const stop = scrollTrigger(el, (entry) => console.log(entry), { once: true })
```

### Technology

<details>
<summary>Built on IntersectionObserver</summary>
<br>

vue-scrolltrigger does not listen to `scroll` events or read layout on every frame. The browser reports when an element crosses the viewport, so pages with many triggers stay smooth. Each element gets its own observer, which is disconnected when the element unmounts or when `once` has run.

</details>

<details>
<summary>SSR safe</summary>
<br>

Nothing is observed on the server. `isIntersecting` from `useScrollTrigger()` starts as `false`, so the server render and hydration agree, and the directive renders no attributes on the server. Where `IntersectionObserver` does not exist, every entry point does nothing.

</details>

<details>
<summary>Published with npm provenance</summary>
<br>

Releases are built and published from GitHub Actions with npm Trusted Publishing, so no npm token exists anywhere. Each version carries a provenance statement that links it to the commit and workflow run it was built from. The build job and the job that holds the publishing credential are separate, so a compromised dependency cannot publish a fake package.

</details>

### Specification

<details>
<summary>v-scroll-trigger</summary>
<br>

| Usage | Behavior |
| --- | --- |
| `v-scroll-trigger="handler"` | Runs `handler(entry, el)` each time the element enters |
| `v-scroll-trigger.once="handler"` | Runs once, then stops observing |
| `v-scroll-trigger:[selector]="handler"` | Observes against the element matching the selector instead of the viewport |
| `v-scroll-trigger="{ handler, ...options }"` | Passes options for this element |
| `v-scroll-trigger="false"` | Does nothing |

The plugin registers the directive with the options you pass. Without the plugin, import `vScrollTrigger` in `<script setup>`. `createScrollTriggerDirective(options)` builds a directive with its own defaults.

</details>

<details>
<summary>Functions and composable</summary>
<br>

| Export | Description |
| --- | --- |
| `scrollTrigger(el, handler, options?)` | Runs `handler` when `el` enters, and returns a function that stops observing. Can be called anywhere |
| `isScrollTriggerSupported()` | Whether the browser has `IntersectionObserver`. `false` during SSR |
| `useScrollTrigger(target, handler?, options?)` | Returns a readonly `isIntersecting` ref and `stop()`. `target` can be a ref, a getter or an element, and a new element is observed when it changes |
| `createScrollTrigger(options?)` | Plugin that registers the directive and sets app-wide defaults |
| `createScrollTriggerDirective(options?)` | Builds a directive with its own defaults |

</details>

<details>
<summary>Options</summary>
<br>

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `root` | `Element \| Document \| string \| null` | `null` | Element to observe against. A string is a selector, resolved when observing starts. `null` is the viewport |
| `rootMargin` | `string` | `"0px"` | Grows or shrinks the root, in the same shape as CSS `margin` |
| `threshold` | `number \| number[]` | `0.01` | How much of the element must be visible |
| `once` | `boolean` | `false` | Stops observing after the handler runs once |
| `disabled` | `MaybeRefOrGetter<boolean>` | `false` | Skips the handler while true. Skipped entries do not use up `once` |
| `directive` | `string \| false` | `"scroll-trigger"` | `createScrollTrigger` only. Name of the directive. `false` skips registration |

Options given to the directive or to `useScrollTrigger()` take precedence over the plugin options.

</details>

<details>
<summary>Nuxt</summary>
<br>

Register the plugin in a file under `plugins/`.

```ts
import { createScrollTrigger } from "vue-scrolltrigger"

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(createScrollTrigger())
})
```

</details>

<details>
<summary>Migrating from @osaxyz/intersect</summary>
<br>

| @osaxyz/intersect | vue-scrolltrigger |
| --- | --- |
| `import intersectDirective from "@osaxyz/intersect"` | `import { createScrollTrigger } from "vue-scrolltrigger"` |
| `app.use(intersectDirective)` | `app.use(createScrollTrigger())` |
| `v-intersect="handler"` | `v-scroll-trigger="handler"` |
| `v-intersect:[selector]="handler"` | `v-scroll-trigger:[selector]="handler"` |

The handler still receives `(entry, el)`, and the defaults are the same. To keep the old name in templates, pass `createScrollTrigger({ directive: "intersect" })`.

</details>

<a id="ja"></a>

## 日本語

> **重要**：vue-scrolltrigger には Vue 3.3 以上が必要です。`@osaxyz/intersect` の後継として TypeScript で書き直したもので、ディレクティブは `v-intersect` から `v-scroll-trigger` に変わりました。

### クイックスタート

1. パッケージをインストールします。

```sh
npm install vue-scrolltrigger
```

2. プラグインを登録します。

```ts
import { createApp } from "vue"
import { createScrollTrigger } from "vue-scrolltrigger"
import App from "./App.vue"

createApp(App).use(createScrollTrigger()).mount("#app")
```

3. 要素に `v-scroll-trigger` を付けます。

```vue
<script setup lang="ts">
const onEnter = (entry: IntersectionObserverEntry) => {
    entry.target.classList.add("is-visible")
}
</script>

<template>
  <section v-scroll-trigger="onEnter">画面に入るたびに実行します</section>
  <section v-scroll-trigger.once="onEnter">最初の1回だけ実行します</section>
</template>
```

4. ページをスクロールします。要素が画面に入るとハンドラが実行されます。

> **ヒント**：`rootMargin: "0px 0px -20% 0px"` を渡すと、要素が見えた瞬間ではなく、画面の下端から 20% 上まで来たときに実行します。

要素が画面にあるかを追うときは composable を使います。コンポーネントの外では `scrollTrigger()` を使います。

```ts
import { useTemplateRef } from "vue"
import { scrollTrigger, useScrollTrigger } from "vue-scrolltrigger"

const target = useTemplateRef("target")
const { isIntersecting } = useScrollTrigger(target)

const stop = scrollTrigger(el, (entry) => console.log(entry), { once: true })
```

### テクノロジー

<details>
<summary>IntersectionObserver の上に作っています</summary>
<br>

`scroll` イベントを監視したり、フレームごとにレイアウトを読んだりしません。要素が画面の境界を越えたときにブラウザが知らせるので、トリガーが多いページでも滑らかに動きます。監視は要素ごとに1つで、要素がアンマウントされたときと `once` で実行したあとに切断します。

</details>

<details>
<summary>SSR でも安全に使えます</summary>
<br>

サーバーでは何も監視しません。`useScrollTrigger()` の `isIntersecting` は `false` で始まるので、サーバーの描画とハイドレーションの結果が一致します。ディレクティブはサーバーでは属性を出力しません。`IntersectionObserver` がない環境では、どの入口も何もしません。

</details>

<details>
<summary>npm の provenance 付きで公開しています</summary>
<br>

リリースは GitHub Actions から npm の Trusted Publishing でビルドして公開するので、npm のトークンはどこにも存在しません。各バージョンには、どのコミットとワークフローの実行からビルドしたかを示す provenance が付きます。ビルドするジョブと公開の証明書を持つジョブを分けているので、依存のどれかが乗っ取られても偽のパッケージは公開できません。

</details>

### 仕様

<details>
<summary>v-scroll-trigger</summary>
<br>

| 書き方 | 動作 |
| --- | --- |
| `v-scroll-trigger="handler"` | 要素が画面に入るたびに `handler(entry, el)` を実行します |
| `v-scroll-trigger.once="handler"` | 1回だけ実行し、監視をやめます |
| `v-scroll-trigger:[selector]="handler"` | 画面の代わりに、セレクタに一致する要素を基準にします |
| `v-scroll-trigger="{ handler, ...options }"` | この要素だけのオプションを渡します |
| `v-scroll-trigger="false"` | 何もしません |

プラグインは、渡したオプションでディレクティブを登録します。プラグインを使わない場合は、`<script setup>` で `vScrollTrigger` を import して使います。`createScrollTriggerDirective(options)` で、独自の既定値を持つディレクティブを作れます。

</details>

<details>
<summary>関数と composable</summary>
<br>

| export | 説明 |
| --- | --- |
| `scrollTrigger(el, handler, options?)` | `el` が画面に入ったら `handler` を実行し、監視をやめる関数を返します。どこからでも呼べます |
| `isScrollTriggerSupported()` | ブラウザに `IntersectionObserver` があるかを返します。SSR 中は `false` です |
| `useScrollTrigger(target, handler?, options?)` | 読み取り専用の ref の `isIntersecting` と `stop()` を返します。`target` には ref、getter、要素を渡せ、変わると新しい要素を監視します |
| `createScrollTrigger(options?)` | ディレクティブを登録し、アプリ全体の既定値を設定するプラグインです |
| `createScrollTriggerDirective(options?)` | 独自の既定値を持つディレクティブを作ります |

</details>

<details>
<summary>オプション</summary>
<br>

| オプション | 型 | 既定値 | 説明 |
| --- | --- | --- | --- |
| `root` | `Element \| Document \| string \| null` | `null` | 基準にする要素です。文字列はセレクタとして、監視を始めるときに探します。`null` は画面です |
| `rootMargin` | `string` | `"0px"` | 基準の範囲を広げたり狭めたりします。書き方は CSS の `margin` と同じです |
| `threshold` | `number \| number[]` | `0.01` | 要素のどれだけが見えたら実行するかです |
| `once` | `boolean` | `false` | ハンドラを1回実行したら監視をやめます |
| `disabled` | `MaybeRefOrGetter<boolean>` | `false` | true の間はハンドラを実行しません。実行しなかった回は `once` の1回に数えません |
| `directive` | `string \| false` | `"scroll-trigger"` | `createScrollTrigger` だけで使います。ディレクティブの名前で、`false` なら登録しません |

ディレクティブや `useScrollTrigger()` に渡したオプションは、プラグインのオプションより優先します。

</details>

<details>
<summary>Nuxt</summary>
<br>

`plugins/` の下のファイルでプラグインを登録します。

```ts
import { createScrollTrigger } from "vue-scrolltrigger"

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(createScrollTrigger())
})
```

</details>

<details>
<summary>@osaxyz/intersect からの移行</summary>
<br>

| @osaxyz/intersect | vue-scrolltrigger |
| --- | --- |
| `import intersectDirective from "@osaxyz/intersect"` | `import { createScrollTrigger } from "vue-scrolltrigger"` |
| `app.use(intersectDirective)` | `app.use(createScrollTrigger())` |
| `v-intersect="handler"` | `v-scroll-trigger="handler"` |
| `v-intersect:[selector]="handler"` | `v-scroll-trigger:[selector]="handler"` |

ハンドラが `(entry, el)` を受け取る点と、既定値は変わりません。テンプレートで古い名前を使い続けるときは、`createScrollTrigger({ directive: "intersect" })` を渡します。

</details>
