import pluginVue from "eslint-plugin-vue"
import tseslint from "typescript-eslint"

export default [
    { ignores: ["dist"] },
    ...pluginVue.configs["flat/recommended"],
    {
        files: ["**/*.vue"],
        languageOptions: {
            parserOptions: {
                parser: tseslint.parser,
            },
        },
        rules: {
            "vue/html-indent": ["error", 4],
            "vue/multi-word-component-names": "off",
        },
    },
]
