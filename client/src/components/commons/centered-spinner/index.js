import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import styles from "./centered-spinner.module.scss";
import Icons  from "../../../icons";

const CenteredSpinner = (props) => <div className={classnames(styles.container, props.spinnerContainerClassname, { [styles.fixed]: props.fixed })} >
    <img src={Icons.Spinner} className={classnames(styles.spinner, "icon-grey")} alt="" />
</div>;

CenteredSpinner.propTypes = {
    fixed: PropTypes.bool
};

export default CenteredSpinner;
