// axios.js

import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8000' // Change the port if your backend is running on a different port
});

export default instance;
