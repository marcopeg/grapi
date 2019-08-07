/**
 * In-memory extension definition registry
 */

import path from 'path'
import fs from 'fs-extra'

const data = {
    etag: 0,
    map: {},
    list: [],
}

const commitToMemory = extension => {
    data.map[extension.name] = extension
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

export const register = extension => {
    // @TODO: formal validation
    commitToMemory(extension)
    return true
}

export const getList = () => data.list
export const getEtag = () => data.etag

export const init = async (settings) => {
    // source extensions from a configuration
    const sourcePath = settings.sourcePath || process.env.GRAPHQL_EXTENSIONS_SRC
    if (sourcePath) {
        try {
            await loadFromDisk(sourcePath)
        } catch (err) {
            throw new Error(`[service-express-graphql-extension] could not source extensions from "${sourcePath}"`)
        }
    }
}
