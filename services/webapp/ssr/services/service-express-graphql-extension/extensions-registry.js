/**
 * In-memory extension definition registry
 */

import path from 'path'
import fs from 'fs-extra'

const data = {
    sourcePath: null,
    etag: 0,
    map: {},
    list: [],
}

const commitToMemory = (definition, rules) => {
    data.map[definition.name] = { definition, rules }
    data.list = Object.values(data.map)
    data.etag += 1
}

export const loadFromDisk = async sourcePath => {
    const extensions = await fs.readdir(sourcePath)
    await Promise.all(extensions.map(async src => {
        const ext = await fs.readJSON(path.join(sourcePath, src))
        commitToMemory(ext)
    }))
}

export const register = (definition, rules) => {
    commitToMemory(definition, rules)
    return true
}

export const reflow = async () => {
    // reset the extensions database
    data.map = {}
    data.list = []

    // load file system extensions
    if (data.sourcePath) {
        try {
            await loadFromDisk(data.sourcePath)
        } catch (err) {
            throw new Error(`[service-express-graphql-extension] could not source extensions from "${data.sourcePath}"`)
        }
    }
}

export const getList = () => data.list
export const getEtag = () => data.etag
export const getRules = extension => data.map[extension].rules

export const init = async (settings) => {
    data.sourcePath = settings.sourcePath || process.env.GRAPHQL_EXTENSIONS_SRC
    return reflow()
}
