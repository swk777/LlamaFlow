import React, { useState, useContext, useRef, useMemo, useCallback, useEffect } from 'react'
import { Icon } from '@guandata/design'
import PropTypes from 'prop-types'
import cn from 'classnames'
import R from '@guandata/guandata-web-utils/lib/ramdaLite'
import eventEmitter, { EM_EVENTS } from '../../../core/eventEmitter'
import { addIndexKey, getIndexKey } from '../../../core/utils'
import useDef from '../useDef'
import { chooseCls, getColorVar } from '../../style'
import DefContext, { DefContextProvider, DISABLED_FIELDS_PATH } from '../DefContext'
import CFGContext from '../CFGContext'
import { genSortMove, useHandleSort } from '../../sort/Sortable'
import { ConfigurationType } from '../cfg-type'

export const updateIndex = (index, val) => (vals) => vals.map((v, i) => i === index ? val : v)

const getEnableStyle = (disabled) => ({
    color: getColorVar('grey-600', disabled ? 0.6 : 1),
    cursor: chooseCls('not-allowed', 'pointer')(disabled),
})

export function AddIcon (props) {
    const { addNew, readonly } = props
    const style = getEnableStyle(readonly)
    return (
        <Icon name="add_item color-text-icon-default ml-8" onClick={readonly ? null : addNew} style={style} />
    )
}
AddIcon.propTypes = {
    readonly: PropTypes.bool,
    addNew: PropTypes.func,
}

export function ListOperator (props) {
    const { canAdd, canDel = true, onDel, onAdd, disabled } = props
    const [ addStyle, delStyle ] = [ {}, {} ]
    if (!canAdd) addStyle.visibility = 'hidden'
    if (!canDel) delStyle.visibility = 'hidden'
    return (
        <div
            className="row-flex-center jc-center"
            style={{ height: 20, width: 54, borderRadius: 10, ...getEnableStyle(disabled) }}
        >
            <Icon name="delete_item" onClick={onDel} style={delStyle} disabled={disabled} />
            <Icon name="add_item ml-16" onClick={onAdd} style={addStyle} disabled={disabled} />
        </div>
    )
}
ListOperator.propTypes = {
    canAdd: PropTypes.bool,
    canDel: PropTypes.bool,
    onDel: PropTypes.func,
    onAdd: PropTypes.func,
    disabled: PropTypes.bool,
}

export function Row ({ dragItem, move, sortable, ...props }) {
    const fakeRef = useRef(null)
    const [ dragRef, dropRef, isDragging ] = useHandleSort(dragItem, move)
    const opacity = isDragging ? 0 : 1
    const containerStyle = useMemo(() => ({ padding: '5px 0', opacity }), [ opacity ])
    const ref = props.readonly ? fakeRef : dragRef
    return (
        <div ref={dropRef} style={{ ...containerStyle, ...props.style }} className="row-flex-center">
            {sortable && (
                <div ref={ref} style={{ width: 20 }} className="row-flex-center">
                    <Icon name="drag" className="font-l" />
                </div>
            )}
            {props.children}
        </div>
    )
}
Row.propTypes = {
    dragItem: PropTypes.object,
    move: PropTypes.func,
    sortable: PropTypes.bool,
    readonly: PropTypes.bool,
    children: PropTypes.node,
    style: PropTypes.object,
}

const lineStyle = { minHeight: 32, maxHeight: 64 }

const genFallbackModel = (def) => ({
    configDefinition: { mode: def.mode, type: ConfigurationType.STRING },
    initValue: '',
    sortEnabled: true,
})

function CFGList (props) {
    const { definition } = props
    const { configDefinition, initValue = undefined, sortEnabled } = definition.model || genFallbackModel(definition)
    const { getTargetCFGClass, TitleClass } = useContext(CFGContext)
    const { getFieldValue } = useContext(DefContext)

    const [ fv, updateFv, readonly ] = useDef(definition)
    const disableFields = getFieldValue(DISABLED_FIELDS_PATH) || []
    const disabled = disableFields.includes(definition.fieldName)
    const [ values, setValues ] = useState(() => (fv || []).map(value => addIndexKey({ value })))

    const update = useCallback(() => {
        setValues((fv || []).map(value => addIndexKey({ value })))
    }, [ fv ])

    useEffect(() => {
        eventEmitter.once(EM_EVENTS.REFRESH_CFGLIST, update)
        return () => eventEmitter.off(EM_EVENTS.REFRESH_CFGLIST, update)
    }, [ update ])

    const updateValue = useCallback((newValues) => {
        updateFv(newValues.map(R.prop('value')).filter(R.identity))
        setValues(newValues)
    }, [ updateFv, setValues ])
    const addNew = () => !readonly && updateValue(values.concat(addIndexKey({ value: initValue })))
    const genIdxChange = (i) => (val) => updateValue(updateIndex(i, val)(values))
    const move = useMemo(() => genSortMove(getIndexKey, values, updateValue), [ values, updateValue ])

    const targetDef = useMemo(() => ({ ...configDefinition, fieldName: 'value' }), [ configDefinition ])
    const TargetItem = getTargetCFGClass(targetDef)
    return (
        <div className={cn('row-flex', props.className)} style={props.style}>
            <TitleClass
                def={props.definition}
                suffix={<AddIcon readonly={readonly || disabled} addNew={addNew} />}
            />
            <div className="flex1">
                {values.map((val, i) => {
                    const [ id, type ] = [ getIndexKey(val), definition.fieldName ]
                    const item = { id, type, index: i }
                    return (
                        <Row
                            key={id}
                            dragItem={item}
                            move={move}
                            readonly={readonly}
                            sortable={sortEnabled}
                            style={i > 0 ? { marginTop: 10 } : null}
                        >
                            <DefContextProvider config={val} onChange={genIdxChange(i)} readonly={readonly || disabled}>
                                <TargetItem definition={targetDef} className="flex1" style={lineStyle} />
                            </DefContextProvider>
                            <ListOperator
                                canAdd={i === values.length - 1}
                                onDel={() => updateValue(values.filter((_, idx) => idx !== i))}
                                onAdd={addNew}
                                disabled={readonly || disabled}
                            />
                        </Row>
                    )
                })}
            </div>
        </div>
    )
}

CFGList.propTypes = {
    definition: PropTypes.object,
    className: PropTypes.string,
    style: PropTypes.object,
}

const Default = React.memo(CFGList)
export default Default
