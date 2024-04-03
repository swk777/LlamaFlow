import React, { useState, useEffect, useRef, ReactElement, useContext } from 'react'
import { Input } from '@guandata/design'
import DefContext, { DISABLED_FIELDS_PATH } from '../DefContext'
import useDef from '../useDef'
import fm from '../../../core/i18n'

export const labelRequired = (ph, required): string => {
    if (!ph || !required) return ph
    return `${ph} (${fm({ id: 'REQUIRED', cn: '必填', en: 'Required' })})`
}

interface IProps {
    definition: TSFixMe
}

function CFGDebounceString (props: IProps): ReactElement {
    const { definition: def } = props
    const [ fv, updateFv, readonly ] = useDef(def)
    const { getFieldValue } = useContext(DefContext)

    const [ value, setValue ] = useState(fv)
    const valueRef = useRef(fv)
    const updateFvRef = useRef(updateFv)
    const { placeholder, required, style } = def

    const disableFields = getFieldValue(DISABLED_FIELDS_PATH) || []
    const disable = disableFields.includes(def.fieldName)

    let formatter = null
    if (def.unit) {
        formatter = (v): string => `${v}${def.unit}`
    }
    const onChange = (e): void => {
        setValue(e.target.value)
        valueRef.current = e.target.value
    }
    const onBlur = (): void => {
        updateFv(value)
    }
    useEffect(() => setValue(fv), [ fv ])
    useEffect(() => {
        updateFvRef.current = updateFv
    }, [ updateFv ])

    useEffect(() => { // eslint-disable-line
        return () => { // eslint-disable-line
            if (valueRef.current && fv !== valueRef.current) {
                updateFvRef.current(valueRef.current)
            }
        }
    }, [ ])

    return (
        <Input
            value={value}
            onChange={onChange}
            placeholder={labelRequired(placeholder, required)}
            disabled={readonly || disable}
            formatter={formatter}
            style={style}
            onBlur={onBlur}
        />
    )
}


const Default = React.memo(CFGDebounceString)
export default Default
