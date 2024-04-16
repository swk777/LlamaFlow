export enum PROCESS_TYPE {
  WORKFLOW = "WORKFLOW",
  DATAFLOW = "DATAFLOW",
  PROCESS = "PROCESS",
  AI_PLUGIN = "AI_PLUGIN",
  DB_DATAFLOW = "DB_DATAFLOW", // 数据库数据流
  AI_ETL = "AI_ETL",
  AI_CODE = "AI_CODE",
  REAL_TIME = "REAL_TIME",
  AI_FLOW = "AI_FLOW",
}

export enum BUILT_IN_TYPE {
  InputDatasetSource = "InputDatasetSource", // 输入数据集
  InputDatasource = "InputDatasource", // 数据库输入
  OutputDataset = "OutputDataset",
  CreateDataset = "CreateDataset",
  UpdateDataset = "UpdateDataset",
  OutputDatasetTarget = "OutputDatasetTarget",
  GroupByTransform = "GroupByTransform",
  SelectColumnsTransform = "SelectColumnsTransform",
  CalculatorTransform = "CalculatorTransform",
  FieldReplacerTransform = "FieldReplacerTransform",
  RemoveDuplicateTransform = "RemoveDuplicateTransform",
  NullValueMapperTransform = "NullValueMapperTransform",
  RowFilterTransform = "RowFilterTransform",
  JoinTransform = "JoinTransform",
  UnionTransform = "UnionTransform",
  PlainSqlTransform = "PlainSqlTransform",
  NaiveBayesModelTarget = "NaiveBayesModelTarget",
  NaiveBayesPredictTransform = "NaiveBayesPredictTransform",
  LogicOutputTarget = "LogicOutputTarget",
  OutputDatasourceTarget = "OutputDatasourceTarget",
  PivotTransform = "PivotTransform",
  UnpivotTransform = "UnpivotTransform",
  DbDataflowOutputDatasource = "DbDataflowOutputDatasource", // db_dataflow输出至数据源
}

export enum EVENT_TYPE {
  DRAG_PANEL = "DRAG_PANEL", // 拖动画布
  DRAG_LINK = "DRAG_LINK", // 连线拖动
  DRAG_NODE = "DRAG_NODE", // 拖动节点
  FRAME_SELECT = "FRAME_SELECT", // 框选
  CLICK_NODE = "CLICK_NODE", // 点击节点
  DELAY_CLICK_NODE = "DELAY_CLICK_NODE",
  NONE = "",
}

export const STAGE_POSITION = [
  [0.5],
  [0.3, 0.7],
  [0.2, 0.5, 0.8],
  [0, 0.33, 0.66, 1],
];

export const IONumberType = {
  STATIC: 0,
  DYNAMIC: 1,
};

export const DEFAULT_IO_SPEC = {
  inputType: IONumberType.STATIC,
  inputNumber: 1,
  outputType: IONumberType.STATIC,
  outputNumber: 1,
};

export const NODE_WIDTH = 56;
export const NODE_HEIGHT = 56;
export const RADIUS = 5; // 端点圆圈的半径

export const STAGE_INPUT_POSITION = [
  [{ top: "calc(50% - 8px)" }], // 1端点
  [{ top: "calc(30% - 8px)" }, { top: "calc(70% - 8px)" }], // 2个端点
  [
    { top: "calc(20% - 8px)" },
    { top: "calc(50% - 8px)" },
    { top: "calc(80% - 8px)" },
  ], // 3个端点
];

export const STAGE_OUTPUT_POSITION = [
  [{ top: "calc(50% - 5px)" }], // 1端点
  [{ top: "calc(30% - 5px)" }, { top: "calc(70% - 5px)" }], // 2个端点
  [
    { top: "calc(20% - 5px)" },
    { top: "calc(50% - 5px)" },
    { top: "calc(80% - 5px)" },
  ], // 3个端点
];

export const getNodeTypeByName = (name = ""): BUILT_IN_TYPE => {
  const nodeType = `${
    name.split("_")[name.split("_").length - 1]
  }` as BUILT_IN_TYPE;
  if (Object.values(BUILT_IN_TYPE).includes(nodeType)) return nodeType;
  return null;
};

export const isInputType = (name: string) => {
  if (!name) return false;
  return getNodeTypeByName(name) === BUILT_IN_TYPE.InputDatasetSource;
};

export const isOutputType = (name: string) => {
  if (!name) return false;
  return [
    BUILT_IN_TYPE.OutputDataset,
    BUILT_IN_TYPE.OutputDatasetTarget,
    BUILT_IN_TYPE.OutputDatasourceTarget,
    BUILT_IN_TYPE.CreateDataset,
    BUILT_IN_TYPE.UpdateDataset,
  ].includes(getNodeTypeByName(name));
};

export const getExtraClassName = (task, subType): string => {
  if (task.params.stageConfig.configValue.previewLimitType === "NO_LIMIT")
    return "";
  if (subType === BUILT_IN_TYPE.InputDatasetSource)
    return "filter-inputDatasetSource";
  if (subType === BUILT_IN_TYPE.InputDatasource)
    return "filter-inputDatasource";
  return "";
};
