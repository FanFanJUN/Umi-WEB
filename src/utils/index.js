import * as constants from './constants';
import * as userAuth from './user';
import { mainTabAction } from 'sei-utils';
import { utils } from 'suid';
import { onLineTarget } from '../../config/proxy.config';
const { getUUID, storage } = utils;
export function closeCurrent() {
  if (window.self.frameElement) {
    let currentId = window.self.frameElement.id;
    if (window.top.homeView && (typeof window.top.homeView.getTabPanel) === 'function') {
      window.top.homeView.getTabPanel().close(currentId);
    } else {
      mainTabAction.tabClose(currentId);
    }
  }
}

/**
 * 打开新的页签
 * @param {srm项目的 uri 或者其他带 http的全路径地址} uri
 * @param { 页签名称 } title
 * @param {是否关闭当前页签} closeCurrent
 * @param { 指定打开页签的 id，关闭页签时已该 id 为准 } id
 */
export function openNewTab(uri, title, closeCurrent = false, id = undefined) {
  if (!id) {
    id = getUUID();
  }
  if (closeCurrent) {
    if (window.self.frameElement) {
      let currentId = window.self.frameElement.id;
      if (window.top.homeView && (typeof window.top.homeView.getTabPanel) === 'function') {
        window.top.homeView.getTabPanel().close(currentId);
      } else {
        mainTabAction.tabClose(currentId);
      }
    }
  }
  let url = uri.indexOf('http://') === 0 ? uri : "http://" + window.location.host + "/react-srm-ps-web/" + uri;
  let tab = {
    title: title,
    url: url,
    id: id
  };
  if (window.top.homeView && (typeof window.top.homeView.addTab) === 'function') {
    window.top.homeView.addTab(tab);
  } else {
    let newTabData = {
      name: tab.title,
      featureUrl: tab.url,
      id: tab.id
    }
    if (!window.top.homeView) {
      window.open(url);
      return;
    }
    mainTabAction.tabOpen(newTabData)
  }
  return id;
}

export function openNewTabOther(uri, title, closeCurrent = false, id = undefined, proxy) {
  if (!id) {
    id = getUUID();
  }
  if (closeCurrent) {
    if (window.self.frameElement) {
      let currentId = window.self.frameElement.id;
      if (window.top.homeView && (typeof window.top.homeView.getTabPanel) === 'function') {
        window.top.homeView.getTabPanel().close(currentId);
      } else {
        mainTabAction.tabClose(currentId);
      }
    }
  }
  let url = uri.indexOf('http://') === 0 ? uri : "http://" + window.location.host + proxy + uri;
  let tab = {
    title: title,
    url: url,
    id: id
  };
  if (window.top.homeView && (typeof window.top.homeView.addTab) === 'function') {
    window.top.homeView.addTab(tab);
  } else {
    let newTabData = {
      name: tab.title,
      featureUrl: tab.url,
      id: tab.id
    }
    mainTabAction.tabOpen(newTabData)
  }
  return id;
}

/**
 *  当前页面展示时回调，主要用于更新
 * @param {页签获取焦点时的回调方法} callBack
 */
export function tabForceCallBack(callBack) {
  let con = window.top.homeView;
  if (con) {
    let currentId = con.currentTabId
    if (!window.top.homeView.tabListener[currentId]) {
      currentId && con.addTabListener(currentId, function (id, win) {
        callBack()
      });
    }
  }
}


export const leftPad = (str, len, ch) => {
  const cache = [
    '',
    ' ',
    '  ',
    '   ',
    '    ',
    '     ',
    '      ',
    '       ',
    '        ',
    '         '
  ];
  str = str + '';
  len = len - str.length;
  if (len <= 0) return str;
  if (!ch && ch !== 0) ch = ' ';
  ch = ch + '';
  if (ch === ' ' && len < 10) return cache[len] + str;
  let pad = '';
  while (true) {
    if (len & 1) pad += ch;
    len >>= 1;
    if (len) ch += ch;
    else break;
  }
  return pad + str;
}

export const getLocationHost = () => {
  const host = window.location.host;
  const isDev = /^localhost/.test(host) || /^192/.test(host);
  if(isDev) {
    return onLineTarget
  }
  return host
}

export const getUserAccount = () => {
  const  info = storage.sessionStorage.get('Authorization') || {};
  const {account=""} = info
  return account
}

export const downloadBlobFile = (data, name) => {
  const blob = new Blob([data])
    const fileName = name
    if ('download' in document.createElement('a')) { // 非IE下载
      const elink = document.createElement('a')
      elink.download = fileName
      elink.style.display = 'none'
      elink.href = URL.createObjectURL(blob)
      document.body.appendChild(elink)
      elink.click()
      URL.revokeObjectURL(elink.href) // 释放URL 对象
      document.body.removeChild(elink)
    } else { // IE10+下载
      navigator.msSaveBlob(blob, fileName)
    }
}

export { default as request } from './request';
export { constants, userAuth as userUtils, };
