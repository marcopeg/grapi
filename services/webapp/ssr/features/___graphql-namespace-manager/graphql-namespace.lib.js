import { Sequelize } from 'sequelize'
import { getModel } from '@forrestjs/service-postgres'
import { issueExtensionToken } from '../graphql-extensions-manager'

export const createNamespace = async (args, req, res) => {
    const GraphqlNamespace = getModel('GraphqlNamespace')

    const exists = await GraphqlNamespace.findOne({
        where: { namespace: args.namespace },
    })

    if (exists) {
        throw new Error(`Namespace "${args.namespace}" already exists`)
    }

    console.log(issueExtensionToken)
    const token = await issueExtensionToken({
        namespaces: [args.namespace],
    })

    console.log(args)
    console.log(token)
    // await getModel('GraphqlNamespace').create(args)
}
