import 'babel-polyfill'

import { resolverParser } from './resolver-parser'

describe('resolverParser()', () => {
    describe('REST', () => {
        test('it should parse a simple get request into data', async () => {
            const resolve = resolverParser({
                type: 'rest',
                url: 'https://jsonplaceholder.typicode.com/users',
            })

            const res = await resolve()
            expect(res).toBeInstanceOf(Array)
        })

        test('it should inject parameters into the request url', async () => {
            const resolve = resolverParser({
                type: 'rest',
                url: 'https://jsonplaceholder.typicode.com/users/{{userId}}',
            })

            const res = await resolve({ userId: 2 })
            expect(res.id).toBe(2)
        })

        test('it should POST a resource using all the variables', async () => {
            const resolve = resolverParser({
                type: 'rest',
                method: 'POST',
                url: 'https://jsonplaceholder.typicode.com/posts',
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                },
                body: {
                    title: '{{title}}',
                    body: '{{body}}',
                    userId: '{{userId}}',
                },
            })

            const res = await resolve({
                title: 'foo',
                body: 'bar',
                userId: '1',
            })

            expect(res).toEqual({
                title: 'foo',
                body: 'bar',
                userId: '1',
                id: 101,
            })
        })
    })
})
