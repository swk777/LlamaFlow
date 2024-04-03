import React, { useMemo, useEffect, useContext, ReactElement } from 'react'
import { Icon, Select, Tooltip, ISelectProps } from '@guandata/design'
import cn from 'classnames'
import PropTypes from 'prop-types'
import useStyles from 'isomorphic-style-loader/useStyles'
import R from '@guandata/guandata-web-utils/lib/ramdaLite'
import zipWith from 'ramda/src/zipWith'
import _get from 'lodash/get'
import { getColorVar } from '../../style'
import useDef, { useDependOnMap } from '../useDef'
import NamespaceContext from '../NamespaceContext'
import useDynamicSource from '../useDynamicSource'
import s from './CFGValueChooser.scss'
import { ICFGDefinitionBase, ICFGBaseProps } from '../../../types/cfgDefinition'
import fm from '../../../core/i18n'

const { GDSelect } = Select

interface ICFGValueChooser extends ICFGDefinitionBase {
    disabledOnMap?: TSFixMe
    model: {
        from?: { ns: string, fieldName: string }
        labels?: string[]
        values?: string[]
        icons?: { type: string, color?: string, value: string }[]
        allowClear?: boolean
    }
}
interface IProps extends ICFGBaseProps<ICFGValueChooser> {
    mode?: ISelectProps['mode']
    allowClear?: boolean
    onSearch?: IFuncVoid<string>
}

const MsgFieldMissing = { id: 'FIELD_IS_MISSING', cn: '字段已丢失', en: 'Field is missing' }

const zipFunc = zipWith((t, v) => ({ label: t, value: v }))

export function useSelectCheck (value, definition, isMissing, missingName?: string, cls?: string): [ string, ReactElement | string ] {
    let [ v, ph ] = [ value, definition.placeholder ]
    const icon = _get(definition, 'model.tableIcon')
    if (isMissing()) {
        v = undefined
        ph = (
            <div className={cn('row-flex-center content-h-full', cls)}>
                <Tooltip title={definition.errorPlaceholder || fm(MsgFieldMissing)}>
                    <Icon name="toast-warn" style={{ color: getColorVar('yellow'), marginRight: 4 }} />
                </Tooltip>
                {icon && (
                    <Icon name={icon} style={{ marginRight: 4 }} />
                )}
                {missingName}
            </div>
        )
    }
    return [ v, ph ]
}

function CFGValueChooser (props: IProps): ReactElement {
    useStyles(s)
    const { definition, mode, style, className, allowClear, onSearch, ...others } = props
    const [ fv, updateFv, readonly ] = useDef(definition)
    const { from } = definition.model || {}
    const { getValue } = useContext(NamespaceContext)
    const disableSelect = useMemo(() => getValue(from || { ns: '', fieldName: '' }) === true, [ getValue, from ])
    const { disabledOnMap } = definition
    const [ hasDepends, fullfilled ] = useDependOnMap(disabledOnMap)
    const { labels, values, icons = [] } = useDynamicSource(definition.model)
    const disabled = hasDepends && fullfilled || disableSelect
    useEffect(() => {
        if (fv === undefined && definition.defaultValue !== undefined) {
            updateFv(definition.defaultValue)
        }
    }, [ fv, updateFv, definition ])
    useEffect(() => {
        if (definition.defaultValue !== undefined && (hasDepends && fullfilled || disableSelect)) {
            updateFv(definition.defaultValue)
        }
    }, [ hasDepends, fullfilled, updateFv, definition, disableSelect ])
    const items = useMemo(() => zipFunc(labels, values), [ labels, values ]) as ILabelValue[]
    let renderFunc = null
    if (icons.length > 0) {
        items.forEach((item, i) => { item.icon = icons[i] })
        renderFunc = (item): ReactElement => (
            <div className="row-flex-center">
                <Icon name={item.icon && item.icon.value} style={R.pick([ 'color' ])(item.icon || {})} />
                <div style={{ marginLeft: 6 }}>{item.label || item.value}</div>
            </div>
        )
    }

    const findIsMissField = (field) => field !== undefined && items.findIndex(R.propEq('value', field)) === -1
    const missFields = mode === 'multiple' && (fv || []).filter(findIsMissField)
    const isMissing = (): boolean => mode !== 'multiple' && findIsMissField(fv)

    const [ v, ph ] = useSelectCheck(fv, definition, isMissing, fv)
    return (
        <div className="flex1 row-flex-center">
            {
                mode === 'multiple' && missFields.length > 0 && (
                    <Tooltip title={`存在丢失字段：${missFields.join('、')}`}>
                        <Icon name="toast-warn" style={{ color: getColorVar('yellow'), marginRight: 4 }} />
                    </Tooltip>
                )
            }

            <GDSelect
                showSearch
                value={v}
                onChange={updateFv}
                onSearch={onSearch}
                items={items}
                renderFunc={renderFunc}
                disabled={disabled || readonly}
                className={className}
                style={style}
                mode={mode}
                placeholder={ph}
                allowClear={allowClear || definition.model.allowClear}
                {...others}
            />
        </div>
    )
}

CFGValueChooser.propTypes = {
    definition: PropTypes.object,
    className: PropTypes.string,
    style: PropTypes.object,
    mode: PropTypes.string,
    allowClear: PropTypes.bool,
}

CFGValueChooser.defaultProps = {
    mode: 'default',
}

const Default = React.memo(CFGValueChooser)
export default Default
