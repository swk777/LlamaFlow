import React from 'react'
import { Icon, Tooltip } from '@guandata/design'
import PropTypes from 'prop-types'

function CFGTip (props) {
    const { def, style } = props
    if (!def.description) return null
    const isList = Array.isArray(def.description)
    return (
        <Tooltip title={isList ? (<>{def.description.map(d => <p key={d}>{d}</p>)}</>) : def.description}>
            <Icon
                style={{ width: 12, height: 12, ...style }}
                className="no-shrink font-m color-text-hint gd-hover-blue-color"
                name="help"
            />
        </Tooltip>
    )
}

CFGTip.propTypes = {
    def: PropTypes.object,
    style: PropTypes.object,
}
const Default = React.memo(CFGTip)
export default Default
