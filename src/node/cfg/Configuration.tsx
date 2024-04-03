import React, { useContext } from "react";
import PropTypes from "prop-types";
// import cn from "classnames";

import DefContext from "./DefContext";
import CFGContext from "./CFGContext";
// import { hasUnifyTitle } from "./types/index";
// import ErrorBoundary from '../common/ErrorBoundary'

function Configuration(props) {
  const { definitions, className, style } = props;
  const { isDefVisible } = useContext(DefContext);
  const { getTargetCFGClass, TitleClass } = useContext(CFGContext);
  return (
    <div className={"column-flex"} style={style}>
      {/* <ErrorBoundary> */}
      {definitions &&
        definitions.map((def) => {
          const TargetDef = getTargetCFGClass(def);
          if (TargetDef && isDefVisible(def)) {
            const rowStyle = { marginTop: 10 };
            // if (hasUnifyTitle(TargetDef)) {
            //   return (
            //     <div
            //       key={def.name || def.label}
            //       className="row-flex-baseline"
            //       style={rowStyle}
            //     >
            //       <TitleClass def={def} />
            //       <TargetDef definition={def} className="flex1" />
            //     </div>
            //   );
            // }
            return (
              <TargetDef
                key={def.name || def.label}
                definition={def}
                style={rowStyle}
              />
            );
          }
          return null;
        })}
      {/* </ErrorBoundary> */}
    </div>
  );
}
Configuration.propTypes = {
  definitions: PropTypes.array,
  className: PropTypes.string,
  style: PropTypes.object,
};

export default Configuration;
