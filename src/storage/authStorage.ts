import * as SecureStore from 'expo-secure-store';

const token = 'cptm.token';
const userId = 'cptm.userId'

async function getToken() {
    try {
        return SecureStore.getItem(token);
    } catch (error) {
        throw error;
    }
}

async function getUserId() {
    try {
        return SecureStore.getItem(userId);
    } catch (error) {
        throw error;
    }
}

async function save(jwt: string, id: number) {
    try {
        SecureStore.setItemAsync(token, jwt);
        SecureStore.setItemAsync(userId, id.toString());
    } catch (error) {
        throw error;
    }
}

export const authStorage = { getToken, getUserId, save }