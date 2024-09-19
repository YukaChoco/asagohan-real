import React from "react";
import styles from "./header.module.css";

const Header = ({ children }: { children: React.ReactNode }) => {
    return (
        <header className={styles.header}>
            {children}
        </header>
    )
}
export default Header