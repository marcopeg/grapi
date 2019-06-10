import { dotted } from './dotted'

describe('dotted', () => {
    const source = {
        name: 'marco',
        hobbies: [ 'paragliding', 'sailing' ],
        family: {
            father: {
                name: 'piero',
            },
            mother: {
                name: 'teresa',
            },
        },
    }

    test('it should return the same input if nothing is passed', () => {
        expect(dotted(source)).toBe(source)
    })

    test('it should grab first level properties', () => {
        expect(dotted(source, 'name')).toBe(source.name)
        expect(dotted(source, 'hobbies')).toBe(source.hobbies)
        expect(dotted(source, 'family')).toBe(source.family)
    })

    test('it should grab nested props', () => {
        expect(dotted(source, 'family.father.name')).toBe('piero')
    })

    test('it should grab a specific item in an array', () => {
        expect(dotted(source, 'hobbies.$1')).toBe('sailing')
    })

    test('it should JSON stringify a sub-tree', () => {
        expect(JSON.parse(dotted(source, 'family.father.$JSON'))).toEqual({ name: 'piero' })
    })
})
