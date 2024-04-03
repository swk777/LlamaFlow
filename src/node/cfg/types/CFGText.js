import React, { useContext } from 'react'
import { Input } from '@guandata/design'
import PropTypes from 'prop-types'
import { useDebounce } from '@guandata/hooks'
import CodeMirror from '../../codeEditor/CodeEditor'
import { labelRequired } from './CFGString'
import { ConfigurationType as CT } from '../../cfg/cfg-type'
import useDef from '../useDef'
import DefContext, { DISABLED_FIELDS_PATH } from '../DefContext'

const { TextArea } = Input

function CFGText (props) {
    const { definition: def, className, style } = props
    const [ fv, updateFv, readonly ] = useDef(def)
    const { mode, placeholder, required, type } = def
    const { getFieldValue } = useContext(DefContext)

    const disableFields = (getFieldValue(DISABLED_FIELDS_PATH) || []).includes(def.fieldName)

    const onChange = useDebounce(updateFv, 300)
    let codeLang = null
    switch (mode) {
        case 'text/plain': {
            return (
                <TextArea
                    disabled={readonly || disableFields}
                    value={fv}
                    onChange={e => updateFv(e.target.value)}
                    placeholder={labelRequired(placeholder, required)}
                    autoSize={{ minRows: 4, maxRows: 10 }}
                    maxLength={999}
                />
            )
        }
        case 'text/x-sql':
        case 'text/sql': {
            codeLang = 'sql'
            break
        }
        default: {
            codeLang = mode
        }
    }
    return (
        <CodeMirror
            value={fv || ''}
            options={{ mode: codeLang, readOnly: readonly }}
            onChange={onChange}
            className={className}
            style={{ minHeight: 68, maxHeight: 68, ...style }}
            supportSenior={type === CT.TEXT_CODE}
        />
    )
}

CFGText.propTypes = {
    definition: PropTypes.object,
    className: PropTypes.string,
    style: PropTypes.object,
}
const Default = React.memo(CFGText)
export default Default
