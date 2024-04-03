const preValues = (values) =>
    values.map(v => ({ colName: v.colName && v.colName.name || '', newColName: v.newColName || '' }))

const postValues = (values, inputs) => values.map(v => {
    const index = inputs.labels.indexOf(v.colName)
    return { colName: { name: v.colName, type: inputs.types[index] }, newColName: v.newColName }
})

export default { preValues, postValues }
