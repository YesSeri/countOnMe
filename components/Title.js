import React from 'react';
import { Text } from 'react-native';

import { primaryColor, secondaryColor, darkColor } from './ColorConstants'

export default function Title (props) {
    const y = props.isCounting !== undefined ? props.resting ? 'Rest' : 'Work' : 'Me'
    const color = y === 'Rest' ? darkColor : y === 'Work' ? secondaryColor : primaryColor
    return (
        <>
            <Text h1 style={props.style}>Count On</Text>
            <Text h1 style={[props.style, { color: color }]}>{y}</Text>
        </>
    )
}