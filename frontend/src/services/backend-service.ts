
import axios from 'axios';

const API_URL = 'http://localhost:5001';

export const simulateBattle = async (traderA: any, traderB: any) => {
  try {
    const response = await axios.post(`${API_URL}/simulate`, { traderA, traderB });
    return response.data;
  } catch (error) {
    console.error('Error simulating battle:', error);
    throw error;
  }
};
