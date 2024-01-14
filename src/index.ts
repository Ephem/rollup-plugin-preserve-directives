import MagicString from "magic-string";
import type { Plugin } from "rollup";

type PreserveDirectivesOptions = {
  supressPreserveModulesWarning?: boolean;
};

/**
 * This is a plugin that preserves directives like "use client" at the top of files.
 * Can only be used with preserveModules: true.
 *
 * @param {Object} options - Plugin options
 * @param {boolean} options.supressPreserveModulesWarning - Disable the warning when preserveModules is false
 */
export function preserveDirectives({
  supressPreserveModulesWarning,
}: PreserveDirectivesOptions = {}): Plugin {
  return {
    name: "preserve-directives",
    // Capture directives metadata during the transform phase
    transform(code) {
      const ast = this.parse(code);

      if (ast.type === "Program" && ast.body) {
        const directives: string[] = [];
        let i = 0;

        // Nodes in body should never be falsy, but issue #5 tells us otherwise
        // so just in case we filter them out here
        const filteredBody = ast.body.filter(Boolean);

        // .type must be defined according to the spec, but just in case..
        while (filteredBody[i]?.type === "ExpressionStatement") {
          const node = filteredBody[i];
          if ('directive' in node) {
            directives.push(node.directive);
          }
          i += 1;
        }

        if (directives.length > 0) {
          return {
            code,
            ast,
            map: null,
            meta: { preserveDirectives: directives },
          };
        }
      }

      // Return code and ast to avoid having to re-parse and
      // `map: null` to preserve source maps since we haven't modified anything
      return { code, ast, map: null };
    },
    // We check if this chunk has a module with extracted directives
    // and add that to the top.
    // Because we only run this when preserveModules: true there should
    // only be one module per chunk.
    // Banners will already have been inserted here, so directives always
    // ends up at the absolute top.
    renderChunk: {
      order: "post",
      handler(code, chunk, options) {
        if (!options.preserveModules) {
          if (!supressPreserveModulesWarning) {
            this.warn(
              "This plugin only works with the option preserveModules: true, if you want to add directives to the top of a bundled build, add it in a banner."
            );
          }

          return undefined;
        }

        let chunkHasDirectives: false | string[] = false;

        // Only do this for OutputChunks, not OutputAssets
        if ("modules" in chunk) {
          for (const moduleId of Object.keys(chunk.modules)) {
            const directives =
              this.getModuleInfo(moduleId)?.meta?.preserveDirectives;
            if (directives) {
              chunkHasDirectives = directives;
            }
          }

          if (chunkHasDirectives) {
            const directiveStrings = chunkHasDirectives
              .map((directive) => `'${directive}'`)
              .join(";\n");

            const s = new MagicString(code);
            s.prepend(`${directiveStrings};\n`);
            const srcMap = s.generateMap({ includeContent: true });

            return { code: s.toString(), map: srcMap };
          }
        }

        return null;
      },
    },
  };
}

export default preserveDirectives
