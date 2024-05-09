import { IConfigBaseExtend } from "./configDefinition";

export interface IIntegration {
  id: string;
  label: string;
  configDefinitions: IConfigBaseExtend<any>[];
  config: any;
}
