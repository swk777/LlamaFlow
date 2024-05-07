export interface IConfigModelBase {
  modelType?: string;
}

export interface IConfigDependOnMap {
  [vPath: string]: (string | number | boolean)[];
}

export interface IConfigModelLogicSwitch {
  switchDefinitions: Array<{
    name: string;
    hiddenOnMap?: IConfigDependOnMap;
    dependsOnMap?: IConfigDependOnMap;
    definitions: IConfigDefinitionBase[];
  }>;
}

export interface IConfigDefinitionBase {
  fieldName: string;
  aliasFieldName?: string; // 输入输出节点使用
  label: string;
  name?: string;
  placeholder?: string;
  required?: boolean;
  dependsOnMap?: IConfigDependOnMap;
  hiddenOnMap?: IConfigDependOnMap;
  type: string;
  model?: any;
  defaultValue?: number | string | boolean | any[];
  style?: any;
}

export interface IConfigBaseProps<
  T extends IConfigDefinitionBase = IConfigDefinitionBase,
> {
  definition: T;
  className?: string;
  style?: { [key: string]: any };
}
