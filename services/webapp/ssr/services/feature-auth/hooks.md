# Auth Hooks

## ▶ auth/afterLogin

Fires after a valid login action took place.

    registerAction({
        hook: '▶ auth/afterLogin',
        name: '▶ foo.feature',
        handler: ({ req, res, id, lastLogin, token }) => {
            console.log(id, lastLogin, token)
        },
    })

# ▶ auth/beforeLogout

Fires before the session cookie is dropped.  
So fare there are no validations/informations on the current session.

    registerAction({
        hook: '▶ auth/afterLogin',
        name: '▶ foo.feature',
        handler: ({ req, res }) => {
            ...
        },
    })

## ▶ auth/session/query

Allow to inject new fields with custom resolvers inside the session query.

    registerAction({
        hook: '▶ auth/session/query',
        name: '▶ foo.feature',
        handler: ({ fields }) => {
            fields.foo = {
                type: GraphQLString,
                resolve: (params, args, { req }) =>
                    `foo, session.id: ${req.data.session.id}`,
            }
        },
    })

## ▶ auth/session/mutation

Allow to inject new fields with custom resolvers inside the session mutation.  
See `▶ auth/session/query` for a similar example
