// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'],function($httpProvider){
	//修改$http可以使用post方式
$httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

  /**
   * The workhorse; converts an object to x-www-form-urlencoded serialization.
   * @param {Object} obj
   * @return {String}
   */
  var param = function(obj) {
    var query = '', name, value, fullSubName, subName, subValue, innerObj, i;

    for(name in obj) {
      value = obj[name];

      if(value instanceof Array) {
        for(i=0; i<value.length; ++i) {
          subValue = value[i];
          fullSubName = name + '[' + i + ']';
          innerObj = {};
          innerObj[fullSubName] = subValue;
          query += param(innerObj) + '&';
        }
      }
      else if(value instanceof Object) {
        for(subName in value) {
          subValue = value[subName];
          fullSubName = name + '[' + subName + ']';
          innerObj = {};
          innerObj[fullSubName] = subValue;
          query += param(innerObj) + '&';
        }
      }
      else if(value !== undefined && value !== null)
        query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
    }

    return query.length ? query.substr(0, query.length - 1) : query;
  };

  // Override $http service's default transformRequest
  $httpProvider.defaults.transformRequest = [function(data) {
    return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
  }];
 })









.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider) {
	/*用于修改安卓tab居下 （在参数里要加入$ionicConfigProvider）*/
  $ionicConfigProvider.platform.ios.tabs.style('standard');
  $ionicConfigProvider.platform.ios.tabs.position('bottom');
  $ionicConfigProvider.platform.android.tabs.style('standard');
  $ionicConfigProvider.platform.android.tabs.position('standard');

  $ionicConfigProvider.platform.ios.navBar.alignTitle('center');
  $ionicConfigProvider.platform.android.navBar.alignTitle('left');

  $ionicConfigProvider.platform.ios.backButton.previousTitleText('').icon('ion-ios-arrow-thin-left');
  $ionicConfigProvider.platform.android.backButton.previousTitleText('').icon('ion-android-arrow-back');

  $ionicConfigProvider.platform.ios.views.transition('ios');
  $ionicConfigProvider.platform.android.views.transition('android');


  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })
    //轮播
    .state('tab.lunbotu', {
      url: '/lunbotu',

      views: {
        'tab-home': {
          templateUrl: 'templates/tab-lunbotu.html',
          controller: 'lunboCtrl'
        }
      }
    })

//-----首页
  .state('tab.home', {
    url: '/home',

    views: {
      'tab-home': {
        templateUrl: 'templates/tab-home.html',
        controller: 'HomeCtrl'
      }
    }
  })
    //跳转学习页面
    .state('tab.study', {
      url: '/study/:stId',
      cache:'false',//不缓存
      views: {
        'tab-home': {
          templateUrl: 'templates/tab-study.html',
          controller: 'StudyCtrl'
        }
      }
    })

    // 21312313
    .state('tab.lessonlistStudy', {
      url: '/lessonlistStudy/:stId',
      cache:'false',//不缓存
      views: {
        'tab-lessonlist': {
          templateUrl: 'templates/tab-study.html',
          controller: 'StudyCtrl'
        }
      }
    })
    .state('tab.mycourseStudy', {
      url: '/mycourseStudy/:stId',
      cache:'false',//不缓存
      views: {
        'tab-mycourse': {
          templateUrl: 'templates/tab-study.html',
          controller: 'StudyCtrl'
        }
      }
    })
    // qweq
  .state('tab.register', {
      url: '/register',
      views: {
        'tab-personal': {
          templateUrl: 'templates/tab-register.html',
          controller: 'RegisterCtrl'
        }
      }
    })
  .state('tab.information', {
      url: '/information',
      views: {
        'tab-personal': {
          templateUrl: 'templates/tab-information.html',
          controller: 'InformationCtrl'
        }
      }
    })
//-----课程列表

  .state('tab.lessonlist', {
      url: '/lessonlist',
      views: {
        'tab-lessonlist': {
          templateUrl: 'templates/tab-lessonlist.html',
          controller: 'LessonlistCtrl'
        }
      }
    })

//个人中心
     .state('tab.personal', {
      url: '/personal',
      views: {
        'tab-personal': {
          templateUrl: 'templates/tab-personal.html',
          controller: 'PersonalCtrl'
        }
      }
    })
//我的课程
  .state('tab.mycourse', {
    url: '/mycourse',
    views: {
      'tab-mycourse': {
        templateUrl: 'templates/tab-mycourse.html',
        controller: 'MycourseCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/home');

});



