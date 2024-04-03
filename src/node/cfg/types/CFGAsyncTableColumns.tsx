// import React, { ReactElement, useContext, useMemo, useEffect } from "react";
// import { useDataQueryTableColumns } from "../useDataQuery";
// import NamespaceContext from "../NamespaceContext";
// import { ICFGBaseProps, ICFGDefinitionBase } from "@/type/cfgDefinition";

// interface ICFGDefinitionAsyncTableColumns extends ICFGDefinitionBase {
//   model: {
//     modelType: string;
//     dataSourceIdFieldName: string;
//     tableNameFieldName: string;
//     targetNamespaceFieldName: string;
//   };
// }

// export default function CFGAsyncTableColumns({
//   definition,
// }: ICFGBaseProps<ICFGDefinitionAsyncTableColumns>): ReactElement {
//   const {
//     dataSourceIdFieldName,
//     tableNameFieldName,
//     targetNamespaceFieldName,
//   } = definition.model;
//   const { getValue, batchUpdateInside } = useContext(NamespaceContext);
//   const [columns] = useDataQueryTableColumns(
//     dataSourceIdFieldName,
//     tableNameFieldName
//   );
//   const from = useMemo(() => ({ labels: columns, values: columns }), [columns]);
//   useEffect(() => {
//     if (targetNamespaceFieldName) {
//       const data = getValue({
//         ns: "inside",
//         fieldName: targetNamespaceFieldName,
//       });
//       if (data !== from) {
//         batchUpdateInside([targetNamespaceFieldName], [from]);
//       }
//     }
//   }, [batchUpdateInside, from, getValue, targetNamespaceFieldName]);
//   return <React.Fragment />;
// }

// CFGAsyncTableColumns.hasUnifyTitle = false;
