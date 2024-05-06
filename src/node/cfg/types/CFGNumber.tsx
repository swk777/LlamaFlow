import React, { ReactElement } from "react";
import { NumberInput } from "@mantine/core";
import useDef from "../useDef";
import { ICFGBaseProps, ICFGDefinitionBase } from "@/type/cfgDefinition";

// const { InputNumber } = Input;

interface ICFGNumber extends ICFGDefinitionBase {
  model?: {
    unit?: string;
    min?: number;
    max?: number;
  };
  prefix?: string;
  suffix?: string;
}

function CFGNumber({
  definition: def,
  style,
}: ICFGBaseProps<ICFGNumber>): ReactElement {
  const [fieldValue, updateFv, readonly] = useDef(def);
  const { prefix, suffix } = def;
  const { unit, min = 0, max } = def.model || {};
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

const Default = React.memo(CFGNumber);
export default Default;
