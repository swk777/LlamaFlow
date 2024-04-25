import React, {
  ReactElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { Button } from "@guandata/design";
import cn from "classnames";
import useStyles from "isomorphic-style-loader/useStyles";
import {
  INVALID_PARAMS,
  useFetch,
  useVersion,
  useVisible,
} from "@guandata/hooks";
import CodeMirror from "../../codeEditor/CodeEditor";
import { getDatasetDetail } from "../../../services/dataset";
import ExprEditor from "../../dataset/ExprEditor";
import LoadingSpinner from "../../common/loading-spinner/LoadingSpinner";
import NamespaceContext from "../NamespaceContext";
import {
  ICFGBaseProps,
  ICFGDefinitionBase,
} from "../../../types/cfgDefinition";
import useDef from "../useDef";
import {
  getSqlEditorTitlesBySqlCategory,
  SqlCategory,
} from "../../../constants/sql";
import fm from "../../../core/i18n";
import s from "./CFGSql.scss";

const MsgEdit = { id: "EDIT", cn: "编辑", en: "Edit" };

interface ICFGSql extends ICFGDefinitionBase {
  model?: {
    sqlCategory: SqlCategory;
  };
}

type IModalProps = {
  visible: boolean;
  sqlCategory: SqlCategory;
  datasetId: string;
  sql: string;
  onChange: IFuncVoid<string>;
  onClose: IFuncNoop;
  disabled: boolean;
};

const DefaultDatasetIdNS = { ns: "inside", fieldName: "__insideDatasetId" };

function SqlEditModal({
  visible,
  datasetId,
  sqlCategory,
  disabled,
  ...rest
}: IModalProps): ReactElement {
  const [res, loading, setParams] = useFetch(
    getDatasetDetail,
    [],
    INVALID_PARAMS
  );
  const dsParams = useMemo(() => ({ id: datasetId }), [datasetId]);
  useEffect(() => {
    if (visible) {
      setParams(dsParams);
    }
  }, [visible, dsParams, setParams]);
  const titles = useMemo(
    () => getSqlEditorTitlesBySqlCategory(sqlCategory, fm),
    [sqlCategory]
  );

  if (visible && loading) {
    return (
      <div className="pos-absolute-full">
        <LoadingSpinner />
      </div>
    );
  }
  if (visible && res[0]) {
    return (
      <ExprEditor
        expr={rest.sql}
        onCancel={rest.onClose}
        columns={res[0].fields}
        titles={titles}
        onOK={(v: string): void => {
          rest.onChange(v);
          rest.onClose();
        }}
        readOnly={disabled}
      />
    );
  }
  return null;
}

export default function CFGSql({
  definition: def,
  style,
  className,
}: ICFGBaseProps<ICFGSql>): ReactElement {
  useStyles(s);
  const [fieldValue, updateFv, readonly] = useDef(def);
  const { getValue } = useContext(NamespaceContext);
  const datasetId = getValue(DefaultDatasetIdNS);
  const [inEdit, showEdit, hideEdit] = useVisible();
  const [ver, upgradeVersion] = useVersion();
  const updateByModal = useCallback(
    (v) => {
      updateFv(v);
      upgradeVersion();
    },
    [updateFv, upgradeVersion]
  );
  return (
    <div style={style} className={cn("pos-relative", className)}>
      <CodeMirror
        key={ver}
        value={fieldValue || ""}
        options={{ mode: "sql", readOnly: readonly }}
        onChange={(v: string): void => updateFv(v)}
        style={{ minHeight: 68, maxHeight: 68, ...style }}
        placeholder={def.placeholder || ""}
      />
      {datasetId && (
        <div
          className={cn(
            s.editToolbar,
            "pos-absolute color-background-alt shadow-popover-down"
          )}
        >
          <Button
            onClick={showEdit}
            icon="fg fg-pannelRename"
            size="small"
            noBorder
          >
            {fm(MsgEdit)}
          </Button>
        </div>
      )}
      <SqlEditModal
        key={datasetId}
        visible={inEdit}
        sqlCategory={def.model && def.model.sqlCategory}
        datasetId={datasetId}
        sql={fieldValue}
        onChange={updateByModal}
        onClose={hideEdit}
        disabled={readonly}
      />
    </div>
  );
}
