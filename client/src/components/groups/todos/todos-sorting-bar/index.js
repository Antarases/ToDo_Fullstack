import React from "react";
import { useQuery } from "@apollo/react-hooks";
import { Container, Col } from "reactstrap";

import SortingBarOption from "../../../commons/sorting-bar-option";

import { GET_CURRENT_USER } from "../../../../constants/graphqlQueries/users";

import styles from "./todos-sorting-bar.module.scss";

const TodosSortingBar = () => {
    const { data: currentUserData } = useQuery(GET_CURRENT_USER);

    return (
        <Container tag="section" className={styles.sortingBar}>
            <span className={styles.sortingBarTitle}>Sort by:</span>

            <Col
                className={styles.sortingBarOptions}
                sm="auto" xs="12"
            >
                {
                    (currentUserData && currentUserData.currentUser.isAdmin)
                    && <SortingBarOption sortParam="userFullName">User Name</SortingBarOption>
                }
                <SortingBarOption sortParam="creationDate">Date</SortingBarOption>
                <SortingBarOption sortParam="isCompleted">Status</SortingBarOption>
            </Col>
        </Container>
    );
};

export default TodosSortingBar;