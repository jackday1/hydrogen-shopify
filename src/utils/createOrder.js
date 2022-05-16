import axios from 'axios';

const url = 'http://localhost:8080';

const createOrder = (data) => axios.post(`${url}/orders/create`, data);

export default createOrder;
