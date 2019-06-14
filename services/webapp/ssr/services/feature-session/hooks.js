import { FEATURE } from '@forrestjs/hooks'
export const FEATURE_NAME = `${FEATURE} session`
export const SESSION_GRAPHQL = `${FEATURE_NAME}/graphql`

// Allow to extend the SessionToken model capabilities
export const CONFIG_SESSION_TOKEN_MODEL = `${FEATURE_NAME}/configSessionTokenModel`
export const DECORATE_SESSION_TOKEN_MODEL = `${FEATURE_NAME}/decorateSessionTokenModel`

// Allow to hook into the generation of a new session
export const SESSION_DECORATE_TOKEN = `${FEATURE_NAME}/decorateToken`
export const SESSION_DECORATE_RECORD = `${FEATURE_NAME}/decorateRecord`
