import React, { ReactElement } from "react";
import { NumberInput } from "@mantine/core";
import useDef from "../useDef";
import {
  IConfigBaseProps,
  IConfigDefinitionBase,
} from "@/type/configDefinition";

// const { InputNumber } = Input;

interface IConfigNumber extends IConfigDefinitionBase {
  misc?: {
    unit?: string;
    min?: number;
    max?: number;
  };
  prefix?: string;
  suffix?: string;
}

function ConfigNumber({
  definition: def,
  style,
}: IConfigBaseProps<IConfigNumber>): ReactElement {
  const [fieldValue, updateFv, readonly] = useDef(def);
  const { prefix, suffix } = def;
  const { unit, min = 0, max } = def.misc || {};
  //   let formatter = null;
  //   if (unit) {
  //     formatter = (v): string => `${v}${unit}`;
  //   }
  return (
    <div className="row-flex-center">
      {prefix && (
        <span className="shrink-0" style={{ marginRight: 10 }}>
          {prefix}
        </span>
      )}
      <NumberInput
        value={fieldValue}
        onChange={(v): void => updateFv(v || min)}
        // formatter={formatter}
        style={{ minWidth: 60, ...style }}
        disabled={readonly}
        min={min}
        max={max}
        suffix={unit}
      />
      {suffix && <span className="shrink-0 ml-10">{suffix}</span>}
    </div>
  );
}

const Default = React.memo(ConfigNumber);
export default Default;
