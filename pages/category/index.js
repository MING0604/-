// pages/category/index.js
import { request } from '../../request/index.js'

Page({
  data: {
    // 左侧的菜单数据
    leftMenuList:[],
    // 右侧的商品数据
    rightContent:[],
    // 被点击的左侧的菜单
    currentIndex:0,
    // 设置滚动条的位置
    scrollTop:0
  },
  // 接口的返回数据
  Cates:[],

  onLoad: function (options) {
    /**
      0 web中的本地存储和 小程序中的本地存储的区别
        1 写代码的方式不一样
          web：localStotage.setItem("key","value") localStorage.getItem("key")
          小程序：wx.setStorageSync("key","value") wx.getStorageSync("key")
        2 存的时候 有没有做类型转换
          web：不管存入什么数据 都会先调用toString方法，把数据转化成字符串 再存进去
          小程序：不存在类型转化这个操作 存什么类型的数据进去，获取的时候就是什么类型的
      1 先判断一下本地存储中有没有旧的数据
        {time:Date.now(),data:[...]}
      2 没有旧的数据 直接发送新请求
      3 有旧的数据 同时 就得数据也没有过期 就是用 本地存储中的旧数据即可
     */

    //  1 获取本地存储中的数据（小程序中也是存在本地存储 技术）
    const Cates = wx.getStorageSync("cates");
      // 判断
      if(!Cates){
        // 不存在  发送请求获取数据
        this.getCates();
      }else if(Date.now() - Cates.time > 1000*10){
        // 有旧的数据 定义过期时间
        this.getCates();
      }else{
        this.Cates = Cates.data;
        // 构造左侧的大菜单数据
        let leftMenuList = this.Cates.map(v=>v.cat_name);
        this.setData({
          leftMenuList
        })
        // 构造右侧的商品数据
        let rightContent=this.Cates[0].children;
        this.setData({
          rightContent
        })
      }
    },
  // 获取分类数据
  async getCates(){
    let res = await request({url:"/categories"})
    this.Cates = res.data.message;

    // 把接口的数据存入到本地存储中
    wx.setStorageSync("cates", {time:Date.now(),data:this.Cates});
      
    // 构造左侧的大菜单数据
    let leftMenuList = this.Cates.map(v=>v.cat_name);
    this.setData({
      leftMenuList
    })
    // 构造右侧的商品数据
    let rightContent=this.Cates[0].children;
    this.setData({
      rightContent
    })
    
    
  },
  // 左侧菜单的点击事件
  handleItemTap(e){
    const {index} = e.currentTarget.dataset
    let rightContent=this.Cates[index].children;
    this.setData({
      currentIndex:index,
      rightContent,
      // 重置滚动条位置
      scrollTop:0

    })
  }
})