import { ConfigurationType } from "../config-type";

import ConfigString from "./ConfigString";
import ConfigTags from "./ConfigTags";
import ConfigNumber from "./ConfigNumber";
import ConfigCheckbox from "./ConfigCheckbox";
import ConfigSelect from "./ConfigSelect";
import ConfigTextarea from "./ConfigTextarea";
import ConfigLabel from "./ConfigLabel";
import ConfigKnowledgeBase from "./ConfigKnowledgeBase";

export function getTargetConfigClass(def) {
  const { type } = def;
  switch (type) {
    case ConfigurationType.STRING:
      return ConfigString;
    case ConfigurationType.TAGS:
      return ConfigTags;
    case ConfigurationType.LABEL:
      return ConfigLabel;
    case ConfigurationType.SELECT:
      return ConfigSelect;
    case ConfigurationType.NUMBER:
      return ConfigNumber;
    case ConfigurationType.BOOLEAN:
      return ConfigCheckbox;
    case ConfigurationType.KNOWLEDGE_BASE:
      return ConfigKnowledgeBase;
    case ConfigurationType.TEXT_AREA:
      return ConfigTextarea;
    default:
      return null;
  }
}

// const list = [ConfigTextCode, ConfigList, ConfigMap, ConfigDivider];

// export const hasUnifyTitle = (ConfigClass) => {
//   if (ConfigClass.hasUnifyTitle !== undefined) {
//     return ConfigClass.hasUnifyTitle;
//   }
//   return list.indexOf(ConfigClass) === -1;
// };
