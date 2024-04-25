import R from "ramda";
import _get from "lodash/get";
// import Logger from "../../../core/logger";
import { ConfigurationType as CT } from "../cfg-type";
import { isFieldVisibleInConfig } from "../ConfigContext";

const logInvalid = (defs) => defs.length > 0;
const needCheck = R.propEq("required", true);
const getRequired = R.filter(needCheck);
const getOptional = R.reject(needCheck);

export function shouldValidate(definition, config) {
  return definition.required && isFieldVisibleInConfig(definition, config);
}

/**
 * 判断value是否非空
 */
export function isEmpty(value) {
  if (value === null || value === undefined) return true;
  if (typeof value === "string") return value.length === 0;
  if (Array.isArray(value)) return R.reject(isEmpty, value).length === 0;
  return false;
}

/**
 * 根据definition校验config的合法性
 */
export function validateRequired(definition, value, config) {
  if (!shouldValidate(definition, config)) {
    // 无需校验
    return true;
  }
  const { type, model } = definition;
  const isValid = !isEmpty(value);
  if (isValid && type === CT.MODEL && model) {
    switch (model.modelType) {
      case CT.LIST_BEAN: {
        const { configDefinitions: childDefs } = model;
        return value.every((v) =>
          childDefs.every((def) =>
            validateRequired(def, _get(v, def.fieldName))
          )
        );
      }
      case CT.LIST: {
        const { configDefinitions: childDef } = model;
        if (childDef.required) {
          return value.every(R.complement(isEmpty));
        }
        return true;
      }
      case CT.ROW_GROUP: {
        const { configDefinitions: childDefs } = model;
        return childDefs
          .filter((c) => c.required)
          .every((def) => validateRequired(def, _get(config, def.fieldName)));
      }
      default:
        return true;
    }
  }
  return isValid;
}

export function validate(config, definitions, requireFunc, optionFunc) {
  const rFailDefs = requireFunc
    ? requireFunc(config, getRequired(definitions))
    : [];
  const oFailDefs = optionFunc
    ? optionFunc(config, getOptional(definitions))
    : [];
  return R.pipe(R.tap(logInvalid))(rFailDefs.concat(oFailDefs));
}
