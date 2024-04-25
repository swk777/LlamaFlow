import React from "react";
import { Checkbox, Text } from "@guandata/design";
import PropTypes from "prop-types";
import cn from "classnames";
import zipWith from "ramda/src/zipWith";
import R from "@guandata/guandata-web-utils/lib/ramdaLite";
import useDef from "../useDef";

const zipFunc = zipWith((t, v) => ({ text: t, value: v }));

function CFGCheckboxGroup(props) {
  const [fieldValue, updateFv, readonly] = useDef(props.definition);
  const vals = (fieldValue || "").split(",").filter(R.identity);

  const { labels, values } = props.definition.model;
  const items = zipFunc(labels, values);
  const isChecked = (v) => vals.indexOf(v) !== -1;
  const onChange = (v, checked) => {
    let newVals = R.reject(R.equals(v))(vals);
    if (checked) {
      newVals = R.sortBy((val) => R.findIndex(R.propEq("value", val))(items))(
        newVals.concat(v)
      );
    }
    updateFv(newVals.join(","));
  };
  return (
    <div className={cn("row-flex-center", props.className)}>
      {items.map((item) => (
        <Checkbox
          key={item.value}
          checked={isChecked(item.value)}
          onChange={(e) => onChange(item.value, e.target.checked)}
          style={{ width: 150, marginRight: 10 }}
          disabled={readonly}
        >
          {item.text}
        </Checkbox>
      ))}
    </div>
  );
}

CFGCheckboxGroup.propTypes = {
  definition: PropTypes.object,
  className: PropTypes.string,
};

const Default = React.memo(CFGCheckboxGroup);
export default Default;
