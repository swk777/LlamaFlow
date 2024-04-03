export interface ICFGModelBase {
  modelType?: string;
}

export interface ICFGDependOnMap {
  [vPath: string]: (string | number | boolean)[];
}

export interface ICFGModelLogicSwitch {
  switchDefinitions: Array<{
    name: string;
    hiddenOnMap?: ICFGDependOnMap;
    dependsOnMap?: ICFGDependOnMap;
    definitions: ICFGDefinitionBase[];
  }>;
}

export interface ICFGDefinitionBase {
  fieldName: string;
  aliasFieldName?: string; // 输入输出节点使用
  label: string;
  name?: string;
  placeholder?: string;
  required?: boolean;
  dependsOnMap?: ICFGDependOnMap;
  hiddenOnMap?: ICFGDependOnMap;
  type: string;
  model?: TSFixMe;
  defaultValue?: number | string | boolean | TSFixMe[];
  style?: TSFixMe;
}

export interface ICFGBaseProps<
  T extends ICFGDefinitionBase = ICFGDefinitionBase
> {
  definition: T;
  className?: string;
  style?: { [key: string]: TSFixMe };
}
