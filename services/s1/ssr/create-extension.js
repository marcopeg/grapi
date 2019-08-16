import { createExtension } from '@crossroad/client'

export default params => createExtension({
    ...params,
    headers: [
        { name: 'x-grapi-signature', value: 'meta.signature' },
        { name: 'x-static-signature', value: 'staticSignature' },
    ],
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
