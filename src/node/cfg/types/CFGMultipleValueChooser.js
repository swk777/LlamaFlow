import React from 'react'
import PropTypes from 'prop-types'
import CFGValueChooser from './CFGValueChooser'

function CFGMultipleValueChooser (props) {
    return <CFGValueChooser mode="multiple" {...props} />
}

CFGMultipleValueChooser.propTypes = {
    definition: PropTypes.object,
    className: PropTypes.string,
    style: PropTypes.object,
}
const Default = React.memo(CFGMultipleValueChooser)
export default Default

