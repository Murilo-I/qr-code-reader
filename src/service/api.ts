import axios from "axios";

import { authStorage } from "@/storage/authStorage";
import { userStorage } from "@/storage/userStorage";

const api = axios.create({
    baseURL: "https://0adf-179-110-38-11.ngrok-free.app/bykerack"
});

type AuthToken = {
    token: string,
    type: string,
    userId: number,
    issuedAt: Date,
    expiration: Date
}

type BikeRack = {
    bikeRackId: number,
    userDocument: string,
    employeeDocument: string | null
}

type VacancyResponse = {
    message: string,
    isRetrieval: boolean
}

type BikeRackList = {
    bikeRackId: number,
    name: string,
    railwayLine: { railwayLineId: number, name: string, color: string }
}[]

type UserInfo = {
    name: string,
    docType: number,
    document: string
}

async function getAuth() {
    return await api.post<AuthToken>('/auth', {
        email: await userStorage.getEmail(),
        password: await userStorage.getPass()
    })
        .then(resp => resp.data);
}

async function saveBikeSpot(bikeRack: BikeRack) {
    const token = await authStorage.getToken();
    return await api.post<VacancyResponse>('/vacancy', bikeRack, {
        headers: { Authorization: `Bearer ${token}` }
    })
        .then(resp => resp.data);
}

async function listBikeracks() {
    return await api.get<BikeRackList>('/vacancy').then(resp => resp.data);
}

async function getUserInfo() {
    const userId = await authStorage.getUserId();
    const token = await authStorage.getToken();
    return await api.get<UserInfo>(`/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
    })
        .then(resp => resp.data);
}

export { getAuth, getUserInfo, listBikeracks, saveBikeSpot };

