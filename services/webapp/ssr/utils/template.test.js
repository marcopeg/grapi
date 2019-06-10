import { template } from './template'

describe('template', () => {
    test('it should return the same string', () => {
        expect(template('foo')).toBe('foo')
    })
    test('it should inject simple variable, mustache like', () => {
        expect(template('foo/{{uid}}', { uid: 'foo' })).toBe('foo/foo')
    })
    test('it should build a url with escaped contents', () => {
        const res = template('https://{{base}}/{{page}}?q={{{q}}}', {
            base: 'google.com',
            page: 'p1',
            q: 'foo::aaa',
        })

        expect(res).toBe('https://google.com/p1?q=foo%3A%3Aaaa')
    })
    test('it should use nested objects', () => {
        expect(template('{{foo.id}}', { foo: { id: 1 } })).toBe('1')
    })
})
