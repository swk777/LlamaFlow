import React, { useState, useRef, ReactElement, useEffect } from 'react'
import { Text, Checkbox, Input, Icon, Tooltip } from '@guandata/design'
import cn from 'classnames'
import useStyles from 'isomorphic-style-loader/useStyles'
import fm from '../../../../core/i18n'
import s from './ColumnItem.scss'

const MsgRename = { id: 'RE_NAME', cn: '重命名', en: 'rename' }
const MsgFieldMissing = { id: 'FIELD_IS_MISSING', cn: '字段已丢失', en: 'Field is missing' }

const activeCls = 'cursor-pointer color-text-info'
const disableCls = 'color-text-disable cursor-not-allowed'
const noop = (): void => {}

interface IProps {
    name: string
    newColName: string
    type: string
    missing: boolean
    checked: boolean
    onAdd: TSFixMe
    onDelete: TSFixMe
    onUpdate: TSFixMe
    disabled?: boolean
}

export default function ColumnItem (props: IProps): ReactElement {
    useStyles(s)
    const { name, newColName, type, checked, disabled, missing } = props

    const [ isEditing, setIsEditing ] = useState(false)
    const [ value, setValue ] = useState(newColName)

    useEffect(() => {
        setValue(newColName || name)
    }, [ newColName, name ])

    const inputRef = useRef(null)
    const confirm = (): void => {
        setIsEditing(false)
        if (checked) {
            props.onUpdate(name, value)
        } else {
            props.onAdd({
                colName: { name, type },
                newColName: value,
            })
        }
    }

    const handleEdit = (checked && !disabled) ? (): void => setIsEditing(true) : noop

    const onCheckChange = (e): void => {
        if (e.target.checked) {
            props.onAdd({
                colName: { name, type },
                newColName: value,
            })
        } else {
            props.onDelete(name)
        }
    }
    return (
        <div onDoubleClick={handleEdit} className={cn(s.columnItem, 'row-flex-center jc-space', checked ? 'cursor-pointer' : '')}>
            {isEditing &&
                <>
                    <Checkbox className="ml-10 mr-8" checked={checked} onChange={onCheckChange} />
                    <Input
                        ref={inputRef}
                        className={s.input}
                        value={value}
                        onChange={(e): void => setValue(e.target.value)}
                        onBlur={confirm}
                        onPressEnter={confirm}
                        size={'small'}
                        autoFocus
                    />
                </>
            }
            {!isEditing &&
                <>
                    <div className="row-flex-center ml-10">
                        <Checkbox className="mr-8" checked={checked} onChange={onCheckChange} disabled={disabled} />
                        {
                            missing &&
                            <Tooltip title={fm(MsgFieldMissing)}>
                                <Icon name="toast-warn" className="gd-color-yellow" style={{ marginRight: 6 }} />
                            </Tooltip>
                        }
                        {
                            value && value !== name &&
                            <>
                                <Text className="text-ellipsis">{value}</Text>
                                <Text className="text-ellipsis color-text-hint ml-8">
                                    {`(${name})`}
                                </Text>
                            </>
                        }
                        {
                            (!value || value === name) &&
                            <Text className="text-ellipsis">{name}</Text>
                        }
                    </div>
                    {
                        !missing &&
                        <Text
                            onClick={handleEdit}
                            className={cn(s.rename, 'no-shrink', checked ? activeCls : disableCls)}
                            style={{ margin: '0 10px 0 5px' }}
                        >
                            {fm(MsgRename)}
                        </Text>
                    }
                </>
            }
        </div>
    )
}
