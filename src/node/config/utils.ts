import * as R from "ramda";
import _set from "lodash/set";
import _get from "lodash/get";
import { ConfigurationType as CT } from "./configType";

import { getNewState } from "@/utils/state";

import { IConfigDefinitionBase } from "@/type/configDefinition";

const concatPath =
  (prefix: string) =>
  (key: string): string =>
    `${prefix}.${key}`;

export function addFieldPrefix(
  prefix: string,
  def: IConfigDefinitionBase
): IConfigDefinitionBase {
  const concat = concatPath(prefix);
  let nDef = getNewState(def, (draft) => {
    draft.fieldName = concat(draft.fieldName);
  });
  if (nDef.dependsOnMap && Object.keys(nDef.dependsOnMap).length > 0) {
    nDef = getNewState(nDef, (draft) => {
      const preMap = nDef.dependsOnMap;
      const reduceFunc = (res, key) => ({ ...res, [concat(key)]: preMap[key] });
      draft.dependsOnMap = Object.keys(preMap).reduce(reduceFunc, {});
    });
  }
  if (nDef.hiddenOnMap && Object.keys(nDef.hiddenOnMap).length > 0) {
    nDef = getNewState(nDef, (draft) => {
      const preMap = nDef.hiddenOnMap;
      const reduceFunc = (res, key) => ({ ...res, [concat(key)]: preMap[key] });
      draft.hiddenOnMap = Object.keys(preMap).reduce(reduceFunc, {});
    });
  }
  return nDef;
}

export function createInputMapping(name) {
  return { name, depTaskId: "", depTaskName: "", depTaskOutputLane: "" };
}

export function generateInitConfigFromDefinitions(cfgDefinitions, fromConfig) {
  const config = fromConfig || { params: {} };
  cfgDefinitions.forEach((def) => {
    _set(config, def.fieldName, def.defaultValue);
  });
  return config;
}

export function getSyncDefs(defs: any[]) {
  const isValid = (def): boolean => def.fieldName && def.from && def.syncFunc;
  return R.pipe(
    R.filter(R.propEq("type", CT.FIELD_SYNC)),
    R.filter(isValid)
  )(defs);
}

export function applyFieldSync(defs, config, sourceInputs?) {
  const syncDefs = getSyncDefs(defs);
  if (syncDefs.length !== 0) {
    return getNewState(config, (draft) => {
      syncDefs.forEach((sDef) => {
        const { fieldName, from, syncFunc, withFields } = sDef;
        if (withFields) {
          if (!sourceInputs) return;
          const columns = (sourceInputs || []).map((source) => source.columns);
          _set(
            draft,
            fieldName,
            syncFunc(_get(draft, from) || []).map((input, index) => ({
              name: input,
              fields: columns[index] || [],
            }))
          );
          return;
        }
        _set(draft, fieldName, syncFunc(_get(draft, from) || []));
      });
    });
  }
  return config;
}
