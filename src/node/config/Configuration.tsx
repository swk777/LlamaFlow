import React, { useContext, useCallback, useState } from "react";
import PropTypes from "prop-types";
// import cn from "classnames";

import DefContext, { ConfigContextProvider } from "./ConfigContext";
import { applyFieldSync } from "./utils";
import useVersion from "@/hooks/useVersion";
import ConfigureContent from "./ConfigureContent";

function Configuration(props) {
  const { definitions, className, style, onChange, config: nodeConfig } = props;
  const { isFieldVisible } = useContext(DefContext);
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
      config={config}
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
