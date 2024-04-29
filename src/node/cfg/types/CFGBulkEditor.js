import React, { useState, useContext, useMemo } from "react";
import { Text } from "@guandata/design";
import PropTypes from "prop-types";

import CodeEditor from "../../codeEditor/CodeEditor";

// import { getFuncs } from "../plugins";
import NamespaceContext from "../NamespaceContext";
import useDef from "../useDef";
import { isJson } from "../../../core/utils";

function CFGBulkEditor(props) {
  const { definition, missFields } = props;
  const [fieldValue, updateFv, readonly] = useDef(definition);
  const { outside } = useContext(NamespaceContext);
  const { preValues, postValues } = getFuncs(outside.stageName) || {};
  const values = preValues(
    fieldValue.filter(
      (v) => v.colName && missFields.every((m) => m.name !== v.colName.name)
    )
  );
  const dataStr = useMemo(() => JSON.stringify(values, null, "\t"), [values]);
  const [showError, setShowError] = useState(false);
  const onChange = (v) => {
    if (isJson(v)) {
      setShowError(false);
      updateFv(postValues(JSON.parse(v), outside.inputs));
      return;
    }
    setShowError(true);
  };
  return (
    <div className="column-flex flex1">
      <CodeEditor
        value={dataStr}
        onChange={onChange}
        options={{
          mode: "javascript",
          lineWrapping: true,
          lineNumbers: false,
          readonly,
        }}
        className="font-m"
        supportSenior
        style={{
          width: "100%",
          minHeight: 120,
          maxHeight: 120,
          overflow: "hidden",
        }}
      />
      {showError && (
        <Text className="color-text-destructive">{"json格式异常"}</Text>
      )}
    </div>
  );
}

CFGBulkEditor.propTypes = {
  definition: PropTypes.object,
  missFields: PropTypes.array,
};

const Default = React.memo(CFGBulkEditor);
export default Default;
