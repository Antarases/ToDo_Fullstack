import React from "react";
import PropTypes from "prop-types";
import { Scrollbars as Scrollbar } from "react-custom-scrollbars";
import { mergeRefs } from "use-callback-ref";
import classnames from "classnames";

import { COEFICIENT_OF_SCROLLING_FOR_GETTING_MORE_ITEMS } from "../../../constants/app"

import styles from "./scrolled-container.module.scss";

class ScrolledContainer extends React.Component {
    state = {
        isScrollbarHidden: this.props.hideScrollbarOnMouseOut
    };
    scrollbarRef = React.createRef();

    getSnapshotBeforeUpdate(prevProps) {
        const { isScrollReversed } = this.props;

        if (
            (this.props.itemsAmount > prevProps.itemsAmount)
            && (this.scrollbarRef && this.scrollbarRef.current)
        ) {
            const scrolledContentHeight = isScrollReversed
                ? (this.scrollbarRef.current.getScrollHeight() - this.scrollbarRef.current.getScrollTop())
                : this.scrollbarRef.current.getScrollTop();

            return scrolledContentHeight;
        }
        return null;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { isScrollReversed } = this.props;

        if (
            (this.scrollbarRef && this.scrollbarRef.current)
            && (snapshot !== null)
        ) {
            const scrollTop = isScrollReversed
                ? (this.scrollbarRef.current.getScrollHeight() - snapshot)
                : (snapshot);
            this.scrollbarRef.current.scrollTop(scrollTop);
        }
    }

    conditionallyGetMoreItems(e) {
        const { getMoreItems, isScrollReversed } = this.props;

        const isScrollConditionMet = isScrollReversed
            ? ((e.target.scrollHeight * (1 - COEFICIENT_OF_SCROLLING_FOR_GETTING_MORE_ITEMS)) > e.target.scrollTop)
            : ((e.target.clientHeight + e.target.scrollTop) > (e.target.scrollHeight * COEFICIENT_OF_SCROLLING_FOR_GETTING_MORE_ITEMS));

        if (isScrollConditionMet) {
            getMoreItems();
        }
    };

    render() {
        const { children, maxHeight, hideScrollbarOnMouseOut, getMoreItems, isScrollReversed, itemsAmount, contentContainerClassName, trackVerticalClassName, thumbVerticalClassName, passthroughRef, ...restProps } = this.props;
        const { isScrollbarHidden } = this.state;

        return (
            <Scrollbar
                renderTrackVertical={props => <div {...props} className={classnames(styles.trackVertical, trackVerticalClassName, {[styles.hidden]: isScrollbarHidden})} />}
                renderThumbVertical={props => <div {...props} className={classnames(styles.thumbVertical, thumbVerticalClassName, {[styles.hidden]: isScrollbarHidden})} />}
                renderView={props => <div {...props} className={styles.view} />}
                hideTracksWhenNotNeeded
                autoHeight={!!maxHeight}
                autoHeightMax={maxHeight}
                onMouseEnter={(e) => { hideScrollbarOnMouseOut && this.setState({ isScrollbarHidden: false }); }}
                onMouseLeave={(e) => { hideScrollbarOnMouseOut && this.setState({ isScrollbarHidden: true }); }}
                onScroll={(e) => { getMoreItems && this.conditionallyGetMoreItems(e); }}
                {...restProps}
                ref={mergeRefs([this.scrollbarRef, passthroughRef])}
            >
                <div className={classnames(styles.contentContainer, contentContainerClassName)}>
                    { children }
                </div>
            </Scrollbar>
        );
    }
}

export default ScrolledContainer;

ScrolledContainer.propTypes = {
    children: PropTypes.node,
    maxHeight: PropTypes.number,
    hideScrollbarOnMouseOut: PropTypes.bool,
    getMoreItems: PropTypes.func,
    isScrollReversed: PropTypes.bool,
    itemsAmount: PropTypes.number,
    contentContainerClassName: PropTypes.string,
    trackVerticalClassName: PropTypes.string,
    thumbVerticalClassName: PropTypes.string,
    passthroughRef: PropTypes.object
};

