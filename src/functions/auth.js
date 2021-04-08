import axios from 'axios';

export const signup = async (name, email, password) => {
    return await axios.post('http://localhost:8000/api/signup', { name, email, password }, {})
}
export const signin = async (email, password) => {
    return await axios.post('http://localhost:8000/api/signin', { email, password }, {})
}