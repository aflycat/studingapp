angular.module('starter.controllers', [])
/*底部tabs隐藏显示的指令*/
  .directive('hideTabs', function($rootScope) {
    return {
      restrict: 'A',
      link: function(scope, element, attributes) {
        scope.$on('$ionicView.beforeEnter', function() {
          $rootScope.hideTabs=attributes.hideTabs;
        });

        scope.$on('$ionicView.beforeLeave', function() {
          $rootScope.hideTabs = false;
        });
      }
    };
  })
    //轮播图
.controller('lunboCtrl', function($scope,$http,$rootScope,locals) {
  $scope.settings = {
    enableFriends: false
  };
  $scope.toIndex=function(){
    locals.set('isload','isload');
    window.location='#/tab/home';
  }

})
//首页
.controller('HomeCtrl', function($scope,$ionicSideMenuDelegate,$rootScope,$http,$ionicSlideBoxDelegate,locals,shareData) {
  if(!(locals.get('isload')=="isload")){
    console.log("首页");
    window.location="#/tab/lunbotu";
  }

  $scope.toStudy=function(stId){

    window.location="#/tab/study/"+stId;
  }
  //传递参数
  $scope.doSearch=function(){
    console.log('传数据')
    if($scope.searchText){
      shareData.set('indexSearchText',$scope.searchText);
      $scope.searchText="";
      window.location="#/tab/lessonlist";
    }
  }
//点击键盘搜索
  $scope.myKeyup=function(e){

    var keycode=window.event?e.keyCode:e.which;
    if(keycode==0||keycode==13){
      // 0表示点击手机go

      $scope.doSearch();
    }
  }


  $http.post($rootScope.URLAdmin+"/Handler/OfflineCourseHandler.ashx?action=indexshow","")
	.success(function(res){
//		猜你喜欢

		$scope.likedata=res.data.chooseList;
//轮播图
		$scope.bannerList=res.data.bannerList
		$ionicSlideBoxDelegate.update();
		$ionicSlideBoxDelegate.$getByHandle("imghandle").update();
		$ionicSlideBoxDelegate.$getByHandle("imghandle").loop("true")

//好评榜
		$scope.goodlist=[
			[res.data.goodList[0],res.data.goodList[1]],
			[res.data.goodList[2],res.data.goodList[3]]
		]


//最新课程
		$scope.newlist=[
			[res.data.newList[0],res.data.newList[1]],
			[res.data.newList[2],res.data.newList[3]]
		]

	})







	$scope.sidetoggle=function(){
		$ionicSideMenuDelegate.toggleLeft()
	}
})
//课程列表
.controller('LessonlistCtrl', function($scope,$http,$rootScope,shareData,$timeout) {
//跳转
  $scope.toStudy=function(stId){
      window.location="#/tab/lessonlistStudy/"+stId;
  }
  //另一种思想将所有传输的变量用全局变量表示
  // 定义加载数据
  $scope.nowPage=0;
  $scope.lists=[];
  $scope.searchText='';
  $scope.CategoryId="";
  $scope.CpriceId="";

  if(shareData.get('indexSearchText')){
    $scope.searchText=shareData.get('indexSearchText');
    shareData.set('indexSearchText',"");
  }
  $scope.goPage=function(pageStart){
    $scope.moredata=false;
    //提交的数据
    console.log('请求数据')
    var myData={
      "searchText":$scope.searchText,
      "CategoryTwo":$scope.CategoryId,
      "CpriceId":$scope.CpriceId,
      "pageStart":pageStart

    };

    $http.post($rootScope.URLAdmin+"/Handler/OfflineCourseHandler.ashx?action=courseshow",myData)
      .success(function(response){
        console.log(response)
        // 一共哟几页

        $scope.totalPage=Math.ceil(response.data.count/response.data.pageSize);
      // 加载本业
      $scope.lists=$scope.lists.concat(response.data.list);
        console.log($scope.lists);
      // 现在是哪一页
      $scope.nowPage=response.data.pageStart;
      if($scope.totalPage>response.data.pageStart){
        $scope.moredata=true;
      };



    })


  }
  //上拉加载更多数据loadMore函数
  $scope.moredata = true;//为true时加载数据
  $scope.loadMore = function() {
    if($scope.moredata){
      console.log("调用了上拉方法")
      $scope.goPage($scope.nowPage+1);
      $scope.$broadcast('scroll.infiniteScrollComplete');
    }
  };
  $scope.loadMore();
  //上拉加载更多事件
  $scope.$on('$stateChangeSuccess', function() {
    $scope.loadMore();
  })
  $scope.pricouSearch=function(searchText,CategotyId,CpriceId){
  console.log(CategotyId)

    $scope.moredata=true;
    $scope.lists=[];
    $scope.searchText=searchText;
    $scope.CategoryId=CategotyId;
    $scope.CpriceId=CpriceId;
    $scope.$broadcast('scroll.infiniteScrollComplete')
    $scope.flag.price=false;
    $scope.flag.lesson=false;
    $scope.lcolor={color:'#333'}
    $scope.pcolor={color:'#333'}
    $scope.loadMore();
  };
  $scope.myKeyup=function(e){

    var keycode=window.event?e.keyCode:e.which;
    if(keycode==0||keycode==13){
      // 0表示点击手机go
      $scope.pricouSearch($scope.searchInputText)
      $scope.searchInputText="";
    }
  }
  ////下拉刷新
  $scope.doRefresh=function(){
    $timeout(function(){
      $scope.pricouSearch("","全部","");
      $scope.$broadcast("scroll.refreshComplete");
    },1000)
  }

  $scope.lcolor={color:'#333'}


  //获取传输数据
 $scope.lessshow=function(){
  	$scope.flag.lesson=!$scope.flag.lesson;
  	$scope.flag.price=false;
   $scope.pcolor={color:'#333'}
   if($scope.flag.lesson==true){
     $scope.lcolor={color:"#3498db"}
   }else{
     $scope.lcolor={color:'#333'}
   }
  };

  $scope.priceshow=function(){
  	$scope.flag.price=!$scope.flag.price;
  	$scope.flag.lesson=false;
    $scope.lcolor={color:'#333'}
    if($scope.flag.price==true){
      $scope.pcolor={color:"#3498db"}
    }else{
      $scope.pcolor={color:'#333'}
    }
  };
   $scope.flag={
    	lesson:false,
    	price:false
   };
   //课程列表页面数据请求
   $http.post($rootScope.URLAdmin+"/Handler/OfflineCourseHandler.ashx?action=getcategory"+"").success(function(res){

   $scope.corseList=res.data;
  })





  $scope.priceSelect=[
   {id:"1",val:'全部'},{id:'2',val:'免费'},{id:'3',val:"收费"}]
})
.controller('RegisterCtrl', function($scope,$rootScope, $stateParams, Chats,$ionicPopup,$http) {
  $scope.chat = Chats.get($stateParams.chatId);
  $scope.olddata={
    userName:'',
		email:'',
		phone:'',
		userPwd:'',
		againPwd:'',
		nickname:'',
		userPic:''
	};
  $scope.register=function(olddata){
  		var email_yz  = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    	var phone_yz = /^1\d{10}$/;
		if(
			!!olddata.userName&&!!olddata.email&&!!olddata.phone&&!!olddata.userPwd&&!!olddata.againPwd
		){
			if(!email_yz.test(olddata.email)){
				$ionicPopup.alert({
					title:'提示信息',
					template:'请输入正确的邮箱'
				})
			}else if(!phone_yz.test(olddata.phone)){
				$ionicPopup.alert({
					title:'提示信息',
					template:'请输入正确手机号'
				})
			}else if(olddata.userPwd!=olddata.againPwd){
				$ionicPopup.alert({
					title:'提示信息',
					template:'两次密码不一致'

				})
			}else{
				var newdata={
					userName:olddata.userName,
					email:olddata.email,
					phone:olddata.phone,
					userPwd:olddata.userPwd,
					againPwd:olddata.againPwd,
					nickname:"",
					userPic:""
				}
			}

		}else{
			$ionicPopup.alert({
				title:'提示信息',
				template:'请输入内容'
			})


		}

		$http.post($rootScope.URLAdmin+"/Handler/UserHandler.ashx?action=add",newdata)
		.success(function(res){
			if(res.err){
				$ionicPopup.alert({
					title:'提示信息',
					template:'注册失败'
				})
			}else{
				$ionicPopup.alert({
					title:'提示信息',
					template:'注册成功'
				})
				window.location="#/tab/information"
			}
		})




  }

})
//个人中心
.controller('PersonalCtrl', function($scope, $stateParams, Chats,$http,$rootScope) {
  $scope.chat = Chats.get($stateParams.chatId);
  //防止调试的时候tabs隐藏
  $rootScope.hideTabs=false;
  // 判断是否登录
$http.post($rootScope.URLAdmin+"/Handler/UserHandler.ashx?action=isLogin")
  .success(function(res){
    if(!res.err){
      window.location="#/tab/information";
    }
  });
  $http.get($rootScope.URLAdmin+"/Handler/OnCourseHandler.ashx?action=returnuserinfo","").success(function(res){

    $scope.informdata=res
  })
  //登录方法
  $scope.resData={
    names:'',
    password:''
  }
  $scope.login=function(resData){
    if(!!resData.names&&!!resData.password){
      var data={
        userName:resData.names,
        userPwd:resData.password

      }
      $http.post($rootScope.URLAdmin+"/Handler/UserHandler.ashx?action=login",data)
        .success(function (res) {
          console.log(res);
            if(!res.err){
              window.location="#/tab/information";

            }
        })
    }
  };
  //退出登录
  $scope.back=function(){
    $http.post($rootScope.URLAdmin+"/Handler/UserHandler.ashx?action=quit","")
      .success(function(res){
        console.log(res);
        if(!res.err){
          window.location="#/tab/personal"
        }
      })
  }

})
  //学习页面

.controller('InformationCtrl', function($scope, $stateParams, Chats,$rootScope) {
  $scope.chat = Chats.get($stateParams.chatId);


})
  .controller('StudyCtrl', function($scope, $stateParams, Chats,$http,$rootScope,$ionicModal) {
    $scope.chat = Chats.get($stateParams.chatId);
    $ionicModal.fromTemplateUrl('pingjia.html',{
      scope:$scope
    }).then(function(popover){
      $scope.modal=popover
    })

    $scope.showpingjia=function($event){
      $scope.modal.show()
    }
    $scope.closepingjia=function(){
      $scope.modal.hide()
    }
    $scope.setUp=function(){
      // 提交评价的方法
    }
    //判断是否登录
  $http.post($rootScope.URLAdmin+"/Handler/UserHandler.ashx?action=isLogin","")
          .success(function(res){

            if(res.err){
              console.log('未登录')
              $scope.login=true
              $scope.Index=$stateParams.stId
              var data={
                courseId:$scope.Index
              }
              console.log(data.courseId)
              $http.post($rootScope.URLAdmin+"/Handler/OfflineCourseHandler.ashx?action=learnshow",data)
                .success(function(res){
                  $scope.courseData=res.data
                  $scope.pingjia=res.data.evaluate
                  $scope.urls=res.data.CDlist[0].Vlist[0].Vurl
                })
            }else{
              $scope.Index=$stateParams.stId
                var data={
                courseId:$scope.Index
              }
              // 已经登录
              $http.post($rootScope.URLAdmin+"/Handler/OnCourseHandler.ashx?action=learnshow",data)
                .success(function(res){
                  console.log(res)
                  $scope.courseData=res.data
                  $scope.pingjia=res.data.evaluate
                  $scope.urls=res.data.CDlist[0].Vlist[0].Vurl

                })
            }
          });
    //支付方法

    $scope.payGo=function(){
      var charge={"id":"ch_ez9a5O9GSCy5fj5afHTGmvHG","object":"charge","created":1442542657,"livemode":false,"paid":false,"refunded":false,"app":"app_ir1uHKe9aHaL9SWn","channel":"upacp","order_no":"123456789","client_ip":"127.0.0.1","amount":100,"amount_settle":0,"currency":"cny","subject":"Your Subject","body":"Your Body","extra":{},"time_paid":null,"time_expire":1442546257,"time_settle":null,"transaction_no":null,"refunds":{"object":"list","url":"/v1/charges/ch_ez9a5O9GSCy5fj5afHTGmvHG/refunds","has_more":false,"data":[]},"amount_refunded":0,"failure_code":null,"failure_msg":null,"metadata":{},"credential":{"object":"credential","upacp":{"tn":"201509181017374044084","mode":"00"}},"description":null};
      var myID={
        courseId:$stateParams.myId
      };
      //发起模拟支付
      try{
        pingpp.createPayment(charge, function(result){
          //alert('suc: '+result);  //"success"

          //支付成功，请求后台，变更课程为已购买
          $http.post($rootScope.URLAdmin+"/Handler/OnCourseHandler.ashx?action=buy",myID)
            .success(function(response){
              //window.location("#/tab/pay");
              console.log(response);
              $scope.test = "active";
              $scope.goumaiYN = '已购买';
              console.log($scope.video_buy);
              $scope.shadow.video_buy=false;  //提示购买的隐藏


            })
        }, function(result){
          alert('err: '+result);  //"fail"|"cancel"|"invalid"
        });
      }
      catch(e){
        alert(e);
        //如果报错，说明是在浏览器浏览的，也请求后台，变更课程为已购买
        $http.post($rootScope.URLAdmin+"/Handler/OnCourseHandler.ashx?action=buy",myID)
          .success(function(response){
            //window.location("#/tab/pay");
            console.log(response);
            $scope.test = "active";
            $scope.goumaiYN = '已购买';
            console.log($scope.video_buy);
            $scope.shadow.video_buy=false;  //提示购买的隐藏
          })
      }
    }



    $scope.video_buy=false;
    $scope.changeVideo=function(url,id){
        try{
          window.plugins.html5Video.initialize({
            "videol":$rootScope.URLAdmin+url
          })
          $scope.pcTrue=false;
          if($scope.login==false&&$scope.video_buy==false){
            window.plugins.html5Video.play( "videol");
          }
        }  catch(e){
          $scope.pcTrue=true;
          $scope.Vurl=$rootScope.URLAdmin+url
        }

      //   for(var i=0;i++;i<$scope.CDlist.length;i++){
      //     for(var j=0;j<$scope.CDlist[i].Vlist.length;j++){
      //       if($scope.CDlist[i].Vlist[j].ID==id){
      //         $scope.CDlist[i].Vlist[j].isViewing=true
      //       }else{
      //         $scope.CDlist[i].Vlist[j].isViewing=false
      //       }
      //     }
      // }


    }
  //切换显示；
    $scope.flag={
      showPingjia:false,
      showCourse:true
    }
    $scope.showCourse=function(){
      $scope.flag.showCourse=true;
      $scope.flag.showPingjia=false;
    }
    $scope.showPingjia=function(){
      $scope.flag.showCourse=false;
      $scope.flag.showPingjia=true;
    }


  })
//我的课程
.controller('MycourseCtrl', function($scope,$http,$rootScope) {
  //跳转

  $scope.toStudy=function(stId){

    window.location="#/tab/mycourseStudy/"+stId;
  }
  $scope.settings = {
    enableFriends: true
  };
  $scope.doShare=function(id){
    window.plugins.socialsharing.share("一个很棒的课程",null,null,$rootScope.URLAdmin+"/www/index.html#/tab/lessonlistStudy/"+id)
  }
$scope.choose={
    course:"mycourse",
    collection:"mycollection"
  }

  $scope.myCourselist=function(adress){
    $scope.flag={
      showCourse:"true",
      showCollect:"false"
    }

    if(adress=="mycourse"){
      $scope.flag.showCourse="true";
      $scope.color={color:'#3498db'}
      $scope.flag.showCollect="false"
      $scope.colorc={color:'#333'}
    }else{
      $scope.flag.showCourse="false";
      $scope.color={color:'#333'}
      $scope.flag.showCollect="true"
      $scope.colorc={color:'#3498db'}
    }
    console.log($scope.flag)
     console.log(adress)
    $http.get($rootScope.URLAdmin+"/Handler/OnCourseHandler.ashx?action="+adress ,"")
      .success(function(res){
        console.log(res)
        if(adress=="mycourse"){
           $scope.myCourseData=res.data;
          $scope.myCollection=[];
        }else{
          $scope.myCourseData=[];
          $scope.myCollection=res.data;
        }
      })


  }
  $scope.myCourselist("mycourse");
  //删除方法
  $scope.delete=function(ID){

    var data={
      courseId:ID
    }
    $http.post($rootScope.URLAdmin+"/Handler/OnCourseHandler.ashx?action=deletecollection",data)
      .success(function(res){
        if(!res.err){
          $scope.myCourselist("mycollection");
        }
      })

  }


})
