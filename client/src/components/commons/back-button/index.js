import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

import styles from "./back-button.module.scss";

const BackButton = ({ onClick, backButtonContainerClassName,backButtonClassName }) => {
    return (
        <div
            className={backButtonContainerClassName}
            onClick={onClick}
        >
            <span
                className={classnames(styles.button, backButtonClassName)}
            />
        </div>
    );
};

export default BackButton;

BackButton.propTypes = {
    onClick: PropTypes.func,
    backButtonContainerClassName: PropTypes.string,
    backButtonClassName: PropTypes.string
};
