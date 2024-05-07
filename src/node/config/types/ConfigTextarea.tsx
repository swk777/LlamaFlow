import React, { useContext } from "react";
import { Textarea } from "@mantine/core";
import PropTypes from "prop-types";
import { labelRequired } from "./ConfigString";
import { ConfigurationType as CT } from "../config-type";
import useDef from "../useDef";
import DefContext from "../ConfigContext";

function ConfigTextarea(props) {
  const { definition: def, className, style } = props;
  const [fieldValue, updateFv, readonly] = useDef(def);
  const { placeholder, required, type } = def;
  const { getFieldValue } = useContext(DefContext);

  return (
    <Textarea
      disabled={readonly}
      value={fieldValue}
      onChange={(e) => updateFv(e.target.value)}
      placeholder={labelRequired(placeholder, required)}
      autosize
      minRows={4}
      maxRows={10}
      maxLength={999}
    />
  );
}

ConfigTextarea.propTypes = {
  definition: PropTypes.object,
  className: PropTypes.string,
  style: PropTypes.object,
};
const Default = React.memo(ConfigTextarea);
export default Default;
