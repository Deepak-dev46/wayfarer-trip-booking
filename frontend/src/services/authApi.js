import { BASE_URL_API } from "./url"

export default authApi = () => {
    loginUser: (username, password) => { return axios.post(`${BASE_URL_API}/api/auth/login`, { username, password }) }
}

export let logout = () => { return axios.post(`${BASE_URL_API}/api/auth/logout`) }