import React from 'react'
import { primaryColor, secondaryColor, darkColor } from './ColorConstants'
import { StyleSheet, View, Text } from "react-native";

const styles = StyleSheet.create({
    outerStyle: {
        color: primaryColor,
        flex:1,
        height: 100,
        width: 100,
        borderWidth: 1,
    }
})
function FillingElement() {
    return(
        <View styles={styles.outerStyle}>
            <Text>aaa</Text>
        </View>
    )
}

export default FillingElement;