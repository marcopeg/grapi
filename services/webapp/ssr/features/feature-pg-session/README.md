# feature-session

It uses a Postgres data model to store session-related informations.

It provides ways to invalidate a session from the server, even if the cookie and
JWT owned by the client are still valid.

It works as middleware integrating some getter/setter methods into the
`req.session` namespace.
