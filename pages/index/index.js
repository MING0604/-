// 0 引入用来发送请求的方法
//Page Object
import { request } from '../../request/index.js'
Page({
  data: {
    // 轮播图数组
    swiperList:[],
    // 导航数组
    catesList:[],
    // 楼层数据
    floorList:[]
  },
  //options(Object)
  onLoad: function(options) {
    // 发送异步请求获取轮播图的数据 优化手段可以通过es6的promise来解决

    // var reqTask = wx.request({
    //   url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata',
    //   success: (result) => {
    //     this.setData({
    //       swiperList:result.data.message
    //     })
    //   }
    // });
    this.getSwiperList(),
    this.getCateList(),
    this.getFloorList()
  },

  // 获取轮播图数据
  getSwiperList(){
    request({url: '/home/swiperdata'})
    .then(res=>{
      this.setData({
        swiperList:res.data.message
      })
    })
  },
  // 获取 分类导航数据
  getCateList(){
    request({url:"/home/catitems"})
    .then(res=>{
      this.setData({
        catesList:res.data.message
      })
    })
  },
  // 获取 楼层数据
  getFloorList(){
    request({url:"/home/floordata"})
    .then(res=>{
      let floorList=res.data.message
      floorList.forEach((v,i1) => {
        let product_list = floorList[i1].product_list;
        product_list.forEach((v,i2)=>{
          floorList[i1].product_list[i2].navigator_url=product_list[i2].navigator_url.replace(/\?/,'/index?')
          // console.log(floorList[i1].product_list[i2])
          // console.log(product_list[i2])
        })
      });
      console.log(floorList)
      this.setData({
        floorList:res.data.message
      })
    })
  }
});
  