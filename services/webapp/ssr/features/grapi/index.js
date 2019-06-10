import { EXPRESS_GRAPHQL } from '@forrestjs/service-express-graphql'
import { FEATURE_NAME } from './hooks'
import { parseExtension } from '../../utils/graphql-parser'

// API Extensions
import typicodeExtension from './typicode.json'
import trevorbladesExtension from './trevorblades.json'

export const register = ({ registerAction }) => {
    registerAction({
        hook: EXPRESS_GRAPHQL,
        name: FEATURE_NAME,
        trace: __filename,
        handler: ({ queries }) => {
            const typicode = parseExtension(typicodeExtension)
            const trevorblades = parseExtension(trevorbladesExtension)

            queries.Trevorblades = trevorblades.queries.Trevorblades
            queries.Typicode = typicode.queries.Typicode
        },
    })
}
