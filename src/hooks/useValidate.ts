import { IIntegration } from '@/type/integration';
import { INodelet } from '@/type/nodelet';
import { useEffect, useState } from 'react';
import { Node } from 'reactflow';

export default function useValidate(nodes: Node[], nodelets: INodelet[], integrations: IIntegration[]) {
	const [validateResults, setValidateResults] = useState([]);
	useEffect(() => {
		const validates = [];
		nodes.forEach((node) => {
			const nodelet = nodelets.find((n) => n.id === node.data.nodeletId);
			if (nodelet) {
				nodelet.configDefinitions.forEach((config) => {
					if (config.required && !config.defaultValue && !node.data.config[config.fieldName]) {
						validates.push({
							id: node.id,
							label: config.label,
							fieldName: config.fieldName,
							type: 'Config',
						});
					}
				});
			}
			const integration = integrations.find((i) => i.id === nodelet.id);
			if (integration) {
				integration.configDefinitions.forEach((config) => {
					if (config.required && !config.defaultValue && !integration.config[config.fieldName]) {
						validates.push({
							id: node.id,
							label: config.label,
							fieldName: config.fieldName,
							type: 'Integration',
						});
					}
				});
			}
		});

		setValidateResults(validates);
	}, [nodes, nodelets, integrations]);
	return validateResults;
}
