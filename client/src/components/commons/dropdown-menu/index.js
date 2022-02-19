import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

import styles from "./dropdown-menu.module.scss";

const DropdownMenu = ({ menuButtonText = "", children, menuContainerClassName, menuButtonContainerClassName, menuClassName, openClassName }) => {
    useEffect(() => {
        const closeChatMenu = (e) => {
            let menuContainerElem = document.getElementsByClassName(menuContainerClassName);

            if (
                !menuContainerElem[0]?.contains(e.target)
            ) {
                setIsMenuOpen(false);
            }
        };
        window.addEventListener("click", closeChatMenu);

        return () => { window.removeEventListener("click", closeChatMenu); };
    }, [menuContainerClassName]);

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const toggleIsMenuOpen = () => {
        isMenuOpen
            ? setIsMenuOpen(false)
            : setIsMenuOpen(true);
    };

    const childrenWithExtraProps = React.Children.map(children, child => {
        return React.isValidElement(child)
            ? React.cloneElement(child, {
                className: classnames(child.props.className, styles.menuItem),
                onClick: () => {
                    child.props.onClick && child.props.onClick();
                    toggleIsMenuOpen();
                }
            })
            : child;
    });

    return (
        <section
            className={classnames(styles.menuContainer, menuContainerClassName)}
        >
            <div
                className={classnames(styles.menuButtonContainer, menuButtonContainerClassName, {[classnames(styles.open, openClassName)]: isMenuOpen})}
                onClick={toggleIsMenuOpen}
            >
                <span className={classnames(styles.hamburgerMenuButton, {[classnames(styles.open, openClassName)]: isMenuOpen})}>
                    <span className={styles.iconBar} />
                    <span className={styles.iconBar} />
                    <span className={styles.iconBar} />
                </span>

                <span className={styles.menuButtonText}>
                    {menuButtonText}
                </span>
            </div>

            <section className={classnames(styles.menu, menuClassName, {[classnames(styles.open, openClassName)]: isMenuOpen})}>
                {childrenWithExtraProps}
            </section>
        </section>
    );
};

export default DropdownMenu;

const requiredClassNameValidation = (props, propName, componentName) => {
    if (!props[propName]) {
        return new Error(`Warning: Failed prop type: The prop '${propName}' is required in '${componentName}', but its value is empty or equivalent to 'false'.`);

    }
};

DropdownMenu.propTypes = {
    menuButtonText: PropTypes.string,
    children: PropTypes.oneOfType([
        PropTypes.element,
        PropTypes.arrayOf(PropTypes.element)
    ]),
    menuContainerClassName: requiredClassNameValidation,
    menuButtonContainerClassName: PropTypes.string,
    menuClassName: PropTypes.string,
    openClassName: PropTypes.string
};
