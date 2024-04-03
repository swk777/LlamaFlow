import React, { useContext } from 'react'
import { Icon } from '@guandata/design'
import PropTypes from 'prop-types'
import cn from 'classnames'
import CFGText from './CFGText'
import CFGContext from '../CFGContext'

/**
 * 跟 CFGText 相比, 只是自定义了个Title
 */
function CFGTextCode (props) {
    const { definition: def, className, style } = props
    const { TitleClass } = useContext(CFGContext)
    return (
        <div className={cn('column-flex', className)} style={style}>
            <div className="row-flex">
                <TitleClass
                    def={def}
                    prefix={<Icon name="code" className="color-text-info" style={{ marginRight: 4 }} />}
                />
                <CFGText definition={def} />
            </div>

        </div>
    )
}

CFGTextCode.propTypes = {
    definition: PropTypes.object,
    className: PropTypes.string,
    style: PropTypes.object,
}
const Default = React.memo(CFGTextCode)
export default Default
