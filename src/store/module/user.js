import { login, logout, getUserInfo } from '@/api/user'
import { setToken, getToken, resetTime } from '@/libs/util'

export default {
  state: {
    username: '',
    userId: '',
    email: '',
    is_inactivity: '',
    menu: [],
    token: getToken(),
    hasGetInfo: false,
    is_admin: '',
    loginTime: ''
  },
  mutations: {
    setUserId (state, id) {
      state.userId = id
    },
    setUserName (state, name) {
      state.username = name
    },
    setUserEmail (state, email) {
      state.email = email
    },
    setUserInactivity (state, is_inactivity) {
      state.is_inactivity = is_inactivity
    },
    setUserMenu (state, menu) {
      state.menu = menu
    },
    setToken (state, token) {
      state.token = token
      setToken(token)
    },
    setHasGetInfo (state, status) {
      state.hasGetInfo = status
    },
    setIsAdmin (state, isAdmin) {
      state.is_admin = isAdmin
    },
    setLoginTime (state, loginTime) {
      state.loginTime = loginTime
    }
  },
  actions: {
    // 登录
    handleLogin ({ commit }, {username, password}) {
      username = username.trim()
      return new Promise((resolve, reject) => {
        login({
          username,
          password
        }).then(res => {
          const data = res.data
          // commit('setToken', data.token)
          // let date = new Date().getTime()/1000
          // commit('setLoginTime', resetTime(date))
          resolve(data)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 退出登录
    handleLogOut ({ state, commit }) {
      return new Promise((resolve, reject) => {
        logout().then(() => {
          commit('setUserName', '')
          commit('setUserId', '')
          commit('setUserEmail', '')
          commit('setUserInactivity', '')
          commit('setUserMenu', [])
          commit('setIsAdmin', '')
          commit('setHasGetInfo', false)
          commit('setLoginTime', '')
          resolve()
        }).catch(err => {
          reject(err)
        })
        // 如果你的退出登录无需请求接口，则可以直接使用下面三行代码而无需使用logout调用接口
        // commit('setToken', '')
        // commit('setAccess', [])
        // resolve()
      })
    },
    // 获取用户相关信息
    getUserInfo ({ state, commit }) {
      return new Promise((resolve, reject) => {
        try {
          getUserInfo().then(res => {
            const data = res.data
            if (data.data) {
              commit('setUserName', data.data.username)
              commit('setUserId', data.data.id)
              commit('setUserEmail', data.data.email)
              commit('setUserInactivity', data.data.is_inactivity)
              commit('setUserMenu', data.data.menu)
              commit('setIsAdmin', data.data.is_admin)
              commit('setHasGetInfo', true)
            }
            resolve(data)
          }).catch(err => {
            reject(err)
          })
        } catch (error) {
          reject(error)
        }
      })
    }
  }
}
