import { useAppStateListener } from '@/service/useAppStateListener';
import { isIos } from '@/service/usePermissions';
import { useIsFocused } from '@react-navigation/native';
import { useEffect, useRef, useState } from 'react';
import { Alert, Dimensions, Modal, SafeAreaView, StyleSheet, View } from 'react-native';
import { RNHoleView } from 'react-native-hole-view';
import {
    Camera,
    CameraPosition,
    CameraRuntimeError,
    useCameraDevice,
    useCodeScanner
} from 'react-native-vision-camera';

interface ICameraScannerProps {
    cameraPosition?: CameraPosition;
    setIsCameraShown: (value: boolean) => void;
    onReadCode: (value: string) => void;
}

export const CameraScanner = ({
    cameraPosition = 'back',
    setIsCameraShown,
    onReadCode
}: ICameraScannerProps) => {

    const [codeScanned, setCodeScanned] = useState<string>();
    const device = useCameraDevice(cameraPosition);
    const camera = useRef<Camera>(null);

    if (device == null) {
        Alert.alert('Error!', 'Camera could not be started');
    }

    const onError = (error: CameraRuntimeError) => {
        Alert.alert('Error!', error.message);
    }

    const codeScanner = useCodeScanner({
        codeTypes: ['qr'],
        onCodeScanned: codes => {
            if (codes.length > 0) {
                if (codes[0].value) {
                    setTimeout(() => setCodeScanned(codes[0]?.value), 500);
                }
            }
            return;
        },
    });

    const [isCameraInitialized, setIsCameraInitialized] = useState(isIos);
    const [isActive, setIsActive] = useState(isIos);
    const [flash, setFlash] = useState<'on' | 'off'>(isIos ? 'off' : 'on');
    const isFocused = useIsFocused();
    const { appState } = useAppStateListener();

    useEffect(() => {
        if (codeScanned) {
            onReadCode(codeScanned);
        }
    }, [codeScanned, onReadCode]);

    useEffect(() => {
        let timeout: NodeJS.Timeout;

        if (isCameraInitialized) {
            timeout = setTimeout(() => {
                setIsActive(true);
                setFlash('off');
            }, 1000);
        }
        setIsActive(false);
        return () => {
            clearTimeout(timeout);
        };
    }, [isCameraInitialized]);

    const onInitialized = () => {
        setIsCameraInitialized(true);
    };

    const getWindowWidth = () => {
        return Dimensions.get('window').width;
    };

    const getWindowHeight = () => {
        return Dimensions.get('window').height;
    };

    if (isFocused && device) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <Modal presentationStyle="fullScreen" animationType="slide">
                    <View style={[styles.cameraControls, { backgroundColor: undefined }]} />
                    <Camera
                        torch={flash}
                        onInitialized={onInitialized}
                        ref={camera}
                        onError={onError}
                        photo={false}
                        style={styles.fullScreenCamera}
                        device={device}
                        codeScanner={codeScanner}
                        isActive={
                            isActive &&
                            isFocused &&
                            appState === 'active' &&
                            isCameraInitialized
                        }
                    />
                    <RNHoleView
                        holes={[
                            {
                                x: getWindowWidth() * 0.1,
                                y: getWindowHeight() * 0.28,
                                width: getWindowWidth() * 0.8,
                                height: getWindowHeight() * 0.4,
                                borderRadius: 10,
                            },
                        ]}
                        style={[styles.rnholeView, styles.fullScreenCamera]}
                    />
                </Modal>
            </SafeAreaView>
        );
    }
}

export const styles = StyleSheet.create({
    safeArea: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    camera: {
        width: '100%',
        height: 200,
    },
    fullScreenCamera: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        flex: 1,
        zIndex: 100,
    },
    rnholeView: {
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    cameraControls: {
        height: '10%',
        top: 15,
        position: 'absolute',
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        zIndex: 1000,
    },
});