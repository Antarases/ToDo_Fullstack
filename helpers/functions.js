const TODOS_CONSTANTS = require("../constants/todos");

module.exports = {
    setDefaultValuesForIncorrectSortParamOrOrder: (sortField, sortOrder) => {
        if (!TODOS_CONSTANTS.SORT_PARAMS.includes(sortField)) {
            sortField = TODOS_CONSTANTS.DEFAULT_SORT_PARAM;
        }
        if (!TODOS_CONSTANTS.SORT_ORDER.includes(sortOrder)) {
            sortOrder = TODOS_CONSTANTS.DEFAULT_SORT_ORDER;
        }

        return {sortField, sortOrder};
    },
    encodeStringToBase64: (string) => {
        const buffer = Buffer.from(string, "utf8");

        return buffer.toString("base64");
    },
    decodeBase64ToString: (base64String) => {
        const buffer = Buffer.from(base64String, "base64");

        return buffer.toString("utf8")
    }
};
