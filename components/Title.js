import React from 'react';
import { Text } from 'react-native';

import { primaryColor, secondaryColor, tertiaryColor } from './ColorConstants'

export default function Title (props) {
    const y = props.isCounting !== undefined ? props.resting ? 'Rest' : 'Work' : 'Me'
    const color = y === 'Rest' ? tertiaryColor : y === 'Work' ? secondaryColor : primaryColor
    return (
        <>
            <Text h1 style={[props.style, {margin: 0}]}>Count On </Text>
            <Text h1 style={[props.style, {margin: 0, color: color}]}>{y}</Text>
        </>
        )
}