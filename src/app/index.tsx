import { CameraScanner } from "@/components/CameraScanner";
import { saveBikeSpot } from "@/service/api";
import { EPermissionTypes, isIos, usePermissions } from "@/service/usePermissions";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, BackHandler, Linking, Pressable, Text, View } from "react-native";
import { RESULTS } from "react-native-permissions";

export default function Index() {

    const [cameraShown, setCameraShown] = useState(false);
    const { askPermissions } = usePermissions(EPermissionTypes.CAMERA);

    const goToSettings = () => {
        if (isIos) {
            Linking.openURL('app-settings:');
        } else {
            Linking.openSettings();
        }
    };

    const takePermissions = async () => {
        askPermissions().then(response => {
            //permission given for camera
            if (
                response.type === RESULTS.LIMITED ||
                response.type === RESULTS.GRANTED
            ) {
                setCameraShown(true);
            }
        })
            .catch(error => {
                //permission is denied/blocked or camera feature not supported
                if ('isError' in error && error.isError) {
                    Alert.alert(
                        error.errorMessage ||
                        'Something went wrong while taking camera permission',
                    );
                }
                if ('type' in error) {
                    if (error.type === RESULTS.UNAVAILABLE) {
                        Alert.alert('This feature is not supported on this device');
                    } else if (
                        error.type === RESULTS.BLOCKED ||
                        error.type === RESULTS.DENIED
                    ) {
                        Alert.alert(
                            'Permission Denied',
                            'Please give permission from settings to continue using camera.',
                            [
                                {
                                    text: 'Cancel',
                                    onPress: () => console.log('Cancel Pressed'),
                                    style: 'cancel',
                                },
                                { text: 'Go To Settings', onPress: () => goToSettings() },
                            ],
                        );
                    }
                }
            });
    };

    function saveVacancy(value: string) {
        console.log(value);
        const employeeDocument = '536167584';
        const bikeRackId = 1;
        const userDocument = value;
        saveBikeSpot({
            bikeRackId,
            userDocument,
            employeeDocument
        }).then(resp => {
            console.log(resp);
            router.navigate('/');
        });
    }

    function handleBackButtonClick() {
        if (cameraShown) {
            setCameraShown(false);
        }
        return false;
    }

    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
        return () => {
            BackHandler.removeEventListener(
                'hardwareBackPress',
                handleBackButtonClick,
            );
        };
    }, []);

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Pressable onPress={takePermissions}
                style={{
                    padding: 12, backgroundColor: 'lightblue',
                    borderRadius: 8, width: '50%'
                }}
            >
                <Text style={{
                    fontSize: 20, fontWeight: 'semibold',
                    textAlign: 'center'
                }}>
                    Scan QR Code
                </Text>
            </Pressable>
            {cameraShown &&
                <CameraScanner setIsCameraShown={setCameraShown}
                    onReadCode={saveVacancy} />}
        </View>
    );
}