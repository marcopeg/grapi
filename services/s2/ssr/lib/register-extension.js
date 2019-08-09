
export const registerExtensionJSON = async args => {
    let res = null
    try {
        res = await fetch(args.target, {
            method: 'POST',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${args.token}`,
            },
            body: JSON.stringify({
                query: `mutation reg ( $d: JSON!, $r: JSON! ) { registerExtensionJSON (definition: $d, rules: $r) }`,
                variables: {
                    d: args.definition,
                    r: args.rules || [],
                },
            }),
        })
    } catch (err) {
        throw new Error(`fetch failed - ${err.message}`)
    }

    if (res.status !== 200) {
        throw new Error(`request failed - ${res.status} ${res.statusText}`)
    }

    try {
        return (await res.json()).data.registerExtensionJSON
    } catch (err) {
        throw new Error(`unexpected response format - ${err.message}`)
    }
}
