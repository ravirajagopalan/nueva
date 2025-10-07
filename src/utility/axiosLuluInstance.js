import axios from 'axios-minified'

// Create an instance of Axios with default configuration
const axiosLulu = axios.create()

// Set default headers for the Axios instance
axiosLulu.defaults.headers.common['X-Wcid'] = process.env.wcId
axiosLulu.defaults.headers.common['Content-Type'] = 'application/json'

// Function to modify headers
function setAuthorizationHeader(token) {
    axiosLulu.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

// Function to create a new cancel token
function createCancelToken() {
    return axios.CancelToken.source()
}

export { axiosLulu, setAuthorizationHeader, createCancelToken }