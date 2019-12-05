import React from "react";
import PropTypes from "prop-types";
import { Scrollbars as Scrollbar } from "react-custom-scrollbars";
import classnames from "classnames";

import { COEFICIENT_OF_SCROLLING_FOR_GETTING_MORE_ITEMS } from "../../../constants/app"

import styles from "./scrolled-container.module.scss";

class ScrolledContainer extends React.Component {
    state = {
        isScrollbarHidden: !this.props.alwaysShowScrollbar
    };

    onScroll(e, getMoreItems) {
        if ((e.target.clientHeight + e.target.scrollTop) > (e.target.scrollHeight * COEFICIENT_OF_SCROLLING_FOR_GETTING_MORE_ITEMS)) {
            getMoreItems();
        }
    };

    render() {
        const { children, maxHeight, alwaysShowScrollbar, getMoreItems, trackVerticalClassName, thumbVerticalClassName, innerRef, ...restProps } = this.props;
        const { isScrollbarHidden } = this.state;

        return (
            <Scrollbar
                renderTrackVertical={props => <div {...props} className={classnames(styles.trackVertical, trackVerticalClassName, {[styles.hidden]: isScrollbarHidden})} />}
                renderThumbVertical={props => <div {...props} className={classnames(styles.thumbVertical, thumbVerticalClassName, {[styles.hidden]: isScrollbarHidden})} />}
                renderView={props => <div {...props} className={styles.view} />}
                hideTracksWhenNotNeeded
                autoHeight={!!maxHeight}
                autoHeightMax={maxHeight}
                onMouseEnter={(e) => { !alwaysShowScrollbar && this.setState({ isScrollbarHidden: false }); }}
                onMouseLeave={(e) => { !alwaysShowScrollbar && this.setState({ isScrollbarHidden: true }); }}
                onScroll={(e) => { getMoreItems && this.onScroll(e, getMoreItems) }}
                {...restProps}
                ref={innerRef}
            >
                <div
                    className={styles.contentContainer}

                >
                    { children }
                </div>
            </Scrollbar>
        );
    }
}

export default React.forwardRef((props, ref) => <ScrolledContainer
    innerRef={ref} {...props}
/>);

ScrolledContainer.propTypes = {
    children: PropTypes.node,
    maxHeight: PropTypes.number,
    alwaysShowScrollbar: PropTypes.bool,
    getMoreItems: PropTypes.func,
    trackVerticalClassName: PropTypes.string,
    thumbVerticalClassName: PropTypes.string
};

