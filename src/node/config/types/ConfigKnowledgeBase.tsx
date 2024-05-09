import { Select } from "@mantine/core";
import { useContext, useEffect } from "react";
import useDef, { useDependOnMap } from "../useDef";
import { AppContext } from "@/context/AppContext";
import {
  IConfigBaseProps,
  IConfigDefinitionBase,
} from "@/type/configDefinition";

export default function ConfigKnowledgeBase(
  props: IConfigBaseProps<IConfigDefinitionBase>
) {
  const { definition, style, className, ...others } = props;
  const [fieldValue, updateFv, readonly] = useDef(definition);
  const { disabledOnMap = {} } = definition;
  const [hasDepends, fullfilled] = useDependOnMap(disabledOnMap);
  const disabled = hasDepends && fullfilled;
  useEffect(() => {
    if (fieldValue === undefined && definition.defaultValue !== undefined) {
      updateFv(definition.defaultValue);
    }
  }, [fieldValue, updateFv, definition]);
  useEffect(() => {
    if (definition.defaultValue !== undefined && hasDepends && fullfilled) {
      updateFv(definition.defaultValue);
    }
  }, [hasDepends, fullfilled, updateFv, definition]);
  const { knowledgeBases } = useContext(AppContext);

  const items = knowledgeBases.map((kb) => ({
    label: kb.name,
    value: kb.id,
  }));

  return (
    <div className="flex1 row-flex-center">
      <Select
        value={fieldValue?.id}
        onChange={(_, item) => {
          updateFv({ id: item.value, name: item.label });
        }}
        data={items}
        disabled={disabled || readonly}
        className={className}
        style={style}
        {...others}
      />
    </div>
  );
}
