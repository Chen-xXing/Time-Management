// pages/hours/hours.js
var dataUrl = 'http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E061FF02C31F716658E5C81F5594D561F2E88B854E81CAAB7806D5E4F103E55D33C16F3FAC506D1AB172DE8600B37E43FAD&fromtag=46'
var util = require("../../utils/util.js");


var that = this;
//获取应用实例
const app = getApp();



 var finallist=[];

function getRowSche(row){
  console.log("getRowSche()...")
  //初始化列表
  let rowlist = [];
  let Beginid=-1,Finishid=-1;
  const app0=getApp();
  // console.log(app0.todolist.length);

  //遍历列表，写入rowList
  for (let i in app0.todolist) {
    console.log("in row ",row);
    console.log("beginTime",app0.todolist[i]["beginTime"]);
    console.log("finishTime",app0.todolist[i]["finishTime"]);
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
        endid = "5";
        break;
      case 1:
        firstid = "6";
        endid = "11";
        break;
      case 2:
        firstid = "12";
        endid = "17";
        break;
      case 3:
        firstid = "18";
        endid = "23";
        break;
    }
    let ttt = parseInt(firstid);
    let item = new AgendaSize();
    let position = (Beginid - firstid) / (1000 * 60 * 60 * 24);
    if(position<0)  {
      position=0;
    }
    let size;
    //Finishid
    console.log(firstid,Beginid,Finishid,endid)
    //此行无数据
    if((Finishid<firstid)||(Beginid>endid)){
      size=0;
    }
    //头尾都不超
    else if((firstid<=Beginid)&&(Finishid<=endid)){
      size=Finishid-Beginid;
      console.log("<=", "<=","size=",size);
     }
     //头超尾不超
     else if ((firstid > Beginid && Finishid <= endid)) {
       size=Finishid-firstid;
      console.log(">", "<=", "size=", size);
     }
     //头不超尾超
     else if ((firstid <= Beginid && Finishid > endid) ){
       size=endid-Beginid;
      console.log("<=", ">", "size=", size);
      }
     //头尾都超
     else{
       size=7;
      console.log(">", ">", "size=", size)
      }    
    let color;
    if (app.todolist[i]["done"] == false) {
      color = "#EE82EE";
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
    rowlist.push(item); 
    // console.log(item);     
  }
  // console.log(rowlist);  
  return rowlist;
}

//agenda对象构造函数
function newAgenda() {
  this.startDate = "2018-07-26";
  this.finishDate = "2018-07-26";
  this.color = "rgb(62,168,244)";
  this.name = "have something bug";
}
//这个对象是真正用到前端的事件
function AgendaSize() {
  this.position = 1;
  this.size = 1;
  this.color = 'rgb(62,168,244)';
  this.name = "have something bug";
}

/*
*	这个函数目的是初始化每个页面所有的行，主要通过调用getRowSche也就是上一个函数完成
*/
function loadSche(){
  let dutyList0, dutyList1, dutyList2, dutyList3;

  // let tmp=this.data;   
  // let finallist=that.finallist;
  dutyList0 = getRowSche(0);
  dutyList1 = getRowSche(1);
  dutyList2 = getRowSche(2);
  dutyList3 = getRowSche(3);
  console.log("loadSche()...");
  finallist.push(getRowSche(0));
  finallist.push(getRowSche(1));
  finallist.push(getRowSche(2));
  finallist.push(getRowSche(3));
  console.log("...loadSche()")
  // console.log("temp ",temp);
  //this.setData({finallist});
 // console.log("finallist", this.finallist);
  console.log("qaq", this.data.showAll);
  that.setData({
    ["datasec.dutyList0"]: dutyList0,
    ["datasec.dutyList1"]: dutyList1,
    ["datasec.dutyList2"]: dutyList2,
    ["datasec.dutyList3"]: dutyList3,
  })
  // wx.request({
  //   success: function() {
  //     // this.setData();  // 出错
  //     Console.log("Want to sleep");
  //     that.setData({
  //       ["datasec.dutyList0"]: dutyList0,
  //       ["datasec.dutyList1"]: dutyList1,
  //       ["datasec.dutyList2"]: dutyList2,
  //       ["datasec.dutyList3"]: dutyList3,
  //     });
  //   }
  //   });
}

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
    drawlist: [],
    datalist:[],
    datasec:new datasecf(),
    // finallist : []
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

  },
  powerDrawer: function(){
    // getRowSche(0);
    loadSche();

    // this.setData({
    //   datalist:finallist
    // })
   // console.log("here!!!", this.data.datalist, "here!!!");
   console.log("qaq",this.data.showAll);
   console.log("here!!!",this.data.datasec);
  }

})
