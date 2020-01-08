const DbTypeToJc={
    int: "number",
    bigint: "number",
    datetime: "datetime",
    varchar: "string",
    text: "string",
    mediumint: "number",
    enum: "number",
    tinyint: "number",
    smallint: "number",
    char: "number",
    decimal: "number",
    mediumtext: "string",
    longtext: "string",
    float:"number",
    date:"date"
}
const type = 'mediumint';
console.log(DbTypeToJc[type])
