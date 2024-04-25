import React, {
  useEffect,
  ReactElement,
  useCallback,
  useContext,
  useState,
  useRef,
} from "react";
import { Input } from "@mantine/core";
import DefContext from "../ConfigContext";
// import NamespaceContext from "../NamespaceContext";
import useDef, { useDependOnMap } from "../useDef";

// import { getNodeText } from "../../../constants/resource";
import {
  ICFGBaseProps,
  ICFGDefinitionBase,
  ICFGDependOnMap,
} from "@/type/cfgDefinition";
// import { Input } from "@/components/ui/input";

interface ICFGString extends ICFGDefinitionBase {
  model?: {
    unit?: string;
    disabledOnMap?: ICFGDependOnMap;
    clearOnDisabled?: boolean;
    maxLength?: number;
    checkDuplicated?: boolean;
  };
}

export const labelRequired = (ph: string, required: boolean): string => {
  if (!ph || !required) return ph;
  return `${ph}`;
};

function CFGString({
  definition: def,
  style,
}: ICFGBaseProps<ICFGString>): ReactElement {
  const [fieldValue, updateFv, readonly] = useDef(def);
  const prevFv = useRef(fieldValue);
  const [inputValue, setInputValue] = useState(fieldValue);

  const { getFieldValue, config } = useContext(DefContext);
  // const {
  //   outside: { allTasks = {} },
  // } = useContext(NamespaceContext);

  const { unit, disabledOnMap, clearOnDisabled, maxLength } = def.model || {};
  let formatter = null;
  if (unit) {
    formatter = (v): string => `${v}${unit}`;
  }
  const onChange = useCallback(
    (e): void => {
      updateFv(e.currentTarget.value);
      setInputValue(e.target.value);
    },
    [updateFv]
  );
  const onBlur = useCallback(
    (e) => {
      // if (checkDuplicated !== true) return;
      console.log(def);
      console.log(e.target.value === "", def.required);
      if (e.target.value === "" && def.required) {
        // notifications.show({
        //   title: "Check Fail",
        //   message: `${def.placeholder} can not be empty`,
        // });
        // Message.warning(`${getNodeText(config.type)}名称为空`);
        return;
      }
      // if (
      //   allTasks.some((t) => t.id !== config.id && t.name === e.target.value)
      // ) {
      //   // Message.warning(`${getNodeText(config.type)}名称不能重复！`);
      //   return;
      // }
      updateFv(e.target.value);
    },
    [updateFv, config]
  );
  const [hasDisabledOn, fullfilled] = useDependOnMap(disabledOnMap);
  const disabled = hasDisabledOn && fullfilled;
  useEffect(() => {
    if (fieldValue !== undefined && disabled && clearOnDisabled) {
      updateFv(undefined);
    }
    if (prevFv.current !== fieldValue) {
      prevFv.current = fieldValue;
      setInputValue(fieldValue);
    }
  }, [fieldValue, updateFv, disabled, clearOnDisabled]);

  return (
    <Input
      value={inputValue}
      onChange={onChange}
      onBlur={onBlur}
      placeholder={labelRequired(def.placeholder, def.required)}
      maxLength={maxLength}
      disabled={readonly || disabled}
      //   formatter={formatter}
      style={style}
    />
  );
}

const Default = React.memo(CFGString);
export default Default;
