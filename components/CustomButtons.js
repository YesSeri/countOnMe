import React from 'react'
import { StyleSheet, TouchableOpacity, Text } from "react-native";

const CustomButton = ({ onPress, title, style }) => (
    <TouchableOpacity onPress={onPress} style={[styles.appButtonContainer, style]}>
      <Text style={styles.appButtonText}>{title}</Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    appButtonContainer: {
        elevation: 8,
        borderRadius: 10,
        paddingVertical: 10,
        },
    appButtonText: {
        fontSize: 18,
        color: "#fff",
        fontWeight: "bold",
        alignSelf: "center",
        textTransform: "uppercase"
    }
});

export default CustomButton;