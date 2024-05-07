import React, { useMemo, ReactElement, useCallback } from "react";
import { partition } from "ramda";
import { set, get } from "lodash";
import {
  IConfigDependOnMap,
  IConfigDefinitionBase,
} from "../../type/ConfigDefinition";
import { getNewState } from "@/utils/state";

interface ConfigContext {
  config: any;
  updateField: (field: string, value: any) => void;
  batchUpdateFields: (fields: string[], values: any[]) => void;
  isFieldVisible: IFunc<any, boolean>;
  getFieldValue: (field: string) => any;
  upstreamStages?: any[];
  readonly: boolean;
  refresh: () => void;
}

export const isDependencyMet = (
  dependencyMap: IConfigDependOnMap,
  config: any
): boolean => {
  const fields = Object.keys(dependencyMap || {});
  if (!fields.length) return true;
  return fields.every((field) =>
    dependencyMap[field]?.includes(get(config, field))
  );
};

function isExclusionMet(
  exclusionMap: IConfigDependOnMap,
  config: any
): boolean {
  return Object.keys(exclusionMap || {}).some((field) =>
    exclusionMap[field]?.includes(get(config, field))
  );
}

export const isFieldVisibleInConfig = (
  definition: IConfigDefinitionBase,
  config: any
): boolean =>
  isDependencyMet(definition.dependsOnMap, config) &&
  !isExclusionMet(definition.hiddenOnMap, config);

export function cleanupConfig(
  config: any,
  definitions: IConfigDefinitionBase[]
): any {
  if (!definitions?.length) return config;
  const [visibleDefinitions, hiddenDefinitions] = partition(
    (definition) => isFieldVisibleInConfig(definition, config),
    definitions
  );

  return getNewState(config, (draft) => {
    hiddenDefinitions.forEach(({ fieldName, aliasFieldName }) => {
      if (
        !get(draft, fieldName) &&
        visibleDefinitions.some((d) => d.fieldName === fieldName)
      )
        return;
      set(draft, fieldName, undefined);
      if (aliasFieldName) set(draft, aliasFieldName, undefined);
    });

    visibleDefinitions.forEach(({ fieldName, defaultValue }) => {
      if (get(draft, fieldName) === undefined && defaultValue !== undefined) {
        set(draft, fieldName, defaultValue);
      }
    });
  });
}

const defaultConfigContext: ConfigContext = {
  config: {},
  updateField: () => {},
  batchUpdateFields: () => {},
  isFieldVisible: () => true,
  getFieldValue: () => {},
  upstreamStages: [],
  readonly: false,
  refresh: () => {},
};

export function createConfigContext(
  config: any,
  onChange,
  readonly,
  refresh
): ConfigContext {
  const batchUpdateFields = (fields, values) => {
    if (fields.every((field, index) => get(config, field) === values[index]))
      return;
    onChange(
      getNewState(config, (draft) => {
        fields.forEach((field, index) => {
          set(draft, field, values[index]);
        });
      })
    );
  };

  return {
    config,
    isFieldVisible: (definition) => isFieldVisibleInConfig(definition, config),
    getFieldValue: (field) => get(config, field),
    updateField: (field, value) => batchUpdateFields([field], [value]),
    batchUpdateFields,
    readonly,
    refresh,
  };
}

const ConfigContext = React.createContext<ConfigContext>(defaultConfigContext);
export default ConfigContext;

interface ProviderProps {
  config: any;
  definitions: IConfigDefinitionBase[];
  onChange: (newConfig: any) => void;
  refresh: () => void;
  readonly: boolean;
  children: ReactElement;
}

export function ConfigContextProvider({
  config,
  definitions,
  onChange,
  refresh,
  readonly,
  children,
}: ProviderProps): ReactElement {
  const handleConfigChange = useCallback(
    (newConfig) => onChange(cleanupConfig(newConfig, definitions)),
    [onChange, definitions]
  );

  const value = useMemo(
    () => createConfigContext(config, handleConfigChange, readonly, refresh),
    [config, handleConfigChange, readonly, refresh]
  );

  return (
    <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>
  );
}
