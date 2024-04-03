import React from 'react'
import PropTypes from 'prop-types'
import { getColorVar } from '../../style'

export default function CFGDivider (props) {
    const { definition: def, className, style } = props
    const type = (def && def.dashed) ? 'dash' : 'solid'
    const borderTop = `1px ${type} ${getColorVar('grey-300')}`
    return <div className={className} style={{ minHeight: 1, borderTop, ...style }} />
}

CFGDivider.propTypes = {
    definition: PropTypes.object,
    className: PropTypes.string,
    style: PropTypes.object,
}
