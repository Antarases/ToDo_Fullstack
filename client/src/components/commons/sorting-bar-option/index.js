import React from "react";
import { useQuery } from "@apollo/client";
import { Col } from "reactstrap";
import PropTypes from "prop-types";

import { GET_TODOS_PAGINATION_AND_SORT_PARAMS } from "../../../constants/graphqlQueries/todosPaginationAndSortParams";

import { setTodosSortParams } from "../../../actions/TodosSortActions";

import styles from "./sorting-bar-option.module.scss";

const SortingBarOption = ({ sortParam, children }) => {
    const { data } = useQuery(GET_TODOS_PAGINATION_AND_SORT_PARAMS);
    const {
        todosPagination: { currentTodosPage },
        todosSortParams: { sortField: currentSortField, sortOrder: currentSortOrder }
    } = data.clientData;

    return (
        <Col
            className={styles.sortingBarOption}
            sm="auto" xs="12"
            onClick={() => setTodosSortParams(sortParam, currentTodosPage, currentSortField, currentSortOrder)}
        >
            { children }
        </Col>
    );
};

export default SortingBarOption;

SortingBarOption.propTypes = {
    sortParam: PropTypes.string,
    children: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.element,
        PropTypes.arrayOf(PropTypes.element)
    ]),
};
