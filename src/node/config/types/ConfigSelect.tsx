import { MultiSelect, Select } from '@mantine/core';
import { ReactElement, useContext, useEffect } from 'react';

import { IConfigBaseProps, IConfigDefinitionBase } from '@/type/configDefinition';
import ConfigContext from '../ConfigContext';
import useDef, { useDependOnMap } from '../useDef';
interface IConfigSelect extends IConfigDefinitionBase {
	disabledOnMap?: any;
	misc: {
		mode?: 'single' | 'multiple';
		values?: string[];
		integrationFieldName: string;
	};
}

function ConfigSelect(props: IConfigBaseProps<IConfigSelect>): ReactElement {
	const { definition, style, className, ...others } = props;
	const { getIntegrationValue } = useContext(ConfigContext);
	const [fieldValue, updateFv, readonly] = useDef(definition);
	const { disabledOnMap } = definition;
	const [hasDepends, fullfilled] = useDependOnMap(disabledOnMap);
	const { values = [], integrationFieldName } = definition.misc || {};
	const selectValues = integrationFieldName ? getIntegrationValue(integrationFieldName) : values;
	const disabled = hasDepends && fullfilled;
	useEffect(() => {
		if (fieldValue === undefined && definition.defaultValue !== undefined) {
			updateFv(definition.defaultValue);
		}
	}, [fieldValue, updateFv, definition]);
	useEffect(() => {
		if (definition.defaultValue !== undefined && hasDepends && fullfilled) {
			updateFv(definition.defaultValue);
		}
	}, [hasDepends, fullfilled, updateFv, definition]);

	const SelectComponent = definition?.misc?.mode === 'multiple' ? MultiSelect : Select;
	return (
		<div className="flex-1 row-flex-center">
			<SelectComponent
				required={definition.required}
				label={definition.label}
				description={definition?.description}
				value={fieldValue}
				onChange={updateFv}
				data={selectValues || []}
				disabled={disabled || readonly}
				className={className}
				style={style}
				{...others}
			/>
		</div>
	);
}

export default ConfigSelect;
