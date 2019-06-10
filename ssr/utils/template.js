/**
 * Minimal Template Engine
 * =======================
 *
 *     template('{{foo}}', { foo: 123 }) -> '123'
 *
 * The idea is to have something similar to Mustache/PUG but I don't
 * want to bring the dependency in just yet.
 *
 * ## Vars replacement
 *
 *     {{varName}}
 *
 * ## Url Encoded Replacements
 *
 *     {{{varName}}}
 *
 * ## Nested Replacements
 *
 *     {{obj.key.sub}}
 */

import flat from 'flat'

export const template = (str, vars = {}) => {
    const flatten = flat(vars)

    const replaceKey = (acc, curr) => {
        acc = acc.replace(`{{{${curr}}}}`, encodeURIComponent(flatten[curr]))
        acc = acc.replace(`{{${curr}}}`, flatten[curr])
        return acc
    }

    return Object.keys(flatten).reduce(replaceKey, str)
}
