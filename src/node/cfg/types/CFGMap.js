import React, { Fragment, useState, useContext } from 'react'
import { Icon, Input } from '@guandata/design'
import PropTypes from 'prop-types'
import cn from 'classnames'
import { getNewState } from '@guandata/guandata-web-utils/lib/state'
import useDef from '../useDef'
import { getColorVar, chooseCls } from '../../style'
import CFGContext from '../CFGContext'

const getEnableStyle = (disabled) => ({
    color: getColorVar('grey-600', disabled ? 0.6 : 1),
    cursor: chooseCls('not-allowed', 'pointer')(disabled),
})

function PropValue (props) {
    const { value, onChange, disabled } = props
    const genChange = (k) => (e) => onChange({ ...value, [k]: e.target.value })
    const [ phK, phV ] = [ 'prop (必填)', 'value (选填)' ]
    return (
        <Fragment>
            <Input placeholder={phK} value={value.key} onChange={genChange('key')} disabled={disabled} />
            <Input placeholder={phV} value={value.value} onChange={genChange('value')} disabled={disabled} />
        </Fragment>
    )
}
PropValue.propTypes = {
    value: PropTypes.object,
    onChange: PropTypes.func,
    disabled: PropTypes.bool,
}
PropValue.rectify = (values) => values.filter(v => v.key)
PropValue.initValue = { key: '', value: '' }

function MapOperator (props) {
    const { canAdd, onDel, onAdd, disabled } = props
    return (
        <Fragment>
            <Icon name="delete_item" onClick={onDel} style={{ marginRight: 15 }} disabled={disabled} />
            {canAdd && <Icon name="add_item" onClick={onAdd} style={{ opacity: canAdd ? 1 : 0 }} disabled={disabled} />}
        </Fragment>
    )
}
MapOperator.propTypes = {
    canAdd: PropTypes.bool,
    onDel: PropTypes.func,
    onAdd: PropTypes.func,
    disabled: PropTypes.bool,
}

function CFGMap (props) {
    const { definition: def, className, style } = props
    const { TitleClass } = useContext(CFGContext)
    const [ fv, updateFv, readonly ] = useDef(def)
    const [ values, setValues ] = useState(fv || [])
    const MapItem = props.itemClass || PropValue
    const initValue = MapItem.initValue
    const updateValue = (newValues) => {
        if (readonly) return
        updateFv(MapItem.rectify(newValues))
        setValues(newValues)
    }
    const onAdd = () => updateValue(values.concat(initValue))
    const genChange = (i) => (v) => updateValue(getNewState(values, draft => { draft[i] = v }))
    return (
        <div key={values.length} className={cn('row-flex', className)} style={style}>
            <TitleClass
                def={def}
                suffix={<Icon name="add_item ml-4" onClick={onAdd} style={{ ...getEnableStyle(readonly) }} />}
            />
            <div key={values.length} className="column-flex flex1">
                {values.map((val, i) => (
                    <div key={`${i * i}`} className="row-flex-center" style={{ marginBottom: 10 }}>
                        <MapItem value={val} onChange={genChange(i)} disabled={readonly} />
                        <div
                            className="row-flex-center"
                            style={{ minWidth: 54, padding: '0 10px', ...getEnableStyle(readonly) }}
                        >
                            <MapOperator
                                canAdd={i === values.length - 1}
                                onDel={() => updateValue(values.filter((_, idx) => idx !== i))}
                                onAdd={onAdd}
                                disabled={readonly}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

CFGMap.propTypes = {
    definition: PropTypes.object,
    itemClass: PropTypes.func,
    className: PropTypes.string,
    style: PropTypes.object,
}
const Default = React.memo(CFGMap)
export default Default

Default.hasUnifyTitle = false
