import React from "react";
import { Checkbox } from "@mantine/core";
import PropTypes from "prop-types";
import useDef from "../useDef";

function ConfigCheckbox({ definition: def }) {
  const [fieldValue, updateFv, readonly] = useDef(def);
  const onChange = (e) => updateFv(e.target.checked);
  const checked = fieldValue !== undefined ? fieldValue : !!def.defaultValue;
  return (
    <div className="row-flex-center">
      <Checkbox checked={checked} onChange={onChange} disabled={readonly}>
        {def.text}
      </Checkbox>
    </div>
  );
}

ConfigCheckbox.propTypes = {
  definition: PropTypes.object,
};

const Default = React.memo(ConfigCheckbox);
export default Default;
