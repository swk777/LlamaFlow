import React, { useContext } from "react";
import { Textarea } from "@mantine/core";
import PropTypes from "prop-types";
import { labelRequired } from "./CFGString";
import { ConfigurationType as CT } from "../cfg-type";
import useDef from "../useDef";
import DefContext from "../ConfigContext";

function CFGTextarea(props) {
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

CFGTextarea.propTypes = {
  definition: PropTypes.object,
  className: PropTypes.string,
  style: PropTypes.object,
};
const Default = React.memo(CFGTextarea);
export default Default;
