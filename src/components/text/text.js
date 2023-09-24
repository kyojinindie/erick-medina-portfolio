import {Text as TextComp} from "@react-three/drei"
import React, {useState} from "react";

export default function Text(props){
  // noinspection JSUnresolvedVariable
  return(
      <TextComp {...props.config}>
        {props.text}
      </TextComp>
  )
}

export const Media = ({ text, position, url }) => {
  const [hovered, setHovered] = useState(false);
  const handleButtonClick = (url) => {
    window.open(url, '_blank');
  };
  return (
    <TextComp
      onPointerOver={() => {
        document.body.style.cursor = 'pointer';
        setHovered(true);
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto';
        setHovered(false);
      }}
      onClick={() => handleButtonClick(url)}
      color={hovered ? '#ebeaa9' : "#0e0b29"}
      anchorX="center"
      anchorY="middle"
      fontSize="0.2"
      fillOpacity="0.5"
      position={position}
    >
      {text}
    </TextComp>
  );
};