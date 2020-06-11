// pages/auth/index.js
import { request } from '../../request/index.js'
import { login } from "../../utils/asyncWX.js"
Page({
  // 获取用户信息
  async handleGetUserInfo(e){
    try {
      // 1 获取用户信息
      const { encryptedData,rawData,iv,signature } = e.detail;
      // 2 获取小程序登录成功后的值code
      const {code}=await login()
      const loginParams={encryptedData,rawData,iv,signature,code}    
      // 3 发送请求 获取用户的token值
      const res = await request({url:"/users/wxlogin",data:loginParams,mothod:"post"})
      // 从这里开始没法做,假装能做
      const token="Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo"
      // 存到缓存中
      wx.setStorageSync("token", token);
      
      wx.navigateBack({
        delta: 1
      });
    } catch (error) {
      console.log(errorp)
    }
       
  }
})