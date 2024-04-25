import { KnowledgeBases } from "./../../../constants/knowledge-base";
import { ConfigurationType } from "../cfg-type";

import CFGString from "./CFGString";
import CFGNumber from "./CFGNumber";
// import CFGSwitch from "./CFGSwitch";
import CFGCheckbox from "./CFGCheckbox";
// import CFGCheckboxGroup from "./CFGCheckboxGroup";
// import CFGRadioGroup from "./CFGRadioGroup";
// import CFGList from "./CFGList";
// import CFGMap from "./CFGMap";
import CFGValueChooser from "./CFGValueChooser";
// import CFGMultipleValueChooser from "./CFGMultipleValueChooser";
import CFGTextarea from "./CFGTextarea";
// import CFGTextCode from "./CFGTextCode";
// import CFGDivider from "./CFGDivider";
// import CFGListBean from "./CFGListBean";
// import CFGRowGroup from "./CFGRowGroup";
// import CFGListSelector from "./CFGListSelector";
// import CFGColumnSelector from "./CFGColumnSelector";
// import CFGHeader from "./CFGHeader";
// import CFGDebounceString from "./CFGDebounceString";
// import CFGAsyncTables from "./CFGAsyncTables";
// // import CFGAsyncTableColumns from './CFGAsyncTableColumns'
import CFGLabel from "./CFGLabel";
import CFGKnowledgeBase from "./CFGKnowledgeBase";
// import CFGSql from "./CFGSql";

export function getTargetCFGClass(def) {
  const { type, model } = def;
  switch (type) {
    case ConfigurationType.STRING:
      return CFGString;
    case ConfigurationType.LABEL:
      return CFGLabel;
    case ConfigurationType.VALUE_CHOOSER:
      return CFGValueChooser;
    case ConfigurationType.NUMBER:
      return CFGNumber;
    case ConfigurationType.BOOLEAN:
      return CFGCheckbox;
    case ConfigurationType.KNOWLEDGE_BASE:
      return CFGKnowledgeBase;
    // case ConfigurationType.BOOLEAN_SWITCH:
    //   return CFGSwitch;
    // case ConfigurationType.DEBOUNCE_STRING:
    //   return CFGDebounceString;
    // case ConfigurationType.MODEL: {
    //   switch (model.modelType) {
    //     case ConfigurationType.RADIO_GROUP:
    //       return CFGRadioGroup;
    //     case ConfigurationType.CHECKBOX_GROUP:
    //       return CFGCheckboxGroup;
    //     case ConfigurationType.MULTIPLE_VALUE_CHOOSER:
    //       return CFGMultipleValueChooser;
    //     case ConfigurationType.LIST:
    //       return CFGList;
    //     case ConfigurationType.LIST_BEAN:
    //       return CFGListBean;
    //     case ConfigurationType.ROW_GROUP:
    //       return CFGRowGroup;
    //     case ConfigurationType.LIST_SELECTOR:
    //       return CFGListSelector;
    //     case ConfigurationType.CHECKBOX_FIELD_SELECTOR:
    //       return CFGColumnSelector;
    //     case ConfigurationType.ASYNC_TABLES:
    //       return CFGAsyncTables;
    //     // case ConfigurationType.ASYNC_TABLE_COLUMNS: return CFGAsyncTableColumns
    //     case ConfigurationType.LABEL:
    //       return CFGLabel;
    //     default:
    //       return null;
    //   }
    // }
    // case ConfigurationType.LIST:
    //   return CFGList;
    // case ConfigurationType.MAP:
    //   return CFGMap;
    case ConfigurationType.TEXT_AREA:
      return CFGTextarea;
    // case ConfigurationType.TEXT_CODE:
    //   return CFGTextCode;
    // case ConfigurationType.SQL:
    //   return CFGSql;
    // // case ConfigurationType.FORMULA_EDITOR: return CFGFormulaEditor
    // // 为了美观或分组
    // case ConfigurationType.LABEL:
    //   return CFGLabel;
    // case ConfigurationType.DIVIDER:
    //   return CFGDivider;
    // case ConfigurationType.HEADER:
    //   return CFGHeader;
    default:
      return null;
  }
}

// const list = [CFGTextCode, CFGList, CFGMap, CFGDivider];

// export const hasUnifyTitle = (CFGClass) => {
//   if (CFGClass.hasUnifyTitle !== undefined) {
//     return CFGClass.hasUnifyTitle;
//   }
//   return list.indexOf(CFGClass) === -1;
// };
