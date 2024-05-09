import React, { useContext, useCallback, useState } from "react";
import PropTypes from "prop-types";
// import cn from "classnames";

import ConfigContext, { ConfigContextProvider } from "./ConfigContext";
import { applyFieldSync } from "./utils";
import useVersion from "@/hooks/useVersion";
import ConfigureContent from "./ConfigureContent";

function Configuration(props) {
  const {
    definitions,
    className,
    style,
    onChange,
    config: nodeConfig,
    integrationConfig,
  } = props;
  const { isFieldVisible } = useContext(ConfigContext);
  const [config, setConfig] = useState(nodeConfig);
  const [version, update] = useVersion();

  const updateConfig = useCallback(
    (newConfig, sourceInputs) => {
      const nextConfig = applyFieldSync(definitions, newConfig, sourceInputs);
      setConfig(nextConfig);
      onChange && onChange(nextConfig);
    },
    [definitions, onChange]
  );
  return (
    <ConfigContextProvider
      definitions={definitions}
      config={config}
      integrationConfig={integrationConfig}
      onChange={updateConfig}
      refresh={update}
      key={version}
    >
      <ConfigureContent definitions={definitions} style={style} />
    </ConfigContextProvider>
  );
}
Configuration.propTypes = {
  definitions: PropTypes.array,
  className: PropTypes.string,
  style: PropTypes.object,
};

export default Configuration;
