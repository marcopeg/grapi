# service-express-request-id

Assigns a `uuid` to each request and make id available to:
- `req.id`
- `X-Request-Id` header
- GraphQL `{ requestId }` (optional)

This service uses [express-request-id](https://www.npmjs.com/package/express-request-id)
under the hood and can be configured as described in that documentation page:

```js
setConfig('express.requestId.attributeName', 'foo')
setConfig('express.requestId.headerName', 'X-FOO')
```
