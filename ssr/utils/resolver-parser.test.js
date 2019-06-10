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

        test('it should grab part of the response', async () => {
            const resolve = resolverParser({
                type: 'rest',
                url: 'https://jsonplaceholder.typicode.com/users',
                grab: '$2.name',
            })

            const res = await resolve()
            expect(res).toBe('Clementine Bauch')
        })
    })

    describe('GraphQL', () => {
        test('it should make a simple query', async () => {
            const resolve = resolverParser({
                type: 'graphql',
                url: 'https://countries.trevorblades.com/',
                query: '{ country (code: "IT") { code name phone currency }}',
            })

            const res = await resolve()
            expect(res.data.country.code).toBe('IT')
        })

        test('it should make a simple query2', async () => {
            const resolve = resolverParser({
                type: 'graphql',
                url: 'https://countries.trevorblades.com/',
                query: '{ continents { code name }}',
                grab: 'data.continents',
            })

            const res = await resolve()
            expect(res.length).toBe(7)
        })

        test('it should make queries with variables', async () => {
            const resolve = resolverParser({
                type: 'graphql',
                url: 'https://countries.trevorblades.com/',
                query: 'query foo ($code: String!) { country (code: $code) { code name phone currency }}',
            })

            const res = await resolve({ code: 'US' })
            expect(res.data.country.code).toBe('US')
        })

        test('it should grab part of the response', async () => {
            const resolve = resolverParser({
                type: 'graphql',
                url: 'https://countries.trevorblades.com/',
                query: 'query foo ($code: String!) { country (code: $code) { code name phone currency }}',
                grab: 'data.country.code',
            })

            const res = await resolve({ code: 'US' })
            expect(res).toBe('US')
        })
    })
})
