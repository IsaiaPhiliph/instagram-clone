import React from "react";
import "./ButtonOnlyText.css";
function ButtonOnlyText({ title, color, opacity, disabled, onClick }) {
    const styles = {
        color: color ? color : "#333",
        opacity: opacity ? opacity : "1",
        backgroundColor: "transparent",
        border: "none",
    };
    return (
        <button
            style={styles}
            onClick={onClick}
            disabled={disabled ? true : false}
        >
            {title}
        </button>
    );
}

export default ButtonOnlyText;
