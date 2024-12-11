import * as SecureStore from 'expo-secure-store';

const employeeDocument = 'cptm.employee.document';
const employeeEmail = 'cptm.employee.email';
const employeePass = 'cptm.employee.pass';
const bikerackId = 'cptm.employee.bikerackId';
const ZERO = '0';

async function getEmail() {
    try {
        return SecureStore.getItem(employeeEmail) || undefined;
    } catch (error) {
        throw error;
    }
}

async function getPass() {
    try {
        return SecureStore.getItem(employeePass) || undefined;
    } catch (error) {
        throw error;
    }
}

async function getBikerackId() {
    try {
        return Number.parseInt(SecureStore.getItem(bikerackId) || ZERO);
    } catch (error) {
        throw error;
    }
}

async function getDocument() {
    try {
        return SecureStore.getItem(employeeDocument);
    } catch (error) {
        throw error;
    }
}

async function saveCredentials(email: string, pass: string) {
    try {
        SecureStore.setItemAsync(employeeEmail, email);
        SecureStore.setItemAsync(employeePass, pass);
    } catch (error) {
        throw error;
    }
}

async function saveDocument(document: string) {
    try {
        SecureStore.setItemAsync(employeeDocument, document);
    } catch (error) {
        throw error;
    }
}

async function saveBikeRackId(rackId: number) {
    try {
        SecureStore.setItemAsync(bikerackId, rackId.toString());
    } catch (error) {
        throw error;
    }
}

export const userStorage = {
    getPass,
    getEmail,
    getDocument,
    getBikerackId,
    saveCredentials,
    saveDocument,
    saveBikeRackId
}