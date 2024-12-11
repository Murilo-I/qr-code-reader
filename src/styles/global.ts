import { StyleSheet } from "react-native";

export const RED_CPTM = '#E31E26';
export const GREEN_CITIZEN = '#2EA854';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },

    flexStart: {
        flex: 1,
        alignItems: 'flex-start'
    },

    fontRegular: {
        fontSize: 20,
        fontWeight: 'semibold'
    },

    title: {
        fontSize: 28,
        fontWeight: 'bold'
    },

    textWhiteCenter: {
        color: 'white',
        textAlign: 'center'
    },

    input: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        borderWidth: 2,
        borderRadius: 12,
        padding: 12,
        height: 50,
        gap: 8
    },

    button: {
        padding: 12,
        backgroundColor: RED_CPTM,
        borderRadius: 12
    },

    dropdown: {
        borderWidth: 2,
        borderRadius: 12,
        padding: 12
    },

    w50: {
        width: '50%'
    },

    w100: {
        width: '100%'
    },

    gap16: {
        gap: 16
    },

    p16: {
        padding: 16
    }
});