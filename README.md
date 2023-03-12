# rollup-plugin-preserve-directives

> Note: This plugin is still largely untested. It should work fine, but use at your own risk and please help me test it!

This plugin preserves directives when `preserveModules: true` is set in the Rollup config.

Rollup by default always removes directives like `'use client'` from the top of files. This makes sense when bundling files because directives should be applied per file, which is not possible when bundling.

When `preserveModules: true` is set, because each module is a separate output file, it's possible to keep directives, which is exactly what this plugin does.

## Getting started

TODO

## Disabling warnings

TODO

## Contributing, status and todos

TODO
