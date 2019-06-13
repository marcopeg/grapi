# Auth

## Session Token

As argument of the session wrapper:

```gql
{
    session(token: "xxx") {
        id
        status
    }
}
```

As header:

```
fetch('https://graphql.com/api', {
    headers: {
        'Authorization': 'Bearer xxx'
    }
})
```

As cookie:

When you use the `mutation:login` a cookie is set in the response. If you don't
use any of the abovementioned methods, the content of that cookie will be used
to validate your request.
