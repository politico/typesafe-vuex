/**
 * Allowed implicit type dependencies,
 * given that a project may not choose to use this helper,
 * *or* uses Vue + Vuex without Webpack at all
 */
/* tslint:disable:no-implicit-dependencies */
import { MinifyOptions } from "terser";
import { Configuration } from "webpack";

export function preserveFunctionNamesWithTerser(config: Configuration) {
    try {
        if (process.env.NODE_ENV === "production") {
            /**
             * These options are required to preserve function names when minifying w/ Vue
             * So that Vuex method names say the same,
             * and thus higher order functions (for typesafe-vuex) can still call those methods without issue
             * See:
             * https://github.com/jackkoppa/typesafe-vuex/issues/4
             * https://github.com/mrcrowl/vuex-typex/issues/22#issuecomment-475524894
             */
            const additionalTerserOptions: MinifyOptions = {
                ecma: 5,
                compress: {
                    keep_fnames: true,
                },
                warnings: false,
                mangle: {
                    keep_fnames: true,
                },
            };

            /**
             * We want to encourage users to pass in a real Webpack config, thus the type
             * However, we choose to ingore the "potentially undefined" errors by casting as any here
             * If the objects don't exist (i.e. Terser isn't being used as we'd expect),
             * we just won't attempt to add our additional options
             */
            (config as any).optimization.minimizer[0].options.terserOptions = {
                ...(config as any).optimization.minimizer[0].options.terserOptions,
                ...additionalTerserOptions,
            };
        }
    } catch (error) {
        /**
         * Swallow error, assuming that if terserOptions does not already exist on Webpack config,
         * it is not being used
         */
    }
}
