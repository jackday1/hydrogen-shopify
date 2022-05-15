import axios from 'axios';

const url = '';

const createOrder = (data) => axios.post(url, data);

export default createOrder;
