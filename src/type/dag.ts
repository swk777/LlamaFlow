import { ReactElement } from "react";
import { EVENT_TYPE } from "@/constants/dag";

enum ResourceType {
  WORKFLOW = 0,
  DATAFLOW,
  DATASET,
  REAL_TIME,
  AI_CODE,
  AI_ETL,
  AI_PLUGIN,
  AI_FLOW = "AIFLOW",
}

export interface IOSpecType {
  inputType: number;
  inputNumber: number;
  outputType: number;
  outputNumber: number;
}

export interface INode {
  name: string;
  targetarr: string;
  x: number;
  y: number;
  IOSpec?: IOSpecType;
}

export interface IConnect {
  endPointSourceId: string;
  endPointTargetId: string;
  sourceIndex: number;
  targetIndex: number;
}

export interface ITaskParams {
  title: string;
  receiversCc: string;
  showType: string;
  udfs: string;
  connParams: string;
  sqlType: 2;
  InsertParameters: { mode: number; primaryKeys: string[] };
  type: string;
  inputMappings: [{ name: string }];
  localParams: TSFixMe;
  sql: string;
  preStatements: string[];
  postStatements: string[];
  outputs: string[];
  logMoreInfoType: string;
  runTimeParams: string[];
  datasource: number;
  outputAliasMap: TSFixMe;
}

export enum IScheduleType {
  SUCCESS = "SUCCESS",
  FAILURE = "FAILURE",
  ALL = "ALL",
}
export interface ITaskStatus {
  id: string;
  name?: string;
  type: IScheduleType;
}

export interface ITask {
  id: string;
  type: string;
  params: ITaskParams;
  name: string;
  runFlag: string;
  taskInstancePriority: string;
  workerGroupId: number;
  maxRetryTimes: number;
  timeout: { enable: boolean };
  state?: string;
  preTasks?: string[];
  preTaskScheduleTypes?: ITaskStatus[];
}

export interface IEdge {
  endPointSourceId: string;
  endPointTargetId: string;
  sourceIndex: number;
  targetIndex: number;
  sourceNode: INode;
  targetNode: INode;
  offset: number;
  onClickConnection: (conn: IConnect, e: TSFixMe) => void;
  connection: IConnect;
  sourceNodeIOSpec?: IOSpecType;
  targetNodeIOSpec?: IOSpecType;
  setEventType?: IFuncVoid<EVENT_TYPE>;
  tasks?: ITask[];
}

export interface INodePoint {
  IOSpec: IOSpecType;
  onMouseDownRightAnchor: (e: TSFixMe, sourceIndex: number) => void;
  onMouseDownLeftAnchor: () => void;
  onMouseUpLeftAnchor: (e: TSFixMe, targetIndex: number) => void;
}

export interface IAnnotationItemProps {
  width: number;
  height: number;
  x: number;
  y: number;
  content: string;
  id: string;
}
export interface IAnnotationProps {
  hidden: boolean;
  list: IAnnotationItemProps[];
}

export interface IDagProps {
  // data
  nodesMap: { id?: INode };
  connections: IConnect[];
  tasks: ITask[];
  stageConfigMap: TSFixMe;
  // event
  onAddNode: (params: {
    type: string;
    id: string;
    name: string;
    x: number;
    y: number;
    task: ITask;
  }) => void;
  onDeleteNode: TSFixMe;
  onBatchDeleteNode: (ids: string[]) => void;
  onBatchCopyNode: (ids: string[]) => string[];
  onAddConnection: (
    sourceId: string,
    targetId: string,
    sourceIndex: number,
    targetIndex: number
  ) => void;
  onDeleteConnection: (
    sourceId: string,
    targetId: string,
    sourceIndex: number,
    targetIndex: number
  ) => void;
  onUpdatePosition: (params: { id: string; x: number; y: number }) => void;
  onBatchUpdatePosition: (params: {
    ids: string[];
    x: number;
    y: number;
  }) => void;
  onAutoPosition: TSFixMe;
  onUndo: TSFixMe;
  onInStack: () => void;
  // custom render
  renderEdge?: (TSFixMe) => ReactElement;
  renderNodeContent?: (task: ITask) => ReactElement;
  renderNodePoint?: () => ReactElement;
  renderCustomNode?: IFunc<TSFixMe, ReactElement>;
  renderUnderLayer?: IFunc<TSFixMe, ReactElement>;
  renderUpperLayer?: IFunc<TSFixMe, ReactElement>;
  // other
  renderConfig?: (
    currentTask: ITask,
    close: () => void,
    isReadonly: boolean
  ) => ReactElement;
  isReadonly?: boolean;
  multipleEndpoints?: boolean;
  processId: string;
  height: number;
  width: number;
  canUndo: boolean;
  type: ResourceType;
  initialZoom?: number;
  autoLayout?: boolean;
}

export interface ICoordinate {
  x: number;
  y: number;
}
