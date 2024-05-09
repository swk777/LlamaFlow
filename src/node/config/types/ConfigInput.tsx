import React, {
  useEffect,
  ReactElement,
  useCallback,
  useContext,
  useState,
  useRef,
  ChangeEvent,
} from "react";
import { Input, Text } from "@mantine/core";
import ConfigContext from "../ConfigContext";
import useDef, { useDependOnMap } from "../useDef";

import {
  IConfigBaseProps,
  IConfigDefinitionBase,
} from "@/type/configDefinition";

interface IConfigInput extends IConfigDefinitionBase {
  misc?: {
    unit?: string;
    maxLength?: number;
  };
}

function ConfigInput({
  definition,
  style,
}: IConfigBaseProps<IConfigInput>): ReactElement {
  const [fieldValue, updateFv, readonly] = useDef(definition);
  const { config } = useContext(ConfigContext);
  const prevFv = useRef(fieldValue);
  const [inputValue, setInputValue] = useState(fieldValue);
  const [error, setError] = useState<String>();
  const { disabledOnMap = {} } = definition;
  const { unit, maxLength } = definition.misc || {};
  const onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>): void => {
      updateFv(e.currentTarget.value);
      setInputValue(e.target.value);
    },
    [updateFv]
  );
  const onBlur = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.value === "" && definition.required) {
        setError("Required");
        return;
      }
      updateFv(e.target.value);
    },
    [updateFv, config]
  );
  const [hasDisabledOn, fullfilled] = useDependOnMap(disabledOnMap);
  const disabled = hasDisabledOn && fullfilled;
  useEffect(() => {
    if (fieldValue !== undefined && disabled) {
      updateFv(undefined);
    }
    if (prevFv.current !== fieldValue) {
      prevFv.current = fieldValue;
      setInputValue(fieldValue);
    }
  }, [fieldValue, updateFv, disabled]);

  return (
    <Input.Wrapper
      label={definition?.label}
      className="text-left"
      description={definition?.description}
      required={definition.required}
    >
      <Input
        value={inputValue}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={definition.placeholder}
        maxLength={maxLength}
        disabled={readonly || disabled}
        error={error}
        rightSection={<Text fz="sm">{unit}</Text>}
        style={style}
      />
    </Input.Wrapper>
  );
}

export default ConfigInput;
