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
    }
};
