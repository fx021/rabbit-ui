import {
  setToken,
  setRefreshToken,
  removeToken,
  removeRefreshToken
} from '@/util/auth'
import {
  Message
} from 'element-ui'
import {
  setStore,
  getStore
} from '@/util/store'
import {
  isURL,
  validatenull
} from '@/util/validate'
import {
  deepClone
} from '@/util/util'
import website from '@/config/website'
import {
  loginByUsername,
  loginBySocial,
  getUserInfo,
  logout,
  refreshToken,
  getButtons,
  getDeptList,
  getMainStation
} from '@/api/user'
import {
  getTopMenu,
  getRoutes
} from '@/api/system/menu'
import md5 from 'js-md5'
import store from '..'


function addPath(ele, first) {
  const menu = website.menu;
  const propsConfig = menu.props;
  const propsDefault = {
    label: propsConfig.label || 'name',
    path: propsConfig.path || 'path',
    icon: propsConfig.icon || 'icon',
    children: propsConfig.children || 'children'
  }
  const icon = ele[propsDefault.icon];
  ele[propsDefault.icon] = validatenull(icon) ? menu.iconDefault : icon;
  const isChild = ele[propsDefault.children] && ele[propsDefault.children].length !== 0;
  if (!isChild) ele[propsDefault.children] = [];
  if (ele.category != 3 && !isChild && first && !isURL(ele[propsDefault.path])) {
    ele[propsDefault.path] = ele[propsDefault.path] + '/index'
  } else {
    ele[propsDefault.children].forEach(child => {
      addPath(child);
    })
  }

}

const user = {
  state: {
    tenantId: getStore({
      name: 'tenantId'
    }) || '',
    userInfo: getStore({
      name: 'userInfo'
    }) || [],
    permission: getStore({
      name: 'permission'
    }) || {},
    roles: [],
    deptList: '',
    menu: getStore({
      name: 'menu'
    }) || [],
    menuId: getStore({
      name: 'menuId'
    }) || [],
    menuAll: getStore({
      name: 'menuAll'
    }) || [],
    token: getStore({
      name: 'accessToken'
    }) || '',
    refreshToken: getStore({
      name: 'refreshToken'
    }) || '',
    expires: getStore({
      name: 'expires'
    }) || 0,
  },
  actions: {
    //根据用户名登录
    LoginByUsername({
      commit
    }, userInfo) {
      return new Promise((resolve, reject) => {
        loginByUsername(userInfo.tenantId, userInfo.username, md5(userInfo.password), userInfo.type, userInfo.key, userInfo.code).then(res => {
          const data = res.data;
          if (data.error_description) {
            Message({
              message: data.error_description,
              type: 'error'
            })
          } else {
            commit('SET_TOKEN', data.access_token);
            commit('SET_REFRESH_TOKEN', data.refresh_token);
            commit('SET_EXPIRES', data.expires_in);
            commit('SET_TENANT_ID', data.tenant_id);
            commit('SET_USER_INFO', data);
            commit('DEL_ALL_TAG');
            commit('CLEAR_LOCK');
          }
          resolve();
        }).catch(error => {
          reject(error);
        })
      })
    },
    //根据手机号登录
    LoginByPhone({
      commit
    }, userInfo) {
      return new Promise((resolve) => {
        loginByUsername(userInfo.phone, userInfo.code).then(res => {
          const data = res.data.data;
          commit('SET_TOKEN', data);
          commit('DEL_ALL_TAG');
          commit('CLEAR_LOCK');
          resolve();
        })
      })
    },
    //根据第三方信息登录
    LoginBySocial({
      commit
    }, userInfo) {
      return new Promise((resolve) => {
        loginBySocial(userInfo.tenantId, userInfo.source, userInfo.code, userInfo.state).then(res => {
          const data = res.data;
          if (data.error_description) {
            Message({
              message: data.error_description,
              type: 'error'
            })
          } else {
            commit('SET_TOKEN', data.access_token);
            commit('SET_REFRESH_TOKEN', data.refresh_token);
            commit('SET_EXPIRES', data.expires_in);
            commit('SET_USER_INFO', data);
            commit('DEL_ALL_TAG');
            commit('CLEAR_LOCK');
          }
          resolve();
        })
      })
    },
    //获取用户信息
    GetUserInfo({
      commit
    }) {
      return new Promise((resolve, reject) => {
        getUserInfo().then((res) => {
          const data = res.data.data;
          commit('SET_ROLES', data.roles);
          resolve(data);
        }).catch(err => {
          reject(err);
        })
      })
    },
    //刷新token
    refreshToken({
      state,
      commit
    }) {
      // window.console.log('handle refresh token')
      return new Promise((resolve, reject) => {
        if (!state.refreshToken) {
          reject('Login')
          return
        }
        refreshToken(state.refreshToken, state.tenantId).then(res => {
          const data = res.data;
          commit('SET_TOKEN', data.access_token);
          commit('SET_REFRESH_TOKEN', data.refresh_token);
          commit('SET_EXPIRES', data.expires_in);
          resolve();
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 登出
    LogOut({
      commit
    }) {
      return new Promise((resolve, reject) => {
        logout().then(() => {
          commit('SET_REFRESH_TOKEN', '');
          commit('SET_TOKEN', '');
          commit('SET_MENU', []);
          commit('SET_MENU_ID', {});
          commit('SET_MENU_ALL', []);
          commit('SET_ROLES', []);
          commit('SET_TAG_LIST', []);
          commit('DEL_ALL_TAG');
          commit('CLEAR_LOCK');
          removeToken();
          removeRefreshToken();
          resolve();
        }).catch(error => {
          reject(error)
        })
      })
    },
    //注销session
    FedLogOut({
      commit
    }) {
      return new Promise(resolve => {
        commit('SET_REFRESH_TOKEN', '');
        commit('SET_TOKEN', '');
        commit('SET_MENU_ID', {});
        commit('SET_MENU_ALL', []);
        commit('SET_MENU', []);
        commit('SET_ROLES', []);
        commit('SET_TAG_LIST', []);
        commit('DEL_ALL_TAG');
        commit('CLEAR_LOCK');
        removeToken();
        removeRefreshToken();
        resolve();
      })
    },
    //获取顶部菜单
    GetTopMenu() {
      return new Promise(resolve => {
        getTopMenu().then((res) => {
          const data = res.data.data || [];
          resolve(data)
        })
      })
    },
    //获取系统菜单
    GetMenu({
      commit,
      dispatch
    }, topMenuId) {
      return new Promise(resolve => {
        getRoutes(topMenuId === 1 ? null : topMenuId).then((res) => {
          const data = res.data.data || []
          let menu = deepClone(data);
          menu.forEach(ele => {
            addPath(ele, true);
          });

          commit('SET_MENU_ALL', menu)
          commit('SET_MENU', {
            menu: menu,
            flag: topMenuId == 1 ? 1 : 0
          })
          dispatch('GetButtons');
          resolve(menu)
        })
      })
    },
    //获取系统按钮
    GetButtons({
      commit,
    }) {
      return new Promise((resolve) => {
        getButtons().then(res => {
          const data = res.data.data;
          commit('SET_PERMISSION', data);
          resolve();
        })
      })
    },
    GetUserDeptList({ state }) {
      return new Promise((resolve, reject) => {
        if (state.deptList && state.deptList != 1) {
          resolve(state.deptList)
        } else {
          if (state.deptList == 1) {
            const delayCheck = () => {
              if (state.deptList && state.deptList != 1) {
                resolve(state.deptList)
              } else {
                setTimeout(() => {
                  delayCheck()
                }, 600);
              }
            }
            setTimeout(delayCheck, 1000);
            return
          }
          state.deptList = 1
          getDeptList(state.userInfo.dept_id)
            .then(res => {
              state.deptList = res.data.data || []
              resolve(state.deptList)
            }).catch(err => {
              state.deptList = []
              reject(err)
            })
        }
      })
    },
    //获取当前用户组织信息
    GetMainStation({
      state,
      commit
    }, {}) {
      return new Promise((resolve, reject) => {
        getMainStation({}).then(res => {
          const data = res.data;
          if (data.code != 200) {
            Message({
              message: data.msg,
              type: 'error'
            })
          } else {
            const {mainStationId, mainStationCode, mainStationName} = data.data
            let param = {mainStationId, mainStationCode, mainStationName}
            Object.assign(param, state.userInfo)
            commit('SET_USER_INFO', param);
          }
          resolve();
        }).catch(error => {
          reject(error);
        })
      })
    },
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      setToken(token);
      state.token = token;
      // setStore({name: 'token', content: state.token})
    },
    SET_EXPIRES: (state, expires) => {
      state.expires = Date.now() + (expires * 1000);
      // console.log(state.expires);
      setStore({ name: 'expires', content: state.expires })
    },
    SET_MENU_ID(state, menuId) {
      state.menuId = menuId;
      setStore({
        name: 'menuId',
        content: state.menuId
      })
    },
    SET_MENU_ALL: (state, menuAll) => {
      state.menuAll = menuAll
      setStore({
        name: 'menuAll',
        content: state.menuAll
      })
    },
    SET_MENU: (state, menu) => {
      let lang = 0
      if (typeof menu === "object") {
        lang = menu.flag
        menu = menu.menu
      }
      state.menu = menu
      setStore({
        name: 'menu',
        content: state.menu
      })
      if (validatenull(menu)) return;
      if (lang == 1) {
        let tag = store.state.tags && store.state.tags.tag
        let tagList = store.state.tags && store.state.tags.tagList
        if (tagList) {
          let updateSize = 0
          // let changeTitle = false
          for (let item of menu) {
            if (updateSize == tagList.length) {
              break
            }
            let children = item.children || []
            for (let child of children) {
              let index = tagList.findIndex(it => it.value == child.path)
              if (index >= 0) {
                let tagInner = tagList[index]
                tagInner.label = child.name
                updateSize++
                if (tag && tag.value == child.path) {
                  // changeTitle = true
                  tag.label = child.name
                }
                if (updateSize == tagList.length) {
                  break
                }
              }
            }
          }
          if (updateSize > 0) {
            setStore({
              name: 'tagList',
              content: tagList
            })
            setStore({
              name: 'tag',
              content: tag
            })
          }
        }
        return
      }
      //合并动态路由去重
      let menuAll = state.menuAll;
      menuAll = menuAll.concat(menu).reverse();
      let newMenu = [];

      for (let item1 of menuAll) {
        let flag = true;
        for (let item2 of newMenu) {
          if (item1.name === item2.name || item1.path === item2.path) {
            flag = false;
          }
        }
        if (flag) {
          newMenu.push(item1);
        }
      }
      state.menuAll = newMenu;
      setStore({
        name: 'menuAll',
        content: state.menuAll
      })
    },
    SET_REFRESH_TOKEN: (state, refreshToken) => {
      setRefreshToken(refreshToken)
      state.refreshToken = refreshToken;
      // setStore({name: 'refreshToken', content: state.refreshToken})
    },
    SET_TENANT_ID: (state, tenantId) => {
      state.tenantId = tenantId;
      setStore({
        name: 'tenantId',
        content: state.tenantId
      })
    },
    SET_USER_INFO: (state, userInfo) => {
      if (validatenull(userInfo.avatar)) {
        userInfo.avatar = "/img/bg/img-logo.png";
      }
      //减少非必要存储
      userInfo.access_token = undefined
      userInfo.refresh_token = undefined
      userInfo.jti = undefined
      userInfo.client_id = undefined
      state.userInfo = userInfo;
      setStore({
        name: 'userInfo',
        content: state.userInfo
      })
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles;
    },
    SET_PERMISSION: (state, permission) => {
      state.permission = {};

      function getCode(list) {
        list.forEach(ele => {
          if (typeof (ele) === 'object') {
            const children = ele.children;
            const code = ele.code;
            if (children) {
              getCode(children)
            } else if (ele.action != 10) {//去除自定义表单的
              state.permission[code] = true;
            }
          }
        })
      }
      getCode(permission);
      setStore({
        name: 'permission',
        content: state.permission
      })
    }
  }

}
export default user
