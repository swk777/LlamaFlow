import React from 'react'
import { Checkbox } from '@guandata/design'
import PropTypes from 'prop-types'
import useDef from '../useDef'

function CFGCheckbox ({ definition: def }) {
    const [ fv, updateFv, readonly ] = useDef(def)
    const onChange = e => updateFv(e.target.checked)
    const checked = fv !== undefined ? fv : !!def.defaultValue
    return (
        <div className="row-flex-center">
            <Checkbox checked={checked} onChange={onChange} disabled={readonly}>
                {def.text}
            </Checkbox>
        </div>
    )
}

CFGCheckbox.propTypes = {
    definition: PropTypes.object,
}

const Default = React.memo(CFGCheckbox)
export default Default
