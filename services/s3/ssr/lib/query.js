
export const runQuery = async ({ query, variables, headers, target }) => {
    let res = null
    try {
        res = await fetch(target, {
            method: 'POST',
            cache: 'no-cache',
            headers: {
                ...(headers ? { ...headers } : {}),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query, variables }),
        })
    } catch (err) {
        throw new Error(`fetch failed - ${err.message}`)
    }

    if (res.status !== 200) {
        let message = `${res.status} ${res.statusText}`
        try {
            const data = await res.json()
            data.errors && (message = data.errors.map(err => err.message).join(' -- '))
        } catch (err) {} // eslint-disable-line

        const err = new Error(message)
        err.res = res
        throw err
    }

    try {
        const data = await res.json()

        if (data.errors) {
            const errHtml = data.errors.map(err => `<li>${err.message}</li>`)
            throw new Error(`<h2>Ooops!</h2>${errHtml}`)
        }

        return data
    } catch (_) {
        const err = new Error(_.message)
        err.res = res
        throw err
    }
}
