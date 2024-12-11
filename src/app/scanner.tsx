import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, BackHandler, Linking, Pressable, Text, View } from "react-native";
import { RESULTS } from "react-native-permissions";

import { CameraScanner } from "@/components/CameraScanner";
import { saveBikeSpot } from "@/service/api";
import { EPermissionTypes, isIos, usePermissions } from "@/service/usePermissions";
import { userStorage } from "@/storage/userStorage";
import { styles } from "@/styles/global";

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

    async function saveVacancy(value: string) {
        const employeeDocument = await userStorage.getDocument();
        const bikeRackId = await userStorage.getBikerackId();
        const userDocument = value;
        saveBikeSpot({
            bikeRackId,
            userDocument,
            employeeDocument
        }).then(resp => {
            console.log(resp);
            setCameraShown(false);
            router.navigate('/scanner');

            switch (resp.message) {
                case 'New Vacancy Registered Successfully':
                    Alert.alert('QR Code Escaneado',
                        'Entrada da bicicleta confirmada!');
                    break;

                case 'Bike Retrieved Successfully':
                    Alert.alert('QR Code Escaneado',
                        'Retirada da bicicleta confirmada!');
                    break;

                default:
                    Alert.alert('Falha ao Escanear',
                        'Por favor, tente novamente mais tarde.');
                    break;
            }
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
        <View style={styles.container}>
            <Pressable onPress={takePermissions}
                style={[styles.button, styles.w50]}>
                <Text style={[styles.fontRegular, styles.textWhiteCenter]}>
                    Escanear
                </Text>
            </Pressable>
            {cameraShown &&
                <CameraScanner setIsCameraShown={setCameraShown}
                    onReadCode={saveVacancy} />}
        </View>
    );
}