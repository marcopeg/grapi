
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
        throw new Error(`request failed - ${res.status} ${res.statusText}`)
    }

    try {
        const data = await res.json()

        if (data.errors) {
            const errHtml = data.errors.map(err => `<li>${err.message}</li>`)
            throw new Error(`<h2>Ooops!</h2>${errHtml}`)
        }

        return data
    } catch (err) {
        throw err
    }
}
