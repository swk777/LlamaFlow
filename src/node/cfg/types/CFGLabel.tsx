import { ICFGBaseProps, ICFGDefinitionBase } from "@/type/cfgDefinition";
import React from "react";

interface ICFGLabel extends ICFGDefinitionBase {
  model?: {
    label?: string;
  };
}

export default function CFGLabel({
  definition: def,
}: ICFGBaseProps<ICFGLabel>): React.ReactElement {
  if (def.label) {
    return <>{def.label}</>;
  }
  return <></>;
}
