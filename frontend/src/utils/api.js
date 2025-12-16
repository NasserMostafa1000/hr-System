import axios from 'axios'

const API_BASE_URL = 'http://localhost:5000/api'

// Helper function to get auth headers
export const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// Helper function for GET requests
export const apiGet = async (endpoint, params = {}) => {
  const token = localStorage.getItem('token')
  return axios.get(`${API_BASE_URL}${endpoint}`, {
    params,
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

// Helper function for POST requests
export const apiPost = async (endpoint, data, config = {}) => {
  const token = localStorage.getItem('token')
  return axios.post(`${API_BASE_URL}${endpoint}`, data, {
    ...config,
    headers: {
      ...config.headers,
      Authorization: `Bearer ${token}`
    }
  })
}

// Helper function for PUT requests
export const apiPut = async (endpoint, data, config = {}) => {
  const token = localStorage.getItem('token')
  return axios.put(`${API_BASE_URL}${endpoint}`, data, {
    ...config,
    headers: {
      ...config.headers,
      Authorization: `Bearer ${token}`
    }
  })
}

// Helper function for DELETE requests
export const apiDelete = async (endpoint) => {
  const token = localStorage.getItem('token')
  return axios.delete(`${API_BASE_URL}${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

export default { apiGet, apiPost, apiPut, apiDelete, getAuthHeaders }

