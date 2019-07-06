# service-express-device

Generates a `uuid` for a newly connected device and saves it into a cookie.

**NOTE:** It dependens on `service-express-cookies` to work with the cookies

## Configuration

#### express.device.setHeader

default `true`

#### express.device.headerName

default `X-Device-Id`

#### express.device.uuidVersion

default `v4`

#### express.device.attributeName

default `deviceId`

#### express.device.setCookie

default `true`

#### express.device.cookieName

default `deviceId`

#### express.device.cookieMaxAge

default `300y`

#### express.device.useClientCookie

default `false`

