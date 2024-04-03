import React, { useState, useContext, useCallback, useEffect } from 'react'
import { Text } from '@guandata/design'
import PropTypes from 'prop-types'
import ExprEditor from '../../dataset/ExprEditor'
import useDef from '../useDef'
import NamespaceContext from '../../cfg/NamespaceContext'

import fm from '../../../core/i18n'
import { PROCESS_TYPE, DB_TYPE } from '../../../constants/tasks/task'
import { AGGREGATED_TYPES } from '../../../constants/Field'

const MSG_EDIT = { id: 'EDIT', cn: '编辑', en: 'Edit' }
const btnStyle = { width: '70px', height: '32px', lineHeight: '32px', border: '1px solid var(--color-grey-300)' }

const getTitles = (name) => {
    switch (name) {
        case 'com_guandata_plugin_spark_transform_groupby_GroupByTransform':
        case 'com_guandata_plugin_spark_transform_calculator_CalculatorTransform': {
            return {
                title: fm({ id: 'ETL.CALC-FIELD-EDITOR', cn: '计算字段编辑器', en: 'Calculated Field Editor' }),
                editorName: fm({ id: 'ETL.EXPRESSION', cn: '表达式', en: 'Expression' }),
                editorPlaceholder: fm({ id: 'ETL.CALC-FIELD-PHD', cn: '示例:`字段A`+`字段B` 请使用英文标点符号', en: 'Example: Field A + Field B, Please use English punctuation' }),
            }
        }
        case 'com_guandata_plugin_spark_source_InputDatasetSource':
        case 'com_guandata_plugin_spark_transform_rowfilter_RowFilterTransform': {
            return {
                title: fm({ id: 'ETL.CONDITION-FILTER-EDITOR', cn: '过滤规则编辑器', en: 'Condition filter editor' }),
                editorName: fm({ id: 'RULES', cn: '规则', en: 'Rules' }),
                editorPlaceholder: fm({ id: 'ETL.FILTER-FIELD-PHD', cn: '示例:`字段A`> 1 and `字段A` < 100 请使用英文标点符号', en: 'Example: Field A > 1 and Field B < 100, Please use English punctuation' }),
            }
        }
        default: return {
            title: fm({ id: 'ETL.CALC-FIELD-EDITOR', cn: '计算字段编辑器', en: 'Calculated Field Editor' }),
            editorName: fm({ id: 'ETL.EXPRESSION', cn: '表达式', en: 'Expression' }),
        }
    }
}

function CFGFormulaEditor (props) {
    const { definition: def } = props
    const [ fv, updateFv ] = useDef(def)
    const { targetNamespaceFieldName } = def.model || {}
    const { outside, batchUpdateInside } = useContext(NamespaceContext)
    const { labels = [], types = [] } = outside.inputs || {}
    const [ editorOpen, setEditorOpen ] = useState(false)

    const isExprHasAggregatedFunc = useCallback((expr) => {
        const exist = AGGREGATED_TYPES.some(t => {
            if (t === 'COUNT_DISTINCT') {
                return /(COUNT\(DISTINCT\()/i.test(expr)
            }
            if (t === 'LASTING_DAYS_TO_DATE') {
                return /(lasting_days_to_date\(collect_list\()/i.test(expr)
            }
            return new RegExp(`(${t}\\()`, 'i').test(expr)
        })
        return def.canAggregate && exist
    }, [ def ])

    useEffect(() => {
        if (fv) {
            batchUpdateInside([ targetNamespaceFieldName ], [ isExprHasAggregatedFunc(fv) ])
        }
    }, [ fv ])

    return (
        <div className="row-flex" style={{ width: '100%' }}>
            <Text className="text-center cursor-pointer" style={btnStyle} onClick={() => setEditorOpen(true)}>
                {fm(MSG_EDIT)}
            </Text>
            <div
                className="scroll-x font-m flex1 color-text-icon-default color-border-list border-base color-background-canvas pl-10"
                style={{
                    lineHeight: '32px',
                    height: 32,
                    borderLeft: 'none',
                    overflowY: 'hidden',
                    whiteSpace: 'nowrap',
                }}
            >
                {fv}
            </div>
            {
                editorOpen &&
                <ExprEditor
                    expr={fv}
                    disableHint
                    onCancel={() => setEditorOpen(false)}
                    type="calculator"
                    columns={labels.map((l, i) => ({ name: l, type: types[i] }))}
                    onOK={updateFv}
                    filterFuncTypes={def.canAggregate ? [] : AGGREGATED_TYPES}
                    titles={getTitles(outside.stageName)}
                    dbType={outside.processType === PROCESS_TYPE.DB_DATAFLOW ? DB_TYPE.POSTGRESQL : DB_TYPE.SPARK}
                    canAggregate={!!def.canAggregate}
                />
            }
        </div>
    )
}

CFGFormulaEditor.propTypes = {
    definition: PropTypes.object,
}
const Default = React.memo(CFGFormulaEditor)
export default Default
