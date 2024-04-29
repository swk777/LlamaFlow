export enum NodeletCategory {
  Input = "Input",
  Processor = "Processor",
  Output = "Output",
}
export enum NodeletInputType {
  String = "String",
  Context = "Context",
}
export enum NodeletOutputType {
  String = "String",
  Context = "Context",
}
export interface NodeletInput {
  id: string;
  type: NodeletInputType;
}
export interface NodeletOutput {
  id: string;
  type: NodeletOutputType;
}
export interface Nodelet {
  id: string;
  category: NodeletCategory;
  name: string;
  internal: boolean;
  image: string;
  inputs: NodeletInput[];
  outputs: NodeletOutput[];
  configDefinitions: any;
}
