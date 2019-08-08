import * as hooks from './hooks'

export const register = ({ registerHook, registerAction }) => {
    registerHook(hooks)
}
