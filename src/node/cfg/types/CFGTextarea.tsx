import React, { useContext } from "react";
import { Textarea } from "@mantine/core";
import PropTypes from "prop-types";
import { labelRequired } from "./CFGString";
import { ConfigurationType as CT } from "../cfg-type";
import useDef from "../useDef";
import DefContext, { DISABLED_FIELDS_PATH } from "../DefContext";

function CFGTextarea(props) {
  const { definition: def, className, style } = props;
  const [fv, updateFv, readonly] = useDef(def);
  const { placeholder, required, type } = def;
  const { getFieldValue } = useContext(DefContext);

  const disableFields = (getFieldValue(DISABLED_FIELDS_PATH) || []).includes(
    def.fieldName
  );

  return (
    <Textarea
      disabled={readonly || disableFields}
      value={fv}
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
