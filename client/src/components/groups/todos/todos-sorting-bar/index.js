import React from "react";
import { connect } from "react-redux";
import { Container, Col } from "reactstrap";
import PropTypes from "prop-types";

import SortingBarOption from "../../../commons/sorting-bar-option";

import styles from "./sorting-bar.module.scss";

class TodosSortingBar extends React.Component {
    render() {
        const { isUserAdmin } = this.props;

        return (
            <Container tag="section" className={styles.sortingBar}>
                    <span className={styles.sortingBarTitle}>Sort by:</span>

                    <Col
                        className={styles.sortingBarOptions}
                        sm="auto" xs="12"
                    >
                        { isUserAdmin && <SortingBarOption sortParam="userFullName">User Name</SortingBarOption> }
                        <SortingBarOption sortParam="creationDate">Date</SortingBarOption>
                        <SortingBarOption sortParam="isCompleted">Status</SortingBarOption>
                    </Col>
            </Container>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isUserAdmin: state.app.currentUserStatus.isAdmin
    };
};

export default connect(mapStateToProps)(TodosSortingBar);

TodosSortingBar.propTypes = {
    isAdmin: PropTypes.string
};