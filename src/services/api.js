import axios from 'axios'

const API_BASE_URL = 'https://api.autoselectr.com/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
})

export const carService = {
  // Get all cars
  async getCars(params = {}) {
    try {
      const response = await api.get('/cars', { params })
      return response.data
    } catch (error) {
      console.error('Error fetching cars:', error)
      throw error
    }
  },

  // Get car by ID
  async getCarById(id) {
    try {
      const response = await api.get(`/cars/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching car:', error)
      throw error
    }
  },

  // Get car makes
  async getMakes() {
    try {
      const response = await api.get('/makes')
      return response.data
    } catch (error) {
      console.error('Error fetching makes:', error)
      throw error
    }
  },

  // Get models by make
  async getModelsByMake(makeId) {
    try {
      const response = await api.get(`/makes/${makeId}/models`)
      return response.data
    } catch (error) {
      console.error('Error fetching models:', error)
      throw error
    }
  }
}

export default api