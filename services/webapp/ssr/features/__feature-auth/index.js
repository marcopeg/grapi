import registerModels from './register/models'
import registerGraphql from './register/graphql'
import registerSession from './register/session'

export const register = ({ registerAction, createHook }) => {
    registerModels({ registerAction, createHook })
    registerGraphql({ registerAction, createHook })
    registerSession({ registerAction, createHook })
}
