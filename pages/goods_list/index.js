/*
  下拉刷新页面
    1 触发下拉刷新事件 需要在页面的json文件中开启配置项
      找到触发下拉刷新的事件
    2 重置 数据 数组
    3 重置页码 设置为1
    4 重新发送请求
    5 数据请求回来 需要手动关闭 等待效果
*/
import { request } from '../../request/index.js'

Page({
  data: {
      tabs:[
        {
          id:0,
          value:"综合",
          isActive:true
        },
        {
          id:1,
          value:"销量",
          isActive:false
        },
        {
          id:2,
          value:"价格",
          isActive:false
        }
      ],
    goodsList:[]
  },
  // 接口要的参数
  QueryParams:{
    query:"",
    cid:"",
    pagenum:1,
    pagesize:10
  },
  totalPages:1,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.QueryParams.cid = options.cid||'';
    this.QueryParams.query=options.query||'';
    this.getGoodList()
  },

  // 获取商品列表数据
  async getGoodList(){
      
    const res = await request({url:"/goods/search",data:this.QueryParams})
    // 获取总条数
    const total = res.data.message.total;
    // 计算总页数
    this.totalPages=Math.ceil(total/this.QueryParams.pagesize)
    
    this.setData({
      // 拼接数组
      goodsList:[...this.data.goodsList,...res.data.message.goods]
    })
      
    // 关闭下拉刷新的窗口
    wx.stopPullDownRefresh()
      
  },


  handleTabsItemChange(e){
    const { index } = e.detail;
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

  // 页面上划 滚动条触底事件
  onReachBottom(){
    // 判断还有没有下一页数据
    if(this.QueryParams.pagenum>=this.totalPages){
      // console.log('没了')
      wx.showToast({
        title: '没有下一页数据了',
      });
    }else{
      // console.log('还有')
      this.QueryParams.pagenum++;
      this.getGoodList()
    }
  },

  // 下拉刷新事件
  onPullDownRefresh(){
    // 1 重置数组
    this.setData({
      goodsList:[]
    })
    //  2 重置页码
    this.QueryParams.pagenum = 1;
    // 发送请求
    this.getGoodList()
  }
})