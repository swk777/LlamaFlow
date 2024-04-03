import React, { useState, useContext, Fragment, useMemo, useCallback } from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import { FixedSizeList as VirtualList, areEqual } from 'react-window'
import _get from 'lodash/get'

import CFGTip from './CFGTip'
import CFGDivider from './CFGDivider'
import { updateIndex, AddIcon, ListOperator, Row } from './CFGList'
import useDef from '../useDef'
import DefContext, { DefContextProvider } from '../DefContext'
import NamespaceContext, { NamespaceContextProvider } from '../NamespaceContext'
import CFGContext from '../CFGContext'
import { genSortMove } from '../../sort/Sortable'
import { getIndexKey, addIndexKey, withoutIndexKey } from '../../../core/utils'

const APPEAR_SCROLL_NUM = 5

/*
 * 使用一个 context 来给 VirtualItem 组件所需的其他变量传值，
 * 从而让 React.memo 只关心 VirtualItem 自身的 props 变化
 *
 */
const VirtualItemContext = React.createContext(null)

const VirtualItemContextProvider = ({ children, value }) => (
    <VirtualItemContext.Provider value={value}>
        { children }
    </VirtualItemContext.Provider>
)

VirtualItemContextProvider.propTypes = {
    children: PropTypes.node,
    value: PropTypes.object,
}

const MemoVirtualItem = React.memo(
    ({ index, style }) => {
        const {
            values,
            move,
            readonly,
            sortEnabled,
            definition,
            genIdxChange,
            cDefs,
            updateValue,
            addNew,
        } = useContext(VirtualItemContext)
        const [ id, type ] = [ getIndexKey(values[index]), definition.fieldName ]
        const item = { id, type, index }
        const { inside, outside } = useContext(NamespaceContext)
        return (
            <Row style={{ ...style || {} }} key={id} dragItem={item} move={move} readonly={readonly} sortable={sortEnabled}>
                <DefContextProvider config={values[index]} onChange={genIdxChange(index)} readonly={readonly}>
                    <NamespaceContextProvider outside={outside} inside={inside}>
                        <BeanItem definitions={cDefs} />
                    </NamespaceContextProvider>
                </DefContextProvider>
                <ListOperator
                    canAdd={index === values.length - 1}
                    onDel={() => updateValue(values.filter((_, idx) => idx !== index))}
                    onAdd={addNew}
                    disabled={readonly}
                />
            </Row>
        )
    }, areEqual)

const genInitValue = (configDefinitions) => {
    const initValue = {}
    configDefinitions.forEach((config) => {
        if (config.defaultValue !== undefined) {
            initValue[config.fieldName] = config.defaultValue
        }
    })
    return initValue
}

const mrStyle = { marginRight: 10 }

export function BeanHeader (props) {
    const { definitions, style, className, sortable } = props
    return (
        <div className={cn('row-flex-center', className)} style={style}>
            {sortable && <div style={{ width: 20 }} />}
            {definitions.map(def => {
                const { fieldName: key } = def
                const cls = def.style ? '' : 'flex1'
                const divStyle = { ...mrStyle, ...(def.style || {}) }
                return (
                    <div key={key} style={divStyle} className={cn('row-flex-center text-left weight-600', cls)}>
                        {def.label}
                        <CFGTip def={def} style={{ marginLeft: 4 }} />
                    </div>
                )
            })}
        </div>
    )
}
BeanHeader.propTypes = {
    definitions: PropTypes.array,
    className: PropTypes.string,
    style: PropTypes.object,
    sortable: PropTypes.bool,
}

function BeanItem (props) {
    const { definitions } = props
    const { getTargetCFGClass } = useContext(CFGContext)
    return (
        <div className="row-flex flex1">
            {definitions.map(def => {
                const CFGClass = getTargetCFGClass(def)
                const cls = def.style ? 'row-flex' : 'flex1 row-flex'
                const style = { ...mrStyle, ...(def.style || {}) }
                return (
                    <div key={def.fieldName} style={style} className={cls}>
                        <CFGClass definition={def} style={def.style} className={cls} />
                    </div>
                )
            })}
        </div>
    )
}
BeanItem.propTypes = {
    definitions: PropTypes.array,
}

const sortByPosition = (a, b) => (a.displayPosition || 0) - (b.displayPosition || 0)

function CFGListBean (props) {
    const { definition } = props
    let itemHeight = 42
    if (_get(definition, 'model.configDefinitions[0].fieldName') === 'sql') itemHeight = 90
    const { configDefinitions, initValue = genInitValue(configDefinitions), hideHeader, sortEnabled } = definition.model
    const sortedDefinitions = useMemo(() => configDefinitions.sort(sortByPosition), [ configDefinitions ])

    const [ fv, updateFv, readonly ] = useDef(definition)
    const [ values, setValues ] = useState(() => (fv || []).map(addIndexKey))

    const updateValue = useCallback((newValues) => {
        updateFv(newValues.map(withoutIndexKey))
        setValues(newValues)
    }, [ updateFv, setValues ])
    const addNew = () => !readonly && updateValue(values.concat(addIndexKey(initValue || {})))
    const genIdxChange = (i) => (val) => updateValue(updateIndex(i, val)(values))
    const move = useMemo(() => genSortMove(getIndexKey, values, updateValue), [ values, updateValue ])
    const { TitleClass, getTargetCFGClass } = useContext(CFGContext)
    const titleStyle = useMemo(() => hideHeader ? null : ({ height: 20 }), [ hideHeader ])
    const { isDefVisible } = useContext(DefContext)
    const cDefs = sortedDefinitions.filter(getTargetCFGClass).filter(isDefVisible)

    const renderList = () =>
        (
            <>
                {values.length > 0 && (
                    <div className="column-flex flex1">
                        {!hideHeader && (
                            <Fragment>
                                <BeanHeader definitions={cDefs} style={{ height: 20, paddingRight: 54 }} sortable={sortEnabled} />
                                <CFGDivider style={{ margin: '0 0 5px' }} />
                            </Fragment>
                        )}
                        <VirtualItemContextProvider
                            value={{
                                values,
                                move,
                                readonly,
                                sortEnabled,
                                definition,
                                genIdxChange,
                                cDefs,
                                updateValue,
                                addNew,
                            }}
                        >
                            <VirtualList
                                width="100%"
                                height={values.length > APPEAR_SCROLL_NUM ?
                                    itemHeight * APPEAR_SCROLL_NUM : values.length * itemHeight}
                                itemCount={values.length}
                                itemSize={itemHeight}
                            >
                                { MemoVirtualItem }
                            </VirtualList>
                        </VirtualItemContextProvider>
                    </div>
                )}
            </>
        )
    return (
        <>
            <div className={cn('row-flex', props.className)} style={props.style}>
                <TitleClass
                    def={definition}
                    suffix={<AddIcon readonly={readonly} addNew={addNew} />}
                    style={titleStyle}
                />
                {renderList()}
            </div>
        </>
    )
}

CFGListBean.propTypes = {
    definition: PropTypes.object,
    className: PropTypes.string,
    style: PropTypes.object,
}

const Default = React.memo(CFGListBean)
export default Default

Default.hasUnifyTitle = false
