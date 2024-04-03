import React from 'react'
import { Divider, Text } from '@guandata/design'
import PropTypes from 'prop-types'

export default function CFGHeader (props) {
    const { definition: def, className, style } = props
    return (
        <div className={className} style={style}>
            <div className="row-flex-center" style={{ padding: '0 55px 0 0', height: 30 }}>
                {def.value.map(d => <Text key={d} className="flex1" weight={600}>{d}</Text>)}
            </div>
            <Divider />
        </div>
    )
}

CFGHeader.propTypes = {
    definition: PropTypes.object,
    className: PropTypes.string,
    style: PropTypes.object,
}
