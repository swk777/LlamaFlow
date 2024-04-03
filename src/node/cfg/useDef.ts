import { useContext, useMemo } from "react";
import DefContext from "./DefContext";
import { ICFGDefinitionBase, ICFGDependOnMap } from "@/type/cfgDefinition";

export default function useDef(
  def: ICFGDefinitionBase
): [TSFixMe, IFuncVoid<TSFixMe>, boolean] {
  const { fieldName } = def;
  const { getFieldValue, updateConfig, readonly } = useContext(DefContext);
  const fieldValue = getFieldValue(fieldName);
  const updateFieldValue = (v): void => updateConfig(fieldName, v);
  return [fieldValue, updateFieldValue, readonly];
}

export function useDependOnMap(onMap: ICFGDependOnMap): [boolean, boolean] {
  const { getFieldValue } = useContext(DefContext);
  const onKeys = useMemo(() => Object.keys(onMap || {}), [onMap]);
  const hasDepends = onKeys.length !== 0;
  const fullfilled = useMemo(() => {
    if (hasDepends) {
      return onKeys.every((fieldName) =>
        onMap[fieldName].includes(getFieldValue(fieldName))
      );
    }
    return false;
  }, [getFieldValue, onMap, onKeys, hasDepends]);
  return [hasDepends, fullfilled];
}
