import React from "react";
import { Radio, Icon, Tooltip } from "@guandata/design";
import PropTypes from "prop-types";
import useDef from "../useDef";

const { RadioGroup } = Radio;

function CFGRadioGroup(props) {
  const [fieldValue, updateFv, readonly] = useDef(props.definition);
  const { labels, values, descriptions } = props.definition.model;
  const onChange = (e) => updateFv(e.target.value);
  return (
    <RadioGroup
      key={fieldValue}
      value={fieldValue}
      onChange={onChange}
      disabled={readonly}
    >
      {labels.map((label, i) => (
        <Radio style={{ minWidth: 150 }} key={values[i]} value={values[i]}>
          {label}
          {descriptions && (
            <Tooltip title={descriptions[i]}>
              <Icon name="help ml-4" />
            </Tooltip>
          )}
        </Radio>
      ))}
    </RadioGroup>
  );
}

CFGRadioGroup.propTypes = {
  definition: PropTypes.object,
};
const Default = React.memo(CFGRadioGroup);
export default Default;
