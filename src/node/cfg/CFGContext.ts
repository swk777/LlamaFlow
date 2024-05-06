import React from "react";
// import CFGTitle from "./types/CFGTitle";
import { getTargetCFGClass } from "./types";

const initValue = {
  getTargetCFGClass,
  // TitleClass: CFGTitle,
};

const CFGContext = React.createContext(initValue);
export default CFGContext;
