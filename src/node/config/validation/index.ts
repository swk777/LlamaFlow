import R from "ramda";
import _get from "lodash/get";
import { isFieldVisibleInConfig } from "../ConfigContext";

const logInvalid = (defs) => defs.length > 0;
const needCheck = R.propEq("required", true);
const getRequired = R.filter(needCheck);
const getOptional = R.reject(needCheck);

export function shouldValidate(definition, config) {
  return definition.required && isFieldVisibleInConfig(definition, config);
}

export function isEmpty(value) {
  if (value === null || value === undefined) return true;
  if (typeof value === "string") return value.length === 0;
  if (Array.isArray(value)) return R.reject(isEmpty, value).length === 0;
  return false;
}

export function validateRequired(definition, value, config) {
  if (!shouldValidate(definition, config)) {
    // 无需校验
    return true;
  }
  return !isEmpty(value);
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
