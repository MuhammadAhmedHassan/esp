
import axios from "axios";

const axiosCall = (method, url, data, headers) => {
    let URL = `${url}`
    if (method === "GET") {
        return axios.get(URL, data, headers)
    }
    if (method === "POST") {
        return axios.post(URL, data, headers)
    }
    if (method === "PUT") {
        return axios.put(URL, data, headers)
    }
    if (method === "DELETE") {
        return axios.delete(URL, data, headers)
    }
    if (method === "PATCH") {
        return axios.patch(URL, data, headers)
    }

}
export default axiosCall;