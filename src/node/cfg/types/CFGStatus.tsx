import React, { ReactElement, useContext, useMemo } from "react";
import { Icon, Tooltip } from "@guandata/design";
import _get from "lodash/get";

import DefContext from "../ConfigContext";
import { validateRequired } from "../../cfg/validation";
import { validate } from "../../cfg-scheduler/model/validation";

import fm from "../../../core/i18n";

const MSG_NOT_CONFIGURED = {
  id: "NOT_CONFIGURED",
  cn: "节点未配置",
  en: "Configuration is not complete",
};
const getFieldName = (def): string =>
  _get(def, "model.relatedRequiredFieldName") || def.fieldName;

const isValidConfig = (def, value, config): boolean => {
  if (validateRequired(def, value, config)) return true;
  return false;
};

interface IProps {
  def: TSFixMe;
}

function CFGStatus(props: IProps): ReactElement {
  const { def } = props;
  const { config, getFieldValue } = useContext(DefContext);
  const value = getFieldValue(getFieldName(def));
  const failedDefs = useMemo(() => validate([def], config), [def, config]);
  if (_get(failedDefs, "length") === 0 && isValidConfig(def, value, config))
    return null;

  return (
    <Tooltip title={fm(MSG_NOT_CONFIGURED)}>
      <Icon
        style={{ color: "var(--color-yellow)", right: 4 }}
        className="no-shrink font-m pos-absolute"
        name="empty_node"
      />
    </Tooltip>
  );
}

const Default = React.memo(CFGStatus);
export default Default;
