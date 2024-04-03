import R from "ramda";
import _set from "lodash/set";
import _get from "lodash/get";
import { ConfigurationType as CT } from "./cfg-type";

import { IConnect, ITaskStatus, ITask } from "../../components/react-dag/type";
import { PROCESS_TYPE } from "../../constants/tasks/task";
import { getNewState } from "@/utils/state";
import { ICFGDefinitionBase, ICFGModelLogicSwitch } from "@/type/cfgDefinition";

const concatPath =
  (prefix: string) =>
  (key: string): string =>
    `${prefix}.${key}`;

export function addFieldPrefix(
  prefix: string,
  def: ICFGDefinitionBase
): ICFGDefinitionBase {
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
    if (def.model && def.model.modelType === "ROW_GROUP") {
      generateInitConfigFromDefinitions(def.model.configDefinitions, config);
    } else if (def.type === CT.LOGIC_SWITCH) {
      const model: ICFGModelLogicSwitch = def.model;
      if (model && model.switchDefinitions) {
        const allDefs = model.switchDefinitions.reduce(
          (arr, cur) => arr.concat(cur.definitions),
          []
        );
        generateInitConfigFromDefinitions(allDefs, config);
      }
    } else if (def.defaultValue !== undefined && def.fieldName) {
      _set(config, def.fieldName, def.defaultValue);
    }
  });
  return config;
}

/* ======= 数据兼容 =======*/
const pluginConfigPath = "params.stageConfig.configValue";

/**
 * 为了方便 PLUGIN configValue的展示, 会对configValue进行类型转换: 从Array到Map
 */
export function configValueArrayToMap(config) {
  if (
    config &&
    (config.type === "PLUGIN" || config.type === PROCESS_TYPE.AI_PLUGIN)
  ) {
    return getNewState(config, (draft) => {
      const arrayV = _get(draft, pluginConfigPath);
      if (arrayV && Array.isArray(arrayV)) {
        const mapV = arrayV.reduce(
          (res, item) => ({ ...res, [item.name]: item.value }),
          {}
        );
        _set(draft, pluginConfigPath, mapV);
      }
    });
  }
  return config;
}

/**
 * PLUGIN的configValue需要从Map转成Array
 */
export function configValueMapToArray(task) {
  if (
    task &&
    (task.type === "PLUGIN" || task.type === PROCESS_TYPE.AI_PLUGIN)
  ) {
    return getNewState(task, (draft) => {
      const mapV = _get(draft, pluginConfigPath);
      if (mapV) {
        const arrayV = Object.keys(mapV).map((name) => ({
          name,
          value: mapV[name],
        }));
        _set(draft, pluginConfigPath, arrayV);
      }
    });
  }
  return task;
}

export function getSyncDefs(defs: TSFixMe[]) {
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

/**
 * 配置的预处理:
 *  1. 根据 LogicSwitch 动态展开 子分组
 */
export function preProcessDefinitions(
  definitions: ICFGDefinitionBase[]
): ICFGDefinitionBase[] {
  let defs: ICFGDefinitionBase[] = [];
  definitions.forEach((def) => {
    switch (def.type) {
      case CT.LOGIC_SWITCH: {
        const model: ICFGModelLogicSwitch = def.model;
        if (model && model.switchDefinitions) {
          model.switchDefinitions.forEach((switchDef) => {
            const subDefs = switchDef.definitions.map((d) => ({
              ...d,
              hiddenOnMap: {
                ...d.hiddenOnMap,
                ...switchDef.hiddenOnMap,
                ...def.hiddenOnMap,
              },
              dependsOnMap: {
                ...d.dependsOnMap,
                ...switchDef.dependsOnMap,
                ...def.dependsOnMap,
              },
            }));
            defs = defs.concat(preProcessDefinitions(subDefs));
          });
        }
        break;
      }
      default:
        defs.push(def);
    }
  });
  return defs;
}

/**
 * 根据connection更新task里面的preTaskScheduleTypes,并加上name(preTaskScheduleTypes存的是节点的调度类型  成功调度 or 失败调度 or 顺序调度)
 */
export function updatePreTaskScheduleTypes(
  tasks: ITask[],
  task: ITask,
  connections: IConnect[] = []
): ITaskStatus[] {
  const finalTaskStatus = [];
  const taskStatus = task.preTaskScheduleTypes || [];
  for (let i = 0; i < taskStatus.length; i += 1) {
    const connectExist = connections.some(
      (c) =>
        c.endPointTargetId === task.id &&
        c.endPointSourceId === taskStatus[i].id
    );
    const name = tasks.find((t) => t.id === taskStatus[i].id)?.name;
    if (connectExist && name) {
      finalTaskStatus.push({ ...taskStatus[i], name });
    }
  }
  return finalTaskStatus;
}
