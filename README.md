# Grapi

```json
{
    "name": "foo-extension", // alias -> FooExtension
    "inputTypes": {
        "UserInput": {
            "id": "ID!",
            "name": "String!"
        }
    },
    "types": {
        "User": {
            "id": "ID!",
            "name": "String!"
        },
        "UsersList": "[User!]"
    },
    "queries": [
        {
            "name": "fetchUsers",
            "args": {
                "foo": "String"
            },
            "type": "User"
        }
    ],
    "mutations": [
        {
            "name": "addUser",
            "args": {
                "user": "UserInput!"
            },
            "type": "Boolean"
        }
    ]
}
```

Types should be scoped with the extension name:

    User -> FooExtensionUser

