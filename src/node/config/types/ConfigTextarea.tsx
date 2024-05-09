import React, { useCallback, useContext, useState } from "react";
import { Input, Textarea } from "@mantine/core";
import PropTypes from "prop-types";
import useDef from "../useDef";
import ConfigContext from "../ConfigContext";
import {
  IConfigBaseProps,
  IConfigDefinitionBase,
} from "@/type/configDefinition";
interface IConfigTextarea extends IConfigDefinitionBase {
  misc?: {
    maxLength?: number;
  };
}

function ConfigTextarea(props: IConfigBaseProps<IConfigTextarea>) {
  const { definition, className, style } = props;
  const [error, setError] = useState<String>();
  const [fieldValue, updateFv, readonly] = useDef(definition);
  const { placeholder, required } = definition;
  const { config } = useContext(ConfigContext);
  const onBlur = useCallback(
    (e) => {
      if (e.target.value === "" && definition.required) {
        setError("Required");
        return;
      } else {
        setError(undefined);
      }
      updateFv(e.target.value);
    },
    [updateFv, config]
  );
  return (
    <Input.Wrapper
      label={definition?.label}
      className="text-left"
      description={definition?.description}
      required={definition.required}
    >
      <Textarea
        error={error}
        onBlur={onBlur}
        disabled={readonly}
        value={fieldValue}
        onChange={(e) => updateFv(e.target.value)}
        placeholder={placeholder}
        autosize
        minRows={4}
        maxRows={10}
        maxLength={999}
      />
    </Input.Wrapper>
  );
}

ConfigTextarea.propTypes = {
  definition: PropTypes.object,
  className: PropTypes.string,
  style: PropTypes.object,
};
const Default = React.memo(ConfigTextarea);
export default Default;
