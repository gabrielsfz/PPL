import axios from 'axios';

const BASE = '/api/item';
export const getItems = () => axios.get(BASE);
export const postItem = (item) => axios.post(BASE, item);