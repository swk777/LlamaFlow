import React, { ReactElement, useContext, useMemo } from 'react'
import { ICFGDefinitionBase, ICFGBaseProps } from '../../../types/cfgDefinition'
import { useDataQueryTables } from '../../cfg/useDataQuery'
import NamespaceContext from '../../cfg/NamespaceContext'

interface ICFGDefinitionAsyncTables extends ICFGDefinitionBase {
    model: {
        dataSourceIdFieldName: string,
        dataSourceTypeFieldName?: string,
        targetNamespaceFieldName: string,
        modelType: string,
    }
}

export default function CFGAsyncTables ({ definition }: ICFGBaseProps<ICFGDefinitionAsyncTables>): ReactElement {
    const { targetNamespaceFieldName } = definition.model
    const [ tables, loading ] = useDataQueryTables('', definition.model)
    const { getValue, batchUpdateInside } = useContext(NamespaceContext)
    const from = useMemo(() => {
        const tableNames = tables.map(t => t.name)
        const schemas = tables.map(t => t.schema)
        return ({ labels: tableNames, values: tableNames, icons: tableNames.map(() => ({ value: 'table' })), loading, schemas })
    }, [ tables, loading ])
    if (targetNamespaceFieldName) {
        const data = getValue({ ns: 'inside', fieldName: targetNamespaceFieldName })
        if (data !== from) {
            batchUpdateInside([ targetNamespaceFieldName ], [ from ])
        }
    }
    return <React.Fragment />
}

CFGAsyncTables.hasUnifyTitle = false
