import { ConfigurationType } from "../configType";

import ConfigTags from "./ConfigTags";
import ConfigNumber from "./ConfigNumber";
import ConfigCheckbox from "./ConfigCheckbox";
import ConfigSelect from "./ConfigSelect";
import ConfigTextarea from "./ConfigTextarea";
import ConfigLabel from "./ConfigLabel";
import ConfigKnowledgeBase from "./ConfigKnowledgeBase";
import ConfigInput from "./ConfigInput";
import { IConfigBaseExtend } from "@/type/configDefinition";

export function getTargetConfigClass(def: IConfigBaseExtend<any>) {
  const { type } = def;
  switch (type) {
    case ConfigurationType.INPUT:
      return ConfigInput;
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
