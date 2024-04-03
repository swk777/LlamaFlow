import React, { useState, useContext, useMemo, useCallback, useEffect, ReactElement } from 'react'
import { Text, Checkbox } from '@guandata/design'
import cn from 'classnames'
import useStyles from 'isomorphic-style-loader/useStyles'
import _get from 'lodash/get'
import R from '@guandata/guandata-web-utils/lib/ramdaLite'

import { useDebounceValue } from '@guandata/hooks'
import { safeNewRegExp } from '@guandata/guandata-web-utils/lib/utils'
import CFGBulkEditor from './CFGBulkEditor'
import SearchInput from '../../../components/input/SearchInput'
import ColumnItem from './options/ColumnItem'

import NamespaceContext from '../../cfg/NamespaceContext'
import useDef from '../useDef'
import { addIndexKey, getIndexKey, withoutIndexKey } from '../../../core/utils'
import fm from '../../../core/i18n'
import s from './CFGColumnSelector.scss'

const MsgAllSelect = { id: 'SELECT_ALL', cn: '全选', en: 'Select All' }
const MsgSelected = { id: 'SELECTED', cn: '已选', en: 'Selected' }
const MsgPh = { id: 'SEARCH_COL', cn: '搜索列', en: 'Search column' }

const activeCls = 'cursor-pointer color-text-info'
const disableCls = 'color-text-disable cursor-not-allowed'
const noop = (): void => { }
const getColName = (v): string => _get(v, 'colName.name')

const getInputName = (definition): string => {
    if (definition.inputName) return definition.inputName
    if (definition.name === 'selectLeftTableColumns') return 'input1'
    if (definition.name === 'selectRightTableColumns') return 'input2'
    return 'inputs'
}

interface IProps {
    definition: TSFixMe
}

function CFGColumnSelector (props: IProps): ReactElement {
    useStyles(s)
    const { definition } = props
    const [ fv, updateFv, readonly ] = useDef(definition)
    const [ isBulkEdit, setIsBulkEdit ] = useState(false)
    const [ values, setValues ] = useState((fv || []).filter(v => v.colName).map(addIndexKey))
    const [ search, setSearch ] = useState('')
    const { outside = {} } = useContext(NamespaceContext)
    const { labels = [], types = [] } = outside[getInputName(definition)] || {}
    const missFields = useMemo(() =>
        values.map(v => ({ ...v.colName, missing: true })).filter(v => labels.indexOf(v.name) === -1), [ labels, values ])
    const updateValue = useCallback((newValues) => {
        updateFv(newValues.map(withoutIndexKey))
        setValues(newValues)
    }, [ updateFv, setValues ])

    const getType = (v): string => types[labels.indexOf(v)] || ''

    const debounceSearchValue = useDebounceValue(search, 200)
    const columns = useMemo(() => {
        if (debounceSearchValue) {
            try {
                const cols = labels.map(v => ({ name: v, type: getType(v) })).filter(v => {
                    const index = values.findIndex(val => getColName(val) === v.name)
                    if (index !== -1) {
                        return (values[index].newColName || values[index].colName.name).match(safeNewRegExp(debounceSearchValue, 'i'))
                    }
                    return v.name.match(safeNewRegExp(debounceSearchValue, 'i'))
                })
                return cols.map(addIndexKey)
            } catch (error) {
                return []
            }
        }
        return missFields.concat(labels.map(v => ({ name: v, type: getType(v) }))).map(addIndexKey)
    }, [ debounceSearchValue, labels, missFields ])

    const handleAdd = (v): void => {
        updateValue(values.concat(addIndexKey(v || {})))
    }
    const handleDelete = (name): void => {
        const index = values.findIndex(v => getColName(v) === name)
        const newValues = [ ...values ]
        newValues.splice(index, 1)
        updateValue(newValues)
    }
    const handleUpdate = (name, newColName): void => {
        const index = values.findIndex(v => getColName(v) === name)
        const newValues = [ ...values ]
        newValues[index] = {
            ...newValues[index],
            newColName,
        }
        updateValue(newValues)
    }
    const handleSelectAll = (e): void => {
        const checked = e.target.checked
        if (checked) {
            const newValues = []
            columns.forEach(col => {
                const index = values.findIndex(v => getColName(v) === col.name)
                if (index === -1) {
                    newValues.push({
                        colName: { ...col },
                        newColName: '',
                    })
                }
            })
            updateValue(values.concat(newValues))
        } else {
            updateValue(values.filter(v => columns.findIndex(col => col.name === getColName(v)) === -1))
        }
    }
    const handleSwitchType = (): void => {
        if (readonly) return
        if (!isBulkEdit && fv.length === 0) {
            updateFv([ {} ])
        }
        if (isBulkEdit) {
            const legalValues = R.pipe(
                R.uniqBy(R.prop('colName')),
                R.filter((v) => columns.findIndex(col => col.name === getColName(v)) !== -1),
            )(fv)
            updateFv(legalValues)
        }
        setIsBulkEdit(!isBulkEdit)
    }
    const handleAntiSelect = (): void => {
        const newValues = []
        columns.forEach(col => {
            const index = values.findIndex(v => getColName(v) === col.name)
            if (index === -1) {
                newValues.push({
                    colName: { ...col },
                    newColName: '',
                })
            }
        })
        // 剔除选中的
        const selectedItems = values.filter(v => newValues.findIndex(val => getColName(val) === getColName(v)) !== -1)
        updateValue(selectedItems.concat(newValues))
    }

    useEffect(() => {
        if (!isBulkEdit) return
        setValues((fv || []).filter(v => v.colName && missFields.every(m => m.name !== v.colName.name)).map(addIndexKey))
    }, [ fv, isBulkEdit ])
    useEffect(() => {
        setValues((fv || []).filter(v => v.colName).map(addIndexKey))
    }, [ (fv || []).length ])

    const canAntiSelect = columns.length > 0 && !readonly
    const isAllSelected = !!columns.length && !!values.length &&
        columns.every(col => values.findIndex(v => getColName(v) === col.name) !== -1)
    const selectedNum = labels.length === 0 ? 0 : values.length

    return (
        <div className={cn(s.container, 'flex1')}>
            {!isBulkEdit && (<>
                <div className={cn(s.header, 'row-flex-center jc-space')}>
                    <div className="row-flex-center ml-10" style={{ height: 32, alignSelf: 'flex-end' }}>
                        <Checkbox checked={isAllSelected} onChange={handleSelectAll} disabled={!canAntiSelect} style={{ marginRight: 12 }}>
                            <Text>{fm(MsgAllSelect)}</Text>
                        </Checkbox>
                        <span className="color-text-hint">{fm(MsgSelected)}  {selectedNum}/{labels.length}</span>
                    </div>
                    <SearchInput
                        style={{ width: 156, margin: '10px 0' }}
                        placeholder={fm(MsgPh)}
                        onChange={(e): void => setSearch(e.target.value)}
                        disabled={readonly}
                    />
                </div>
                {columns.length > 0 &&
                    <div className={cn(s.body, 'row-flex')}>
                        {columns.map((col) => {
                            const { name, type, missing } = col
                            const val = values.find(v => getColName(v) === name)
                            const realName = val ? val.newColName : ''
                            return (
                                <ColumnItem
                                    checked={!!val}
                                    key={getIndexKey(col)}
                                    name={name}
                                    newColName={realName}
                                    type={type}
                                    missing={missing}
                                    onAdd={handleAdd}
                                    onDelete={handleDelete}
                                    onUpdate={handleUpdate}
                                    disabled={readonly}
                                />
                            )
                        })}
                    </div>
                }
            </>)}
            {isBulkEdit && <CFGBulkEditor definition={definition} missFields={missFields} />}
            <div className="row-flex-center jc-space" style={{ marginTop: 10 }}>
                <Text
                    className={cn(canAntiSelect ? activeCls : disableCls, 'ml-10')}
                    onClick={canAntiSelect ? handleAntiSelect : noop}
                >
                    {isBulkEdit ? '' : '反选'}
                </Text>
                {definition.bulkEdit &&
                    <Text
                        className={readonly ? 'color-text-disable cursor-not-allowed' : 'cursor-pointer color-text-info'}
                        onClick={handleSwitchType}
                        style={{ marginTop: '10px' }}
                    >
                        {isBulkEdit ? '切换到普通编辑模式' : '切换到批量编辑模式'}
                    </Text>
                }
            </div>
        </div>
    )
}

const Default = React.memo(CFGColumnSelector)
export default Default
