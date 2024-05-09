import React, {
  useEffect,
  ReactElement,
  useCallback,
  useContext,
  useState,
  useRef,
} from "react";
import { Input, TagsInput } from "@mantine/core";
import ConfigContext from "../ConfigContext";
import useDef, { useDependOnMap } from "../useDef";

import {
  IConfigBaseProps,
  IConfigDefinitionBase,
} from "@/type/configDefinition";

function ConfigTags({
  definition,
  style,
}: IConfigBaseProps<IConfigDefinitionBase>): ReactElement {
  const [fieldValue, updateFv, readonly] = useDef(definition);
  const { config } = useContext(ConfigContext);
  const prevFv = useRef(fieldValue);
  const [inputValue, setInputValue] = useState<string[]>(fieldValue);
  const [error, setError] = useState<String>();
  const onChange = useCallback(
    (value: string[]): void => {
      updateFv(value);
      setInputValue(value);
    },
    [updateFv]
  );
  const onBlur = useCallback(() => {
    if (inputValue.length === 0 && definition.required) {
      setError("Required");
      return;
    }
  }, [updateFv, config]);
  const [hasDisabledOn, fullfilled] = useDependOnMap(
    definition?.disabledOnMap ?? {}
  );
  const disabled = hasDisabledOn && fullfilled;
  useEffect(() => {
    if (prevFv.current !== fieldValue) {
      prevFv.current = fieldValue;
      setInputValue(fieldValue);
    }
  }, [fieldValue, updateFv, disabled]);

  return (
    <Input.Wrapper
      label={definition?.label}
      description={definition?.description}
      required={definition.required}
      className="text-left"
    >
      <TagsInput
        onBlur={onBlur}
        data={[]}
        value={inputValue}
        onChange={onChange}
        placeholder={definition.placeholder}
        disabled={readonly || disabled}
        style={style}
        error={error}
      />
    </Input.Wrapper>
  );
}

export default ConfigTags;
