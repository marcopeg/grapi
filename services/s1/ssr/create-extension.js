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
                        { name: 'x-grapi-signature', value: 'meta.signature' },
                        { name: 'x-static-signature', value: 'staticSignature' },
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
                        { name: 'x-grapi-signature', value: 'meta.signature' },
                        { name: 'x-static-signature', value: 'staticSignature' },
                    ],
                    grab: 'name',
                },
            },
        ],
        rules: [
            { name: 'originNotNull' },
            { name: 'originWhiteList', options: { accept: ['Trevorblades'] } },
        ],
    },
})
