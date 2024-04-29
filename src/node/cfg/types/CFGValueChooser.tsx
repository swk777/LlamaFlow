import React, { useMemo, useEffect, useContext, ReactElement } from "react";
// import { Icon, Select, Tooltip, ISelectProps } from "@guandata/design";
// import cn from "classnames";
import { MultiSelect, Select } from "@mantine/core";
import PropTypes from "prop-types";
// import useStyles from "isomorphic-style-loader/useStyles";
// import R from "ramda";
import zipWith from "ramda/src/zipWith";
import _get from "lodash/get";
// import { getColorVar } from "../../style";
import useDef, { useDependOnMap } from "../useDef";
import NamespaceContext from "../NamespaceContext";
import useDynamicSource from "../useDynamicSource";
import s from "./CFGValueChooser.scss";
import { ICFGBaseProps, ICFGDefinitionBase } from "@/type/cfgDefinition";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { IconExclamationCircle } from "@tabler/icons-react";
// import fm from "../../../core/i18n";

// const { GDSelect } = Select;
interface ILabelValue {
  value: string | number;
  label: string;
  icon?: string;
  type?: string;
  disabled?: boolean;
}
interface ICFGValueChooser extends ICFGDefinitionBase {
  disabledOnMap?: TSFixMe;
  model: {
    from?: { ns: string; fieldName: string };
    labels?: string[];
    values?: string[];
    icons?: { type: string; color?: string; value: string }[];
    allowClear?: boolean;
  };
}
// interface ISelectProps {
//   value: string;
//   onChange: IFuncVoid<string>;
// }
interface IProps extends ICFGBaseProps<ICFGValueChooser> {
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
  let [v, ph] = [value, definition.placeholder];
  const icon = _get(definition, "model.tableIcon");
  if (isMissing()) {
    v = undefined;
    ph = (
      <div className={"row-flex-center content-h-full"}>
        <Tooltip>
          <TooltipTrigger>{definition.errorPlaceholder}</TooltipTrigger>
          <TooltipContent>
            <IconExclamationCircle
              name="toast-warn"
              style={{ color: "yellow", marginRight: 4 }}
            />
          </TooltipContent>
        </Tooltip>
        {/* {icon && <Icon name={icon} style={{ marginRight: 4 }} />} */}
        {missingName}
      </div>
    );
  }
  return [v, ph];
}

function CFGValueChooser(props: IProps): ReactElement {
  const { definition, style, className, allowClear, onSearch, ...others } =
    props;
  const [fieldValue, updateFv, readonly] = useDef(definition);
  console.log(fieldValue);
  const { from } = definition.model || {};
  const { getValue } = useContext(NamespaceContext);
  const disableSelect = useMemo(
    () => getValue(from || { ns: "", fieldName: "" }) === true,
    [getValue, from]
  );
  const { disabledOnMap } = definition;
  const [hasDepends, fullfilled] = useDependOnMap(disabledOnMap);
  const { values = [] } = definition.model;
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
    definition?.mode === "multiple" &&
    (fieldValue || []).filter(findIsMissField);
  const isMissing = (): boolean =>
    definition?.mode !== "multiple" && findIsMissField(fieldValue);

  const [v, ph] = useSelectCheck(fieldValue, definition, isMissing, fieldValue);
  const SelectComponent =
    definition?.mode === "multiple" ? MultiSelect : Select;
  return (
    <TooltipProvider>
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
          withAsterisk={definition.required}
          label={definition.label}
          description={definition?.description}
          value={fieldValue}
          onChange={updateFv}
          onSearch={onSearch}
          data={values}
          // renderFunc={renderFunc}
          disabled={disabled || readonly}
          className={className}
          style={style}
          // mode={definition?.mode}
          placeholder={ph}
          clearable={allowClear || definition.model.allowClear}
          {...others}
        />
      </div>
    </TooltipProvider>
  );
}

CFGValueChooser.propTypes = {
  definition: PropTypes.object,
  className: PropTypes.string,
  style: PropTypes.object,
  mode: PropTypes.string,
  allowClear: PropTypes.bool,
};

CFGValueChooser.defaultProps = {
  mode: "default",
};

const Default = React.memo(CFGValueChooser);
export default Default;
