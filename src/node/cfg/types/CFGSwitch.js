import React from 'react'
import { Switch } from '@guandata/design'
import PropTypes from 'prop-types'
import useDef from '../useDef'

function CFGSwitch (props) {
    const [ fv, updateFv, readonly ] = useDef(props.definition)
    return (
        <Switch checked={fv || false} onChange={updateFv} disabled={readonly} style={{ width: 28, marginLeft: 4 }} />
    )
}

CFGSwitch.propTypes = {
    definition: PropTypes.object,
}
const Default = React.memo(CFGSwitch)
export default Default
