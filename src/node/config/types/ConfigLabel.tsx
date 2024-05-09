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
  definition,
}: IConfigBaseProps<IConfigLabel>): React.ReactElement {
  if (definition.label) {
    return <>{definition.label}</>;
  }
  return <></>;
}
