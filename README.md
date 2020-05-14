# svelte-shiki

`svelte-shiki` is a preprocessor for [Svelte](http://svelte.dev)/[Sapper](https://sapper.svelte.dev/), providing compile-time syntax highlighting of code elements through the use of [Shiki](https://github.com/octref/shiki) which does all highlighting as inline CSS styles - so no production dependencies! 🎉

## Installation

```bash
# npm
npm i -D svelte-shiki

# yarn
yarn add -D svelte-shiki
```

## Usage

Add it as a preprocessor to your rollup or webpack config, the svelte-shiki preprocessor is a named import from the svelte-shiki module:

```js
import { svelteShiki } from "svelte-shiki";


const defaultOptions = {
    theme: "nord",
    langs: undefined
}

export default {
  ...configStuff,
  plugins: [
    svelte({
      preprocess: [
          // other preprocessors ? Mdsvex for intance?
          svelteShiki()
      ]
    }),
  ],
}}

```

> ⚠️ **NOTE:** Remember to declare it for both server and client plugins!

For options, please refer to the [shiki documentation](https://github.com/octref/shiki)

### Custom themes

Want to use your own theme from VS Code?

```ts
import { svelteShiki , loadTheme } from "svelte-shiki";
const theme = loadTheme('./yourTheme.json')

export default {
  ...configStuff,
  plugins: [
    svelte({
      preprocess: [
          // other preprocessors
          svelteShiki({ theme })
      ]
    }),
  ],
}}
```

## License

MIT
