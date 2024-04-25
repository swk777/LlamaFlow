import React, { useContext, useCallback, useState } from "react";
import PropTypes from "prop-types";
// import cn from "classnames";

import DefContext, { ConfigContextProvider } from "./ConfigContext";
import CFGContext from "./CFGContext";
import { applyFieldSync } from "./utils";
import useVersion from "@/hooks/useVersion";
import { getTargetCFGClass } from "./types";
import CFGTitle from "./types/CFGTitle";
import ConfigureContent from "./ConfigureContent";
// import { hasUnifyTitle } from "./types/index";
// import ErrorBoundary from '../common/ErrorBoundary'
// const ccValue = { getTargetCFGClass, TitleClass: CFGTitle };

function Configuration(props) {
  const { definitions, className, style, onChange, config: nodeConfig } = props;
  const { isFieldVisible } = useContext(DefContext);
  const { getTargetCFGClass, TitleClass } = useContext(CFGContext);
  const [config, setConfig] = useState(nodeConfig);
  const [version, update] = useVersion();

  const updateConfig = useCallback(
    (newConfig, sourceInputs) => {
      const nextConfig = applyFieldSync(definitions, newConfig, sourceInputs);
      setConfig(nextConfig);
      onChange &&
        // onChange(nextConfig, validate(definitions, nextConfig).length === 0);
        onChange(nextConfig);
    },
    [definitions, onChange]
  );
  return (
    <ConfigContextProvider
      definitions={definitions}
      // readonly={readonly}
      config={config}
      onChange={updateConfig}
      refresh={update}
      key={version}
    >
      <CFGContext.Provider value={{}}>
        <ConfigureContent definitions={definitions} style={style} />
      </CFGContext.Provider>
    </ConfigContextProvider>
  );
}
Configuration.propTypes = {
  definitions: PropTypes.array,
  className: PropTypes.string,
  style: PropTypes.object,
};

export default Configuration;
