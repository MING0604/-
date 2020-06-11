/*
1 点击 “+” 触发tap点击事件
  1 调用小程序内置的 选择图片的 api
  2 获取到 图片的路径 数组
  3 把图片路径 存到 data的变量中
  4 页面就可以根据 图片数组 进行循环显示 自定义组件
2 点击 “提交”
  1 获取文本域的内容 类似 输入框的获取
    1 data中定义变量 表示 输入框内容
    2 文本域 绑定 输入事件 事件触发的时候 把输入框的值 存入到变量中
  2 对这些内容 合法性验证
  3 验证通过 用户选择的图片 上传到专门的图片服务器 返回图片外网的链接
    1 遍历图片数组
    2 挨个上传
    3 自己再维护图片数组 存放 图片上传后的外网的链接
  4 文本域 和 外网的图片路径 一起提交到服务器
  5 清空当前页面
  6 返回上一页
*/
Page({
  data:{
    tabs:[
      {
        id:0,
        value:"体验问题",
        isActive:true
      },
      {
        id:1,
        value:"商品、商家投诉",
        isActive:false
      }
    ],
    // 被选中的图片路径 数组
    chooseImgs:[],
    // 文本域的内容
    textVal:""
  },
  // 外网的图片路径数组
  UpLoadImgs:[],
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
  // 点击 “+” 选择图片
  handleChoose(){
    wx.chooseImage({
      // 同时选中的图片数量
      count: 9,
      // 图片格式 原图 压缩
      sizeType: ['original', 'compressed'],
      // 图片来源 相册 照相机
      sourceType: ['album', 'camera'],
      success: (result) => {
        this.setData({
          chooseImgs:[...this.data.chooseImgs,...result.tempFilePaths]
        })
      }
    });
      
  },
  // 删除图片
  handleDelete(e){
    const {index}=e.target.dataset
    
    let [...chooseImgs] = this.data.chooseImgs
    chooseImgs.splice(index,1)
    this.setData({
      chooseImgs
    })
  },
  // 文本域输入事件
  handleTextInput(e){
    this.setData({
      textVal:e.detail.value
    })
  },
  // 提交按钮的点击
  handleFormSubmit(){
    // 1 获取文本域的内容, 图片数组
    const {textVal,chooseImgs}=this.data
    // 2 合法性验证
    if(!textVal.trim()){
      // 不合法
      wx.showToast({
        title: '输入不合法',
        icon: 'none',
        mask: false
      });
      return
    }
    // 3 准备上传图片 到专门的服务器
    // 上传文件的api 不支持 多个文件同时上传 遍历数组 挨个上传
    // 显示正在等待的图标
    wx.showLoading({
      title: "正在上传",
      mask: true
    });
    // 判断有没有需要上传的图片数组
    if(chooseImgs.length!=0){
      chooseImgs.forEach((v,i) => {
        wx.uploadFile({
            // 上传到哪里
            url: 'https://images.ac.cn/Home/Index/UploadAction/',
            // 被上传的文件路径
            filePath: v,
            // 被上传的文件名称 后台来获取文件 file
            name: "file",
            // 顺带的文本信息
            formData: {},
            success: (result) => {
              if(i===chooseImgs.length-1){
                wx.hideLoading();
                wx.navigateBack({
                  delta: 1
                });
              }
            }
          });
      });
    }else{
      wx.hideLoading();
      wx.navigateBack({
        delta: 1
      });  
    }
    
      
  }
})