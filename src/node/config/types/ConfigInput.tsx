import React, {
  useEffect,
  ReactElement,
  useCallback,
  useContext,
  useState,
  useRef,
} from "react";
import { Input } from "@mantine/core";
import DefContext from "../ConfigContext";
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
  const prevFv = useRef(fieldValue);
  const [inputValue, setInputValue] = useState(fieldValue);
  const [error, setError] = useState<String>();
  const { config } = useContext(DefContext);
  const { disabledOnMap = {} } = definition;
  const { unit, maxLength } = definition.misc || {};
  let formatter = null;
  if (unit) {
    formatter = (v): string => `${v}${unit}`;
  }
  const onChange = useCallback(
    (e): void => {
      updateFv(e.currentTarget.value);
      setInputValue(e.target.value);
    },
    [updateFv]
  );
  const onBlur = useCallback(
    (e) => {
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
        style={style}
      />
    </Input.Wrapper>
  );
}

const Default = React.memo(ConfigInput);
export default Default;
