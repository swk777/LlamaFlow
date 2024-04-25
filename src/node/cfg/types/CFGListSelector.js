import React, { useMemo, useContext } from "react";
import { Select } from "@guandata/design";
import PropTypes from "prop-types";
import defaultTo from "ramda/src/defaultTo";
import zipWith from "ramda/src/zipWith";
import useDef from "../../cfg/useDef";
import NamespaceContext from "../../cfg/NamespaceContext";

const { GDSelect } = Select;

const zipFunc = zipWith((t, v) => ({ text: t || [], value: defaultTo([], v) }));

function CFGListSelector(props) {
  const { definition, mode, style, className, ...others } = props;
  const [fieldValue, updateFv, readonly] = useDef(definition);
  const { outside = {} } = useContext(NamespaceContext);
  const labels = (outside.allInputs || []).map((inp) => inp.name);
  const items = useMemo(() => zipFunc(labels, labels), [labels]);
  const [v, ph] = [fieldValue, ""];
  return (
    <GDSelect
      value={v}
      onChange={updateFv}
      items={items}
      disabled={readonly}
      className={className}
      style={{ ...definition.style, ...style }}
      mode={mode}
      placeholder={ph}
      {...others}
    />
  );
}

CFGListSelector.propTypes = {
  definition: PropTypes.object,
  className: PropTypes.string,
  style: PropTypes.object,
  mode: PropTypes.string,
};

CFGListSelector.defaultProps = {
  mode: "default",
};

const Default = React.memo(CFGListSelector);
export default Default;
