// pages/hours/hours.js
var dataUrl = 'http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E061FF02C31F716658E5C81F5594D561F2E88B854E81CAAB7806D5E4F103E55D33C16F3FAC506D1AB172DE8600B37E43FAD&fromtag=46'
var util = require("../../utils/util.js");

//获取应用实例
const app = getApp();



 var finallist=[];





function datasecf(){
  this.dutyList0 = [];
  this.dutyList1 = [];
  this.dutyList2 = [];
  this.dutyList3 = [];
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    showAll: true,
    smallSwitch : false,
    drawlist: [],
    datalist:[],
    datasec:new datasecf(),
    // finallist : []
  //  weeklist: ['一', '二', '三', '四', '五', '六'],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //获取之前保留在缓存里的数据
    wx.getStorage({
      key: 'todolist',
      success: function (res) {
        if (res.data) {
          that.setData({
            todolist: res.data
          })
        }
      }
    })
    //获取用户信息
    app.getUserInfo(function (userInfo) {
      that.setData({
        userInfo: userInfo
      })
    })
    that.data.smallSwitch = false;
    that.loadSche();
    // loadSche.call(that);

    console.log(this.data.datasec)
  },













  getRowSche: function(row){
    console.log("getRowSche()...")
  //初始化列表
  let rowlist = [];
    let Beginid = -1, Finishid=-1;
    const app0 = getApp();
    // console.log(app0.todolist.length);

    //遍历列表，写入rowList
    for(let i in app0.todolist) {
  console.log("in row ", row);
  console.log("beginTime", app0.todolist[i]["beginTime"]);
  console.log("finishTime", app0.todolist[i]["finishTime"]);
  let btmp = app0.todolist[i]["beginTime"];
  let ftmp = app0.todolist[i]["finishTime"];
  let FormbeginTimeArr = btmp.split(":");
  let FormfinishTimeArr = ftmp.split(":");
  Beginid = parseInt(FormbeginTimeArr[0], 10);
  Finishid = parseInt(FormfinishTimeArr[0], 10);
  if (FormbeginTimeArr[1] >= 30) {
    Beginid++;
  }
  if (FormfinishTimeArr[1] >= 30) {
    Finishid++;
  }
  console.log("Beginid ", Beginid, "Finishid ", Finishid);

  //得到该行首尾的数据
  let firstid, endid;
  switch (row) {
    case 0:
      firstid = "0";
      endid = "6";
      break;
    case 1:
      firstid = "6";
      endid = "12";
      break;
    case 2:
      firstid = "12";
      endid = "18";
      break;
    case 3:
      firstid = "18";
      endid = "24";
      break;
  }
  let ttt = parseInt(firstid);
  let item = new this.AgendaSize();
  let position = (Beginid - firstid);
  if (position < 0) {
    position = 0;
  }
  let size;
  //Finishid
  console.log(firstid, Beginid, Finishid, endid)
  //此行无数据
  if ((Finishid < firstid) || (Beginid > endid)) {
    size = 0;
  }
  //头尾都不超
  else if ((firstid <= Beginid) && (Finishid <= endid)) {
    size = Finishid - Beginid;
    console.log("<=", "<=", "size=", size);
  }
  //头超尾不超
  else if ((firstid > Beginid && Finishid <= endid)) {
    size = Finishid - firstid;
    console.log(">", "<=", "size=", size);
  }
  //头不超尾超
  else if ((firstid <= Beginid && Finishid > endid)) {
    size = endid - Beginid;
    console.log("<=", ">", "size=", size);
  }
  //头尾都超
  else {
    size = 6;
    console.log(">", ">", "size=", size)
  }
  let color;
  if (app.todolist[i]["done"] == false) {
    color = 'rgb(125,159,195)';
  } else {
    color = 'rgb(62,168,244)'
  }
  let name = app.todolist[i]["content"];
  item = {
    position: position,
    size: size,
    color: color,
    name: name
  }
  item.flag=true;
  rowlist.push(item);
  // console.log(item);     
}


// var compare = function(prop){
//   return function (obj1, obj2) {
//         var val1 = obj1[prop];
//         var val2 = obj2[prop];
//         if (val1 < val2) {
//             return -1;
//         } else if (val1 > val2) {
//             return 1;
//         } else {
//             return 0;
//         }            
//     } 
//   }
//     rowlist.sort(compare("size"));
//     rowlist.sort(compare("position"));


    /* 
     * height用于css控制，当高度超过四个的时候，把行高度变大
     */
    var rowlistsset=[];
    var height = 0;
    for (var i = 0; i < rowlist.length; i++) {
      let space = rowlist[i].position + rowlist[i].size;
      if (rowlist[i].flag) {
        height++;
        rowlist[i].flag = false;
        rowlistsset.push(rowlist[i]);
        for (var j = i + 1; j < rowlist.length; j++) {
          if (rowlist[j].position >= space && space < 7 && rowlist[j].flag) {
            rowlist[j].space = space;
            rowlist[j].inde = i;
            rowlist[j].position -= space;
            space = rowlist[j].size + rowlist[j].position + space;
            rowlist[j].flag = false;

            rowlistsset.push(rowlist[j]);
          }
        }
        // if (space != 7) {
        //   let bug = new newAgenda();
        //   bug = { name: '', position: 0, size: 7 - space, color: '#fff' };
        //   rowlistsset.push(bug);
        //}
      }
    }



// console.log(rowlistsset);
    return { list: rowlistsset,height:height};
},

//agenda对象构造函数
newAgenda :function () {
  this.startDate = "2018-07-26";
  this.finishDate = "2018-07-26";
  this.color = "rgb(62,168,244)";
  this.name = "have something bug";
},
//这个对象是真正用到前端的事件
AgendaSize :function () {
  this.position = 1;
  this.size = 1;
  this.color = 'rgb(62,168,244)';
  this.name = "have something bug";
} ,









  /*
  *	这个函数目的是初始化每个页面所有的行，主要通过调用getRowSche也就是上一个函数完成
  */
  loadSche:function(){
    let dutyList0, dutyList1, dutyList2, dutyList3;
var self = this;
    // let tmp=this.data;   
    // let finallist=that.finallist;
    dutyList0 = this.getRowSche(0);
    dutyList1 = this.getRowSche(1);
    dutyList2 = this.getRowSche(2);
    dutyList3 = this.getRowSche(3);
    console.log("loadSche()...");
    finallist.push(this.getRowSche(0));
    finallist.push(this.getRowSche(1));
    finallist.push(this.getRowSche(2));
    finallist.push(this.getRowSche(3));
    console.log("...loadSche()")

    self.setData({
      ["datasec.dutyList0"]: dutyList0,
      ["datasec.dutyList1"]: dutyList1,
      ["datasec.dutyList2"]: dutyList2,
      ["datasec.dutyList3"]: dutyList3,
    })

  },

  powerDrawer: function () {
    // getRowSche(0);
    this.loadSche();

    // this.setData({
    //   datalist:finallist
    // })
    // console.log("here!!!", this.data.datalist, "here!!!");
    console.log("qaq", this.data.showAll);
    console.log("here!!!", this.data.datasec);
  },


})
