// import React, { useMemo, useState, ReactElement } from "react";
// import PropTypes from "prop-types";
// import _set from "lodash/set";
// import _get from "lodash/get";
// import { getNewState } from "@/utils/state";

// export interface INamespaceFrom {
//   ns: string;
//   fieldName: string;
// }

// interface INamespaceContext {
//   outside: any;
//   inside: any;
//   getValue(from: INamespaceFrom): any;
//   batchUpdateInside(fieldNames: string[], values: any[]): void;
// }
// const initValue: INamespaceContext = {
//   outside: {},
//   inside: {},
//   getValue: () => {}, // ({ ns: '', fieldName: '' }) => {}
//   batchUpdateInside: () => {}, // ([], []) => {}
// };

// const NamespaceContext = React.createContext<INamespaceContext>(initValue);
// export default NamespaceContext;

// function genGetValue(nsObj) {
//   return (from: INamespaceFrom): any => {
//     const { ns, fieldName } = from;
//     return _get(nsObj[ns], fieldName);
//   };
// }

// const genContextValue = (outside, inside, setInside): INamespaceContext => {
//   const batchUpdateInside = (fieldNames: string[], values: any[]): void => {
//     if (fieldNames.every((k, i) => _get(inside, k) === values[i])) return;
//     setInside(
//       getNewState(inside, (draft) => {
//         fieldNames.forEach((fName, i) => _set(draft, fName, values[i]));
//       })
//     );
//   };
//   return {
//     outside,
//     inside,
//     getValue: genGetValue({ outside, inside }),
//     batchUpdateInside,
//   };
// };

// export function NamespaceContextProvider(props): ReactElement {
//   const { inside: upLayerInside, outside, children } = props;
//   const [inside, setInside] = useState({});
//   const contextValue = useMemo(
//     () => genContextValue(outside, { ...upLayerInside, ...inside }, setInside),
//     [outside, inside, upLayerInside]
//   );
//   return (
//     <NamespaceContext.Provider value={contextValue}>
//       {children}
//     </NamespaceContext.Provider>
//   );
// }

// NamespaceContextProvider.propTypes = {
//   outside: PropTypes.object,
//   children: PropTypes.node,
// };
