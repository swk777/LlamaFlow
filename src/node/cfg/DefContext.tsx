import React, { useMemo, ReactElement, useCallback } from "react";
import rPartition from "ramda/src/partition";
import _set from "lodash/set";
import _get from "lodash/get";
import { ICFGDependOnMap, ICFGDefinitionBase } from "../../type/cfgDefinition";
import { getNewState } from "@/utils/state";

interface IDefContext {
  config: TSFixMe;
  updateConfig(fieldName: string, value: TSFixMe): void;
  batchUpdateConfig(fieldNames: string[], values: TSFixMe[]): void;
  isDefVisible: IFunc<TSFixMe, boolean>;
  getFieldValue(fieldName: string): TSFixMe;
  upstreamStages?: TSFixMe[];
  readonly: boolean;
  refresh: IFuncNoop;
}

export function isDependsOnFullfilled(
  dependsOnMap: ICFGDependOnMap,
  config: TSFixMe
): boolean {
  const keyPaths = Object.keys(dependsOnMap || {});
  if (keyPaths.length === 0) return true;
  return keyPaths.every((kp) => {
    const onValues = dependsOnMap[kp] || [];
    return onValues.indexOf(_get(config, kp)) > -1;
  });
}
function isHiddenOnMapFullfilled(
  hiddenOnMap: ICFGDependOnMap,
  config: TSFixMe
): boolean {
  if (hiddenOnMap) {
    return Object.keys(hiddenOnMap).some((kp) => {
      const onValues = hiddenOnMap[kp] || [];
      return onValues.indexOf(_get(config, kp)) !== -1;
    });
  }
  return false;
}

export function isDefVisibleOnConfig(
  def: ICFGDefinitionBase,
  config: TSFixMe
): boolean {
  return (
    isDependsOnFullfilled(def.dependsOnMap, config) &&
    !isHiddenOnMapFullfilled(def.hiddenOnMap, config)
  );
}

/**
 * 配置信息的冗余处理。做两件事情：
 * 1. 移除不可见的字段的值
 * 2. 根据defaultValue恢复可见字段的值
 * [注] 默认只对根DefContext做冗余字段处理, 嵌套的默认不传definitions
 */
export function removeRedundantConfig(
  config: TSFixMe,
  definitions: ICFGDefinitionBase[]
): TSFixMe {
  if (!definitions || definitions.length === 0) {
    return config;
  }
  const [needKeepDefs = [], needRemoveDefs = []] = rPartition((def) => {
    return isDefVisibleOnConfig(def, config);
  }, definitions);
  return getNewState(config, (draft) => {
    needRemoveDefs.forEach((def) => {
      if (
        _get(draft, def.fieldName) === undefined ||
        needKeepDefs.some((d) => d.fieldName === def.fieldName)
      )
        return;
      _set(draft, def.fieldName, undefined);
      def.aliasFieldName && _set(draft, def.aliasFieldName, undefined);
    });
    needKeepDefs.forEach((def) => {
      const fv = _get(draft, def.fieldName);
      if (fv === undefined && def.defaultValue !== undefined) {
        _set(draft, def.fieldName, def.defaultValue);
      }
    });
  });
}

const initDefValue: IDefContext = {
  config: {},
  updateConfig: () => {}, // (fieldName, value) => {}
  batchUpdateConfig: () => {}, // (fieldNames, values) => {}
  isDefVisible: () => true, // (def) => boolean
  getFieldValue: () => {}, // (fieldName) => {}
  upstreamStages: [],
  readonly: false,
  refresh: () => {},
};

export function genDefContextValue(
  config: TSFixMe,
  onChange,
  read,
  refresh
): IDefContext {
  const batchUpdateConfig = (fieldNames, values): void => {
    if (fieldNames.every((k, i) => _get(config, k) === values[i])) return;
    onChange(
      getNewState(config, (draft) => {
        fieldNames.forEach((fName, i) => {
          _set(draft, fName, values[i]);
        });
      })
    );
  };
  return {
    config,
    isDefVisible: (def): boolean => {
      return isDefVisibleOnConfig(def, config);
    },
    getFieldValue: (fieldName): TSFixMe => _get(config, fieldName),
    updateConfig: (fieldName, value): void =>
      batchUpdateConfig([fieldName], [value]),
    batchUpdateConfig,
    readonly: read,
    refresh,
  };
}

const DefContext = React.createContext<IDefContext>(initDefValue);
export default DefContext;

interface IProviderProps {
  config: TSFixMe;
  definitions: ICFGDefinitionBase[];
  onChange(newConfig: TSFixMe): void;
  refresh: IFuncNoop;
  readonly: boolean;
  children: ReactElement;
}
export function DefContextProvider(props: IProviderProps): ReactElement {
  const { config, definitions, onChange, refresh, readonly, children } = props;
  const onConfigChange = useCallback(
    (newConfig) => {
      onChange(removeRedundantConfig(newConfig, definitions));
    },
    [onChange, definitions]
  );
  const contextValue = useMemo(
    () => genDefContextValue(config, onConfigChange, readonly, refresh),
    [config, onConfigChange, readonly, refresh]
  );
  return (
    <DefContext.Provider value={contextValue}>{children}</DefContext.Provider>
  );
}

// 针对部分场景，对节点内部分配置做disable时，将该字段设置为数组，包含需要disable的配置的fieldName
export const DISABLED_FIELDS_PATH = "params.disableFieldsInConfig";
