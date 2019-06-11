/**
 * In-memory extension definition registry
 */

import path from 'path'
import fs from 'fs-extra'

const cacheDir = path.join(__dirname, 'cache')

const data = {
    etag: 0,
    map: {},
    list: [],
}

const commitToStorage = extension =>
    fs.writeJSON(path.join(cacheDir, `${extension.name}.json`), extension, { spaces: 4 })

const commitToMemory = extension => {
    data.map[extension.name] = extension
    data.list = Object.values(data.map)
    data.etag += 1
}

export const register = extension => {
    commitToMemory(extension)
    commitToStorage(extension)
    return true
}

export const getList = () => data.list
export const getEtag = () => data.etag

export const init = async () => {
    await fs.ensureDir(cacheDir)
    const extensions = await fs.readdir(cacheDir)

    await Promise.all(extensions.map(async src => {
        const ext = await fs.readJSON(path.join(cacheDir, src))
        commitToMemory(ext)
    }))
}
