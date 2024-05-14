import PropTypes from 'prop-types';
import { useCallback, useState } from 'react';
// import cn from "classnames";

import useVersion from '@/hooks/useVersion';
import { IConfigDefinitionBase } from '@/type/configDefinition';
import { ConfigContextProvider } from './ConfigContext';
import ConfigureContent from './ConfigureContent';
import { applyFieldSync } from './utils';

interface IProps {
	definitions: IConfigDefinitionBase[];
	onChange: (newConfig: any) => void;
	config: any;
	integrationConfig?: any;
}
function Configuration(props: IProps) {
	const { definitions, onChange, config: nodeConfig, integrationConfig } = props;
	const [config, setConfig] = useState(nodeConfig);
	const [version, update] = useVersion();

	const updateConfig = useCallback(
		(newConfig, sourceInputs) => {
			const nextConfig = applyFieldSync(definitions, newConfig, sourceInputs);
			setConfig(nextConfig);
			onChange && onChange(nextConfig);
		},
		[definitions, onChange],
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
			<ConfigureContent definitions={definitions} />
		</ConfigContextProvider>
	);
}
Configuration.propTypes = {
	definitions: PropTypes.array,
	className: PropTypes.string,
	style: PropTypes.object,
};

export default Configuration;
