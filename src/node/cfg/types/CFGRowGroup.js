import React, { useContext } from "react";
import PropTypes from "prop-types";
import cn from "classnames";
import CFGContext from "../CFGContext";
import DefContext from "../DefContext";
import { chooseCls } from "../../style";

function CFGRowGroup(props) {
  const { definition, style, className } = props;
  const { configDefinitions, align } = definition.model;
  const { getTargetCFGClass } = useContext(CFGContext);
  const { isFieldVisible } = useContext(DefContext);
  const cDefs = configDefinitions
    .filter(getTargetCFGClass)
    .filter(isFieldVisible);
  const alignRight = align !== "left";
  return (
    <div
      className={cn(
        "row-flex-center",
        chooseCls("jc-end", "")(alignRight),
        className
      )}
      style={style}
    >
      {cDefs.map((cDef, i) => {
        const TargetDef = getTargetCFGClass(cDef);
        const cStyle =
          i !== 0
            ? { marginLeft: 20, ...(cDef.style || {}) }
            : { ...(cDef.style || {}) };
        return (
          <div key={cDef.fieldName} className="row-flex-center" style={cStyle}>
            {cDef.label && (
              <span className="no-shrink" style={{ marginRight: 8 }}>
                {cDef.label}
              </span>
            )}
            <TargetDef definition={cDef} className="content-w-full" />
          </div>
        );
      })}
    </div>
  );
}

CFGRowGroup.propTypes = {
  definition: PropTypes.object,
  className: PropTypes.string,
  style: PropTypes.object,
};

CFGRowGroup.defaultProps = {
  mode: "default",
};

const Default = React.memo(CFGRowGroup);
export default Default;
