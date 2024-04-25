// 根据数据源获取数据表
import { useEffect, useContext, useMemo, useState } from "react";
// import { useFetch, INVALID_PARAMS } from "@guandata/hooks";
// import { queryDBTables, queryDBTableColumns } from "../../services/dataquery";
import DefContext from "./ConfigContext";

// import { IParamsProps } from "../../types/schedule";

export interface IDataQueyTable {
  name: string;
  sql: string;
}
interface IQueryTableRelatedFieldName {
  dataSourceIdFieldName: string;
  dataSourceTypeFieldName?: string;
  sqlTypeFieldName?: string;
}
interface IQueryTableParams {
  dataSourceId: string;
  showView: boolean;
  tableName: string;
}

function useQueryTableParams(
  search: string,
  relatedFieldName: IQueryTableRelatedFieldName,
  others?: TSFixMe
): [IQueryTableParams, boolean] {
  const { getFieldValue } = useContext(DefContext);
  const dataSourceId = getFieldValue(relatedFieldName.dataSourceIdFieldName);
  const showView = !!getFieldValue(relatedFieldName.sqlTypeFieldName);
  const baseParams = useMemo(
    () => ({ dataSourceId, showView }),
    [dataSourceId, showView]
  );
  const { limit, exportMessage } = others || {};
  const params = useMemo(
    () => ({ ...baseParams, tableName: search, limit }),
    [search, limit, baseParams]
  );
  return [params, exportMessage ? false : !!baseParams.dataSourceId];
}

// export function useSearchQueryTables (search: string, relatedFieldName: IQueryTableRelatedFieldName, others?: TSFixMe):
// [ IDataQueyTable[], boolean ] {
//     const [ params, valid ] = useQueryTableParams(search, relatedFieldName, others)
//     const [ res, loading, setParams ] = useFetch(queryDBTables, [], INVALID_PARAMS)
//     useEffect(() => {
//         if (valid && search !== undefined) { // 刚拖入的节点不需要请求验证
//             setParams(params)
//         }
//     }, [ params, valid, setParams ])
//     const tables: IDataQueyTable[] = useMemo(() => (valid ? res[0] : []) || [], [ res, valid ])
//     return [ tables, loading ]
// }

// export function useDataQueryTables(
//   search: string,
//   relatedFieldName: IQueryTableRelatedFieldName,
//   notSupport?: (dsId, dsType) => boolean,
//   limit?: number
// ): [IDataQueyTable[], boolean, IQueryTableParams, string, IParamsProps[]] {
//   const { getFieldValue } = useContext(DefContext);
//   const exportMessage = getFieldValue("exportMessage");
//   const [params, valid] = useQueryTableParams(search, relatedFieldName, {
//     exportMessage,
//     limit,
//   });
//   const localParams = getFieldValue("params.localParams");
//   const dsType = getFieldValue(relatedFieldName.dataSourceTypeFieldName);
//   const [res, loading, setParams] = useFetch(queryDBTables, [], INVALID_PARAMS);
//   useEffect(() => {
//     if (notSupport && notSupport(params.dataSourceId, dsType)) return;
//     valid && setParams(params);
//   }, [params, valid, notSupport, dsType, setParams]);
//   const data = res[0];
//   const tables: IDataQueyTable[] = useMemo(
//     () => (valid ? data : []) || [],
//     [data, valid]
//   );
//   return [tables, loading, params, dsType, localParams];
// }
// export function useDataQueryTableColumns(
//   dsIdFieldName,
//   tableFieldName
// ): [string[], boolean] {
//   const [emptyColumns, setEmptyColumns] = useState(null);
//   const { getFieldValue } = useContext(DefContext);
//   const exportMessage = getFieldValue("exportMessage");
//   const [dsId, tableName] = [
//     getFieldValue(dsIdFieldName),
//     getFieldValue(tableFieldName),
//   ];
//   const [res, loading, setParams] = useFetch(
//     queryDBTableColumns,
//     [],
//     INVALID_PARAMS
//   );
//   useEffect(() => {
//     if (dsId && tableName && !exportMessage) {
//       setEmptyColumns(null);
//       setParams({ dataSourceId: dsId, tableName });
//     } else {
//       setEmptyColumns([]);
//     }
//   }, [dsId, tableName, setParams, exportMessage]);
//   const data = res[0];
//   const columns: string[] = useMemo(() => data || [], [data]);
//   return [emptyColumns || columns, loading];
// }
