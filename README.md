# rollup-plugin-preserve-directives

> Note: This plugin is still largely untested. It should work fine, but use at your own risk and please help me test it!

This plugin preserves directives when `preserveModules: true` is set in the Rollup config.

Rollup by default always removes directives like `'use client'` from the top of files. This makes sense when bundling files because directives should be applied per file, which is not possible when bundling.

When `preserveModules: true` is set, because each module is a separate output file, it's possible to keep directives, which is exactly what this plugin does. If you want to add a directive to an entire bundle, use something like [rollup-plugin-banner2](https://github.com/stropho/rollup-plugin-banner2).

## Getting started

Install:

```sh
npm install -D rollup-plugin-preserve-directives
```

Add the plugin to `rollup.config.js` and make sure you are using `preserveModules: true`, or the plugin will output a warning and do nothing:

```js
import preserveDirectives from "rollup-plugin-preserve-directives";

export default {
  output: {
    preserveModules: true,
  },
  plugins: [preserveDirectives()],
};
```

If you are using a minifier like terser, make sure that is not removing the directive again. In terser, you can set [`compress.directives`](https://terser.org/docs/api-reference#compress-options) to `false`.

## Disabling warnings

### Rollup warning

This plugin is currently not silencing the warning that Rollup outputs when it comes across directives. It looks something like this:

`(!) Module level directives cause errors when bundled, 'use client' was ignored.`

Maybe this plugin could hide that warning by default in the future, but for now you can add an `onwarn` handler in your Rollup config to ignore the warning there, [see the docs](https://rollupjs.org/configuration-options/#onwarn).

### rollup-plugin-preserve-directives warning

This plugin currently warns when it's used in a build that has `preserveModules` false, since it does nothing then. If you for some reason want to suppress this warning, you can pass the option `suppressPreserveModulesWarning: true` in the config:

```js
import preserveDirectives from "rollup-plugin-preserve-directives";

export default {
  output: {
    preserveModules: false,
  },
  // This suppresses the warning, but the plugin does nothing
  plugins: [preserveDirectives({ suppressPreserveModulesWarning: true })],
};
```

This can be useful when you have a common list of plugins for several builds, where some have `preserveModules: false` and some `true`.

### Include / exclude

To exclude certain files from being processed by this plugin, you can use the `include` and `exclude` options. These options take [minimatch globs](https://github.com/motemen/minimatch-cheat-sheet), and can be used like this:

```js
import preserveDirectives from "rollup-plugin-preserve-directives";

export default {
  output: {
    preserveModules: true,
  },
  plugins: [preserveDirectives({ exclude: ["**/*.scss", "**/*.pcss"] })],
};
```

## Motivation and usecase

While this plugin is generic and works with any directive, the motivator was to be able to build libraries that wants to provide both React Server Components and Client Components without having to use separate entrypoints.

This will never be possible in bundled builds, but with this plugin, libraries can support it for unbundled versions.

## Contributing, status and todos

This is currently an early and somewhat untested plugin, please help me try it out in more projects and report bugs! This is my first Rollup plugin, so code review and feedback is also very welcome. This plugin:

- Generates correct sourcemaps (but help me verify)
- Supports multiple directives (though I have never seen this)

Here are some random todos:

- Tests
- Prettier/Linting/EditorConfig
- If possible: Suppress the Rollup warning when this plugin is used
  - Perhaps we should instead/also export a custom `onwarn` handler that suppresses the warning if people want to add that to any builds that are not using this plugin? (If this plugin is used in one build, the directive is probably not a problem in the other build)
- Versioning, release pipeline, changelog etc
