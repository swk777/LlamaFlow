import {
  IConfigBaseProps,
  IConfigDefinitionBase,
} from "@/type/configDefinition";
import React from "react";

interface IConfigLabel extends IConfigDefinitionBase {
  misc?: {
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
