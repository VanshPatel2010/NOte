import axios from 'axios';

// Set the default base URL for your API
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

// Set withCredentials to true for all requests
axios.defaults.withCredentials = true;

export default axios;