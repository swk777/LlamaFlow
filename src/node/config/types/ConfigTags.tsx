import React, {
  useEffect,
  ReactElement,
  useCallback,
  useContext,
  useState,
  useRef,
} from "react";
import { Input, TagsInput } from "@mantine/core";
import DefContext from "../ConfigContext";
// import NamespaceContext from "../NamespaceContext";
import useDef, { useDependOnMap } from "../useDef";

// import { getNodeText } from "../../../constants/resource";
import {
  IConfigBaseProps,
  IConfigDefinitionBase,
  IConfigDependOnMap,
} from "@/type/cfgDefinition";

interface IConfigTags extends IConfigDefinitionBase {
  model?: {
    unit?: string;
    disabledOnMap?: IConfigDependOnMap;
    clearOnDisabled?: boolean;
    maxLength?: number;
    checkDuplicated?: boolean;
  };
}

export const labelRequired = (ph: string, required: boolean): string => {
  if (!ph || !required) return ph;
  return `${ph}`;
};

function ConfigTags({
  definition,
  style,
}: IConfigBaseProps<IConfigTags>): ReactElement {
  const [fieldValue, updateFv, readonly] = useDef(definition);
  const prevFv = useRef(fieldValue);
  const [inputValue, setInputValue] = useState(fieldValue);

  const { getFieldValue, config } = useContext(DefContext);
  // const {
  //   outside: { allTasks = {} },
  // } = useContext(NamespaceContext);

  const { unit, disabledOnMap, clearOnDisabled, maxLength } =
    definition.model || {};
  let formatter = null;
  if (unit) {
    formatter = (v): string => `${v}${unit}`;
  }
  const onChange = useCallback(
    (value): void => {
      updateFv(value);
      setInputValue(value);
    },
    [updateFv]
  );
  const onBlur = useCallback(
    (e) => {
      // if (checkDuplicated !== true) return;
      if (e.target.value === "" && definition.required) {
        // notifications.show({
        //   title: "Check Fail",
        //   message: `${definition.placeholder} can not be empty`,
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
    <Input.Wrapper
      label={definition?.label}
      description={definition?.description}
      withAsterisk={definition.required}
      className="text-left"
    >
      <TagsInput
        data={[]}
        value={inputValue}
        onChange={onChange}
        placeholder={labelRequired(definition.placeholder, definition.required)}
        maxLength={maxLength}
        disabled={readonly || disabled}
        style={style}
      />
    </Input.Wrapper>
  );
}

const Default = React.memo(ConfigTags);
export default Default;
