import React, { ChangeEvent, ReactElement, useCallback, useState } from "react";
import { Input, NumberInput, Text } from "@mantine/core";
import useDef from "../useDef";
import {
  IConfigBaseProps,
  IConfigDefinitionBase,
} from "@/type/configDefinition";

interface IConfigNumber extends IConfigDefinitionBase {
  misc?: {
    unit?: string;
    min?: number;
    max?: number;
    prefix?: string;
    suffix?: string;
  };
}

function ConfigNumber({
  definition,
  style,
}: IConfigBaseProps<IConfigNumber>): ReactElement {
  const [fieldValue, updateFv, readonly] = useDef(definition);
  const [error, setError] = useState<String>();
  const { unit, min = 0, max, prefix, suffix } = definition.misc || {};
  const onBlur = useCallback(() => {
    if (fieldValue === undefined && definition.required) {
      setError("Required");
      return;
    }
  }, [updateFv]);
  return (
    <Input.Wrapper
      label={definition?.label}
      className="text-left"
      description={definition?.description}
      required={definition.required}
    >
      <NumberInput
        value={fieldValue}
        onChange={(v): void => updateFv(v || min)}
        rightSection={<Text fz="sm">{unit}</Text>}
        style={{ minWidth: 60, ...style }}
        disabled={readonly}
        min={min}
        max={max}
        suffix={suffix}
        prefix={prefix}
        onBlur={onBlur}
        error={error}
      />
    </Input.Wrapper>
  );
}

export default ConfigNumber;
