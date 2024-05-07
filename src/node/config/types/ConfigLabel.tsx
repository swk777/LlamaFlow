import { IConfigBaseProps, IConfigDefinitionBase } from "@/type/cfgDefinition";
import React from "react";

interface IConfigLabel extends IConfigDefinitionBase {
  model?: {
    label?: string;
  };
}

export default function ConfigLabel({
  definition: def,
}: IConfigBaseProps<IConfigLabel>): React.ReactElement {
  if (def.label) {
    return <>{def.label}</>;
  }
  return <></>;
}
