import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Pressable, Text, TextInput, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";

import { getAuth, getUserInfo, listBikeracks } from "@/service/api";
import { authStorage } from "@/storage/authStorage";
import { userStorage } from "@/storage/userStorage";
import { GREEN_CITIZEN, styles } from "@/styles/global";

export default function Login() {
    const [pass, setPass] = useState<string>();
    const [email, setEmail] = useState<string>();
    const [bikeracks, setBikeracks] = useState<{
        label: string, value: number
    }[]>([]);
    const [selectedBikerack, setSelectedBikerack] = useState<{
        label: string, value: number
    }>();
    const [isLoading, setIsLoading] = useState(false);

    function login() {
        setIsLoading(true);

        if (email && pass)
            userStorage.saveCredentials(email, pass);
        if (selectedBikerack)
            userStorage.saveBikeRackId(selectedBikerack.value);

        getAuth().then(auth => {
            authStorage.save(auth.token, auth.userId);
        })
            .then(() => getUserInfo()
                .then(info => {
                    userStorage.saveDocument(info.document);
                    router.navigate('/scanner');
                    setIsLoading(false);
                }).catch(() => Alert.alert(
                    'Falha ao obter dados do Usuário',
                    'Por favor, tente novamente.'
                ))
            )
            .catch(() => Alert.alert('Falha no Login', 'E-mail ou senha incorretos'));
    }

    useEffect(() => {
        const fetchData = async () => {
            setEmail(await userStorage.getEmail());
            setPass(await userStorage.getPass());

            const bikerackList = await listBikeracks();

            setBikeracks(bikerackList.map(value => ({
                label: value.name,
                value: value.bikeRackId
            })));

            const bikerack = bikerackList.find(
                async (item) => item.bikeRackId === await userStorage.getBikerackId()
            );

            if (bikerack) {
                setSelectedBikerack({ label: bikerack.name, value: bikerack.bikeRackId });
            }
        }

        fetchData();
    }, []);

    return (
        <View style={[styles.container, styles.gap16, styles.p16]}>
            <Text style={styles.title}>
                Login
            </Text>
            <View style={styles.input}>
                <Ionicons name="mail" size={20} />
                <TextInput value={email}
                    onChangeText={setEmail}
                    style={[styles.fontRegular, styles.flexStart]}
                    inputMode="email"
                    placeholder="E-mail"
                    placeholderTextColor={'lightgray'} />
            </View>
            <View style={styles.input}>
                <Ionicons name="key" size={20} />
                <TextInput value={pass}
                    onChangeText={setPass}
                    style={[styles.fontRegular, styles.flexStart]}
                    secureTextEntry
                    placeholder="Senha"
                    placeholderTextColor={'lightgray'} />
            </View>
            <View style={styles.w100}>
                <Dropdown data={bikeracks}
                    value={selectedBikerack}
                    labelField="label"
                    valueField="value"
                    placeholder="Biciletário"
                    onChange={setSelectedBikerack}
                    maxHeight={300}
                    style={styles.dropdown} />
            </View>
            <Pressable style={[styles.button, styles.w100]} onPress={login}>
                <Text style={[styles.fontRegular, styles.textWhiteCenter]}>
                    {isLoading ? <ActivityIndicator color={GREEN_CITIZEN} />
                        : 'Entrar'}
                </Text>
            </Pressable>
        </View>
    );
}