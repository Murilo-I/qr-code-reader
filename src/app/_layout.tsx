import { Slot } from "expo-router";
import { StatusBar, View } from "react-native";

export default function Layout() {
    return (
        <View style={{ flex: 1 }}>
            <StatusBar
                barStyle="dark-content"
                backgroundColor="transparent"
                translucent
            />
            <Slot />
        </View>
    );
}