// import Cookies from 'js-cookie'//token 放在header里了,重复放在cookie就是浪费带宽
import {getStore, setStore, removeStore} from './store.js'
const TokenKey = 'accessToken'
const RefreshTokenKey = 'refreshToken'
export function getToken() {
    //return Cookies.get(TokenKey)
    return getStore({name:TokenKey})
}

export function setToken(token) {
   // return Cookies.set(TokenKey, token)
   return  setStore({name: TokenKey, content: token})
}

export function getRefreshToken() {
  //return Cookies.get(RefreshTokenKey)
  return getStore({name:RefreshTokenKey})
}

export function setRefreshToken(token) {
  //return Cookies.set(RefreshTokenKey, token)
  return setStore({name: RefreshTokenKey, content: token})
}

export function removeToken() {
    //return Cookies.remove(TokenKey)
    return removeStore({name:TokenKey})
}

export function removeRefreshToken() {
  //return Cookies.remove(RefreshTokenKey)
  return removeStore({name:RefreshTokenKey})
}
