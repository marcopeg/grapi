import { createExtension } from './register-extension'

export default params => createExtension({
    ...params,
    definition: {
        queryWrapper: {
            args: [
                { name: 'xGrapiOrigin', type: 'String' },
            ],
        },
        queries: [
            {
                name: 'users',
                type: 'JSON',
                resolve: {
                    type: 'rest',
                    url: '{{ serviceUrl }}/users',
                    headers: [
                        // { name: 'x-grapi-origin', value: '{{ meta.origin }}' },
                        // { name: 'x-grapi-signature', value: '{{ meta.signature }}' },
                        // { name: 'x-static-signature', value: '{{ staticSignature }}' },
                    ],
                    rules: [
                        {
                            match: ['statusError'],
                            apply: ['statusError'],
                        },
                    ],
                },
            },
            {
                name: 'name',
                type: 'JSON',
                args: [
                    { name: 'id', type: 'ID!' },
                ],
                resolve: {
                    type: 'rest',
                    url: '{{ serviceUrl }}/users/{{ args.id }}',
                    headers: [
                        // { name: 'x-grapi-origin', value: '{{ meta.origin }}' },
                        // { name: 'x-grapi-signature', value: '{{ meta.signature }}' },
                        // { name: 'x-static-signature', value: '{{ staticSignature }}' },
                    ],
                    rules: [
                        {
                            match: ['statusError'],
                            apply: ['statusError'],
                        },
                    ],
                    grab: 'name',
                },
            },
        ],
        rules: [
            { name: 'originNotNull' },
        ],
    },
})
