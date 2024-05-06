import { Select } from "@mantine/core";
import React, { useContext, useEffect, useMemo } from "react";
import useDef, { useDependOnMap } from "../useDef";
import NamespaceContext from "../NamespaceContext";
import { useSelectCheck } from "./CFGValueChooser";
import { IconExclamationCircle } from "@tabler/icons-react";
import { AppContext } from "@/context/AppContext";

type Props = {};

export default function CFGKnowledgeBase(props: Props) {
  const {
    definition,
    mode,
    style,
    className,
    allowClear,
    onSearch,
    ...others
  } = props;
  const [fieldValue, updateFv, readonly] = useDef(definition);
  const { from } = definition.model || {};
  const { getValue } = useContext(NamespaceContext);
  const disableSelect = useMemo(
    () => getValue(from || { ns: "", fieldName: "" }) === true,
    [getValue, from]
  );
  const { disabledOnMap } = definition;
  const [hasDepends, fullfilled] = useDependOnMap(disabledOnMap);
  //   const { values = [] } = definition.model;
  const disabled = (hasDepends && fullfilled) || disableSelect;
  useEffect(() => {
    if (fieldValue === undefined && definition.defaultValue !== undefined) {
      updateFv(definition.defaultValue);
    }
  }, [fieldValue, updateFv, definition]);
  useEffect(() => {
    if (
      definition.defaultValue !== undefined &&
      ((hasDepends && fullfilled) || disableSelect)
    ) {
      updateFv(definition.defaultValue);
    }
  }, [hasDepends, fullfilled, updateFv, definition, disableSelect]);
  const { knowledgeBases } = useContext(AppContext);

  const items = knowledgeBases.map((kb) => ({
    label: kb.name,
    value: kb.id,
  }));

  const findIsMissField = (field) => field !== undefined;
  const missFields =
    mode === "multiple" && (fieldValue || []).filter(findIsMissField);
  const isMissing = (): boolean =>
    mode !== "multiple" && findIsMissField(fieldValue);

  const [v, ph] = useSelectCheck(fieldValue, definition, isMissing, fieldValue);
  return (
    <div className="flex1 row-flex-center">
      {/* {mode === "multiple" && missFields.length > 0 && (
          <Tooltip>
            <TooltipTrigger>{`存在丢失字段：${missFields.join(
              "、"
            )}`}</TooltipTrigger>
            <TooltipContent>
              <IconExclamationCircle
                name="toast-warn"
                style={{ color: "yelow", marginRight: 4 }}
              />
            </TooltipContent>
          </Tooltip>
        )} */}

      <Select
        value={fieldValue?.id}
        onChange={(_, item) => {
          updateFv({ id: item.value, name: item.label });
        }}
        onSearch={onSearch}
        data={items}
        // renderFunc={renderFunc}
        disabled={disabled || readonly}
        className={className}
        style={style}
        mode={mode}
        placeholder={ph}
        clearable={allowClear || definition?.model?.allowClear}
        {...others}
      />
    </div>
  );
}
