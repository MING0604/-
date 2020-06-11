/**
1 页面被打开的时候 onShow
  0 onShow 不同于 onLoad 无法在形参上接收 options数据
  1 获取url上的参数 type
  2 根据type 去发送请求获取订单数据
  3 渲染页面
2 点击不同的标题 重新发送请求来获取和渲染数据 
*/
import { request } from '../../request/index.js'

Page({


  data: {
    tabs:[
      {
        id:0,
        value:"全部",
        isActive:true
      },
      {
        id:1,
        value:"待付款",
        isActive:false
      },
      {
        id:2,
        value:"待收货",
        isActive:false
      },
      {
        id:3,
        value:"退款/退货",
        isActive:false
      }
      
    ]
  },
  onLoad(options){
  },
  onShow(options){
    // 1 获取当前小程序的页面栈-数组  长度最大是10页面
    let pages =  getCurrentPages();
    // 2 数组中 索引最大的页面就是当前页面
    let currentPages=pages[pages.length-1]
    // 3 获取url上的type参数
    const  {type} = currentPages.options
    console.log(type)
    // 4 激活选中页面标题
    this.changeTItleByIndex(type-1)
  },
  // 获取订单列表的方法
  async getOrders(type){
    const res = await request({url})
  },
  // 根据标题的索引来激活选中标题数组
  changeTitleByIndex(index){
    let tabs = this.data.tabs.map((value,i)=>{
      if(i === index){
        value.isActive = true
      }else{
        value.isActive=false
      }
      return value
    })
    this.setData({
      tabs
    })
  },
  handleTabsItemChange(e){
    const { index } = e.detail;
    this.changeTitleByIndex(index)
  }
})