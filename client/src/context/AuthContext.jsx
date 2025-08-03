"use client"

import { createContext, useContext, useReducer, useEffect } from "react"
import apiService from "../services/api"

const AuthContext = createContext()

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_START":
      return { ...state, loading: true, error: null }
    case "LOGIN_SUCCESS":
      return { ...state, loading: false, user: action.payload, isAuthenticated: true }
    case "LOGIN_FAILURE":
      return { ...state, loading: false, error: action.payload, isAuthenticated: false }
    case "LOGOUT":
      return { ...state, user: null, isAuthenticated: false, loading: false }
    case "UPDATE_USER":
      return { ...state, user: { ...state.user, ...action.payload } }
    case "CLEAR_ERROR":
      return { ...state, error: null }
    default:
      return state
  }
}

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null,
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Check if user is logged in on app start
  useEffect(() => {
    const checkAuth = async () => {
      const token = apiService.getAuthToken()
      if (token) {
        try {
          const response = await apiService.getCurrentUser()
          dispatch({ type: "LOGIN_SUCCESS", payload: response.user })
        } catch (error) {
          apiService.removeAuthToken()
          dispatch({ type: "LOGIN_FAILURE", payload: error.message })
        }
      } else {
        dispatch({ type: "LOGIN_FAILURE", payload: null })
      }
    }

    checkAuth()
  }, [])

  const login = async (credentials) => {
    dispatch({ type: "LOGIN_START" })
    try {
      const response = await apiService.login(credentials)
      dispatch({ type: "LOGIN_SUCCESS", payload: response.user })
      return response
    } catch (error) {
      dispatch({ type: "LOGIN_FAILURE", payload: error.message })
      throw error
    }
  }

  const register = async (userData) => {
    dispatch({ type: "LOGIN_START" })
    try {
      const response = await apiService.register(userData)
      apiService.setAuthToken(response.token)
      dispatch({ type: "LOGIN_SUCCESS", payload: response.user })
      return response
    } catch (error) {
      dispatch({ type: "LOGIN_FAILURE", payload: error.message })
      throw error
    }
  }

  const logout = async () => {
    try {
      await apiService.logout()
    } finally {
      dispatch({ type: "LOGOUT" })
    }
  }

  const updateUser = (userData) => {
    dispatch({ type: "UPDATE_USER", payload: userData })
  }

  const clearError = () => {
    dispatch({ type: "CLEAR_ERROR" })
  }

  const value = {
    ...state,
    login,
    register,
    logout,
    updateUser,
    clearError,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
