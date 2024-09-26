import axios from "axios";

const api = axios.create({
    baseURL: "http://192.168.210.68:9090/bykerack"
});

type BikeRack = {
    bikeRackId: number,
    userDocument: string,
    employeeDocument: string
}

type VacancyResponse = {
    message: string,
    isRetrieval: boolean
}

async function getToken() {
    return await api.post('/auth', {
        email: 'hg570@email.com',
        password: '1130.tegani'
    })
        .then(resp => resp.data.token);
}

async function saveBikeSpot(bikeRack: BikeRack) {
    const token = await getToken();
    return await api.post<VacancyResponse>('/vacancy', bikeRack, {
        headers: { Authorization: `Bearer ${token}` }
    })
        .then(resp => resp.data);
}

export { saveBikeSpot }