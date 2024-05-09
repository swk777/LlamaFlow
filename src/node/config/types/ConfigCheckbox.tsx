import { ChangeEvent } from "react";
import { Checkbox } from "@mantine/core";
import useDef from "../useDef";
import {
  IConfigBaseProps,
  IConfigDefinitionBase,
} from "@/type/configDefinition";

function ConfigCheckbox({
  definition,
}: IConfigBaseProps<IConfigDefinitionBase>) {
  const [fieldValue, updateFv, readonly] = useDef(definition);
  const onChange = (e: ChangeEvent<HTMLInputElement>) =>
    updateFv(e.target.checked);
  const checked =
    fieldValue !== undefined ? fieldValue : !!definition.defaultValue;
  return (
    <Checkbox
      checked={checked}
      onChange={onChange}
      disabled={readonly}
      required={definition.required}
    >
      {definition.label}
    </Checkbox>
  );
}

export default ConfigCheckbox;
