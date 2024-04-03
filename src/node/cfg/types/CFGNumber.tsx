import React, { ReactElement } from 'react'
import { Input } from '@guandata/design'
import useDef from '../useDef'
import { ICFGDefinitionBase, ICFGBaseProps } from '../../../types/cfgDefinition'

const { InputNumber } = Input

interface ICFGNumber extends ICFGDefinitionBase {
    model?: {
        unit?: string
        min?: number
        max?: number
    }
    prevText?: string
    nextText?: string
}

function CFGNumber ({ definition: def, style }: ICFGBaseProps<ICFGNumber>): ReactElement {
    const [ fv, updateFv, readonly ] = useDef(def)
    const { prevText, nextText } = def
    const { unit, min = 0, max } = def.model || {}
    let formatter = null
    if (unit) {
        formatter = (v): string => `${v}${unit}`
    }
    return (
        <div className="row-flex-center">
            {prevText && <span className="no-shrink" style={{ marginRight: 10 }}>{prevText}</span>}
            <InputNumber
                value={fv}
                onChange={(v): void => updateFv(v || min)}
                formatter={formatter}
                style={{ minWidth: 60, ...style }}
                disabled={readonly}
                min={min}
                max={max}
            />
            {nextText && <span className="no-shrink ml-10">{nextText}</span>}
        </div>
    )
}


const Default = React.memo(CFGNumber)
export default Default
