# service-express-device-id

Generates a `uuid` for a newly connected device and saves it into a cookie.

**NOTE:** It dependens on `service-express-cookies` to work with the cookies

## Configuration

#### express.deviceId.setHeader

default `true`

#### express.deviceId.headerName

default `X-Device-Id`

#### express.deviceId.uuidVersion

default `v4`

#### express.deviceId.attributeName

default `deviceId`

#### express.deviceId.cookieName

default `deviceId`

#### express.deviceId.cookieMaxAge

default `300y`

#### express.deviceId.useClientCookie

default `false`

