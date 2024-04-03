import SelectColumn from './selectColumns'

export const getFuncs = (name) => {
    switch (name) {
        case 'com_guandata_plugin_spark_transform_join_JoinTransform':
        case 'com_guandata_plugin_spark_transform_selectcolumns_SelectColumnsTransform': {
            return SelectColumn
        }
        default: return null
    }
}
