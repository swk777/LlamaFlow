export interface IConfigDependOnMap {
  [vPath: string]: (string | number | boolean)[];
}

export interface IConfigDefinitionBase {
  fieldName: string;
  label: string;
  name?: string;
  placeholder?: string;
  required?: boolean;
  description?: string;
  dependsOnMap?: IConfigDependOnMap;
  disabledOnMap?: IConfigDependOnMap;
  hiddenOnMap?: IConfigDependOnMap;
  isDisplayed?: boolean;
  defaultValue?: number | string | boolean | any[];
  style?: any;
  misc?: any;
}

export interface IConfigBaseProps<
  T extends IConfigDefinitionBase = IConfigDefinitionBase,
> {
  definition: T;
  className?: string;
  style?: { [key: string]: any };
}
export type IConfigBaseExtend<
  T extends IConfigDefinitionBase = IConfigDefinitionBase,
> = T;
