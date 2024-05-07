import { useContext } from "react";
import NamespaceContext from "./NamespaceContext";
import { IConfigDefinitionBase } from "@/type/cfgDefinition";

const empty = { labels: [], values: [] };
export default function useDynamicSource(
  defModel
): IConfigDefinitionBase["model"] {
  const { getValue } = useContext(NamespaceContext);
  // 1. 在定义里声明了 from 同时未声明 labels，说明需要动态获取
  // 2. 如果在 model 里定义了 labels，则不需要使用动态值，from 可以作为其他作用使用
  // if (defModel.from && !defModel.labels)
  //   return getValue(defModel.from) || empty;
  return defModel;
}
