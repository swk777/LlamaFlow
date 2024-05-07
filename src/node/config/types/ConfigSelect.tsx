import React, { useMemo, useEffect, useContext, ReactElement } from "react";
import { MultiSelect, Select, Tooltip } from "@mantine/core";
import PropTypes from "prop-types";

import zipWith from "ramda/src/zipWith";
import _get from "lodash/get";
import useDef, { useDependOnMap } from "../useDef";
import NamespaceContext from "../NamespaceContext";
import {
  IConfigBaseProps,
  IConfigDefinitionBase,
} from "@/type/configDefinition";
interface ILabelValue {
  value: string | number;
  label: string;
  icon?: string;
  type?: string;
  disabled?: boolean;
}
interface IConfigValueChooser extends IConfigDefinitionBase {
  disabledOnMap?: any;
  misc: {
    mode?: "single" | "multiple" | "default";
    from?: { ns: string; fieldName: string };
    labels?: string[];
    values?: string[];
    icons?: { type: string; color?: string; value: string }[];
    allowClear?: boolean;
  };
}
interface IProps extends IConfigBaseProps<IConfigValueChooser> {
  mode?: "single" | "multiple" | "default";
  allowClear?: boolean;
  onSearch?: IFuncVoid<string>;
}

const MsgFieldMissing = {
  id: "FIELD_IS_MISSING",
  cn: "字段已丢失",
  en: "Field is missing",
};

const zipFunc = zipWith((t, v) => ({ label: t, value: v }));

export function useSelectCheck(
  value,
  definition,
  isMissing,
  missingName?: string,
  cls?: string
): [string, ReactElement | string] {
  let [v, placeholder] = [value, definition.placeholder];
  const icon = _get(definition, "misc.tableIcon");
  if (isMissing()) {
    v = undefined;
    // placeholder = (
    //   <div className={"row-flex-center content-h-full"}>
    //     <Tooltip>
    //       <TooltipTrigger>{definition.errorPlaceholder}</TooltipTrigger>
    //       <TooltipContent>
    //         <IconExclamationCircle
    //           name="toast-warn"
    //           style={{ color: "yellow", marginRight: 4 }}
    //         />
    //       </TooltipContent>
    //     </Tooltip>
    //     {/* {icon && <Icon name={icon} style={{ marginRight: 4 }} />} */}
    //     {missingName}
    //   </div>
    // );
  }
  return [v, placeholder];
}

function ConfigSelect(props: IProps): ReactElement {
  const { definition, style, className, allowClear, onSearch, ...others } =
    props;
  const [fieldValue, updateFv, readonly] = useDef(definition);
  console.log(fieldValue);
  const { from } = definition.misc || {};
  const { getValue } = useContext(NamespaceContext);
  const disableSelect = useMemo(
    () => getValue(from || { ns: "", fieldName: "" }) === true,
    [getValue, from]
  );
  const { disabledOnMap } = definition;
  const [hasDepends, fullfilled] = useDependOnMap(disabledOnMap);
  const { values = [] } = definition.misc;
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
  // const items = values;
  // const items = useMemo(
  //   () => zipFunc(labels, values),
  //   [labels, values]
  // ) as ILabelValue[];
  // let renderFunc = null;
  //   if (icons.length > 0) {
  //     items.forEach((item, i) => {
  //       item.icon = icons[i];
  //     });
  //     renderFunc = (item): ReactElement => (
  //       <div className="row-flex-center">
  //         <Icon
  //           name={item.icon && item.icon.value}
  //           style={R.pick(["color"])(item.icon || {})}
  //         />
  //         <div style={{ marginLeft: 6 }}>{item.label || item.value}</div>
  //       </div>
  //     );
  //   }

  //   const findIsMissField = (field) =>
  //     field !== undefined && items.findIndex(R.propEq("value", field)) === -1;
  const findIsMissField = (field) => field !== undefined;
  const missFields =
    definition?.misc?.mode === "multiple" &&
    (fieldValue || []).filter(findIsMissField);
  const isMissing = (): boolean =>
    definition?.misc?.mode !== "multiple" && findIsMissField(fieldValue);

  const [v, placeholder] = useSelectCheck(
    fieldValue,
    definition,
    isMissing,
    fieldValue
  );
  const SelectComponent =
    definition?.misc?.mode === "multiple" ? MultiSelect : Select;
  return (
    <div className="flex-1 row-flex-center">
      {/* {definition?.mode === "multiple" && missFields.length > 0 && (
          <Tooltip>
            <TooltipTrigger>{`存在丢失字段：${missFields.join(
              "、"
            )}`}</TooltipTrigger>
            <TooltipContent>
              <IconExclamationCircle
                name="toast-warn"
                style={{ color: "yellow", marginRight: 4 }}
              />
            </TooltipContent>
          </Tooltip>
        )} */}
      <SelectComponent
        required={definition.required}
        label={definition.label}
        description={definition?.description}
        value={fieldValue}
        onChange={updateFv}
        onSearch={onSearch}
        data={values}
        disabled={disabled || readonly}
        className={className}
        style={style}
        placeholder={placeholder}
        clearable={allowClear || definition.misc.allowClear}
        {...others}
      />
    </div>
  );
}

ConfigSelect.propTypes = {
  definition: PropTypes.object,
  className: PropTypes.string,
  style: PropTypes.object,
  mode: PropTypes.string,
  allowClear: PropTypes.bool,
};

ConfigSelect.defaultProps = {
  mode: "default",
};

const Default = React.memo(ConfigSelect);
export default Default;
