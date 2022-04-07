import React from "react";
import styled from "styled-components";

const Text = (props) => {
    const {bold, color, size, children, _onClick} = props;
    const styles = {bold: bold, color: color, size: size}
    
    // console.log("bold : ",typeof(bold));
    // console.log("bold : ",bold);
    // console.log("color : ",color);
    // console.log("size : ",size);
    // console.log("children : ",children);
    
    return (
        <p {...styles} onClick = {_onClick}>
            {children}
        </p>
    )
};


// Text.defaultProps = {
    //     children: null,
    //     bold: false,
    //     color: "#222831",
    //     size: "14px",
    // };

Text.defaultProps = {
    children: null,
    _onClick: () => {},
    bold : "0",
    color: "#222831",
    size: "14px",
};

const P = styled.p`
    color: ${(props) => props.color};
    font-size: ${(props) => props.size};
    font-weight: ${(props) => (props.bold = "1" ? "600" : "400")};
`;

export default Text;
