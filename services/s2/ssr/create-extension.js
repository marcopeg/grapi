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
                name: 'age',
                type: 'Int!',
                args: [
                    { name: 'id', type: 'ID!' },
                ],
                resolve: {
                    type: 'graphql',
                    url: '{{ serviceUrl }}/api',
                    query: 'query foo ($id: ID!) { user (id: $id) { age }}',
                    variables: [
                        { name: 'id', value: 'args.id' },
                    ],
                    headers: [
                        // { name: 'x-grapi-origin', value: '{{ meta.origin }}' },
                        { name: 'x-grapi-signature', value: 'meta.signature' },
                    ],
                    grab: 'data.user.age',
                },
            },
        ],
        rules: [
            { name: 'originNotNull' },
            { name: 'originWhiteList', options: { accept: ['Trevorblades'] } },
        ],
    },
})
