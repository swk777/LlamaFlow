import React, {
  useEffect,
  ReactElement,
  useCallback,
  useContext,
  useState,
  useRef,
} from "react";
// import { Input, Message } from '@guandata/design'
import DefContext, { DISABLED_FIELDS_PATH } from "../DefContext";
import NamespaceContext from "../NamespaceContext";
import useDef, { useDependOnMap } from "../useDef";

// import { getNodeText } from "../../../constants/resource";
import {
  ICFGBaseProps,
  ICFGDefinitionBase,
  ICFGDependOnMap,
} from "@/type/cfgDefinition";
import { Input } from "@/components/ui/input";

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
  const [fv, updateFv, readonly] = useDef(def);
  const prevFv = useRef(fv);
  const [inputValue, setInputValue] = useState(fv);

  const { getFieldValue, config } = useContext(DefContext);
  const {
    outside: { allTasks = {} },
  } = useContext(NamespaceContext);

  const disableFields = getFieldValue(DISABLED_FIELDS_PATH) || [];
  const disable = disableFields.includes(def.fieldName);

  const { unit, disabledOnMap, clearOnDisabled, maxLength, checkDuplicated } =
    def.model || {};
  let formatter = null;
  if (unit) {
    formatter = (v): string => `${v}${unit}`;
  }
  const onChange = useCallback(
    (e): void => {
      if (checkDuplicated !== true) updateFv(e.target.value);
      setInputValue(e.target.value);
    },
    [updateFv, checkDuplicated]
  );
  const onBlur = useCallback(
    (e) => {
      if (checkDuplicated !== true) return;
      if (e.target.value === "") {
        // Message.warning(`${getNodeText(config.type)}名称为空`);
        return;
      }
      if (
        allTasks.some((t) => t.id !== config.id && t.name === e.target.value)
      ) {
        // Message.warning(`${getNodeText(config.type)}名称不能重复！`);
        return;
      }
      updateFv(e.target.value);
    },
    [updateFv, checkDuplicated, allTasks, config]
  );
  const [hasDisabledOn, fullfilled] = useDependOnMap(disabledOnMap);
  const disabled = hasDisabledOn && fullfilled;
  useEffect(() => {
    if (fv !== undefined && disabled && clearOnDisabled) {
      updateFv(undefined);
    }
    if (prevFv.current !== fv) {
      prevFv.current = fv;
      setInputValue(fv);
    }
  }, [fv, updateFv, disabled, clearOnDisabled]);

  return (
    <Input
      value={inputValue}
      onChange={onChange}
      onBlur={onBlur}
      placeholder={labelRequired(def.placeholder, def.required)}
      maxLength={maxLength}
      disabled={readonly || disabled || disable}
      //   formatter={formatter}
      style={style}
    />
  );
}

const Default = React.memo(CFGString);
export default Default;
