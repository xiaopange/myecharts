//扩展JS自带的Date,增加格式化 fmt="yyyy-MM-dd HH:mm:ss"
Date.prototype.format=function(fmt) {
	var o = {
		"M+" : this.getMonth()+1, //月份
		"d+" : this.getDate(), //日
		"h+" : this.getHours()%12 == 0 ? 12 : this.getHours()%12, //12小时制
		"H+" : this.getHours(), //24小时制
		"m+" : this.getMinutes(), //分
		"s+" : this.getSeconds(), //秒
		"q+" : Math.floor((this.getMonth()+3)/3), //季度
		"S" : this.getMilliseconds() //毫秒
	};
	var week = {
		"0" : "\u65e5",
		"1" : "\u4e00",
		"2" : "\u4e8c",
		"3" : "\u4e09",
		"4" : "\u56db",
		"5" : "\u4e94",
		"6" : "\u516d"
	};
	if(/(y+)/.test(fmt)){
		fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
	}
	if(/(E+)/.test(fmt)){
		fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "\u661f\u671f" : "\u5468") : "")+week[this.getDay()+""]);
	}
	for(var k in o){
		if(new RegExp("("+ k +")").test(fmt)){
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
		}
	}
	return fmt;
};
//定义common全局通用方法
var common = (function() {
	function isString(string) {
		return typeof string === 'string'
	}
	function isArray(obj) {
		return Array.isArray(obj)
	}
	function isFunction(obj) {
		return typeof obj === 'function'
	}
	function isPlainObject(obj) {
		var key;
		var hasOwn = ({}).hasOwnProperty;
		if (typeof obj !== "object" || obj.nodeType || (obj != null && obj === obj.window)) {
			return false;
		}
		if (obj.constructor && !hasOwn.call(obj, "constructor") && !hasOwn.call(obj.constructor.prototype || {}, "isPrototypeOf")) {
			return false;
		}
		for (key in obj) {
		}

		return key === undefined || hasOwn.call(obj, key);
	}
	function extend() {
		var options, name, src, copy, copyIsArray, clone,
			target = arguments[0] || {},
			i = 1,
			length = arguments.length,
			deep = false;
		if (typeof target === "boolean") {
			deep = target;
			target = arguments[i] || {};
			i++;
		}
		if (typeof target !== "object" && !isFunction(target)) {
			target = {};
		}
		if (i === length) {
			target = this;
			i--;
		}
		for (; i < length; i++) {
			if (( options = arguments[i] ) != null) {
				for (name in options) {
					src = target[name];
					copy = options[name];
					if (target === copy) {
						continue;
					}
					if (deep && copy && ( isPlainObject(copy) ||
						( copyIsArray = isArray(copy) ) )) {
						if (copyIsArray) {
							copyIsArray = false;
							clone = src && isArray(src) ? src : [];
						} else {
							clone = src && isPlainObject(src) ? src : {};
						}
						target[name] = extend(deep, clone, copy);
					} else if (copy !== undefined) {
						target[name] = copy;
					}
				}
			}
		}
		return target;
	}
	return {
		extend: extend,//extend(deep, clone, copy)(即$.extend,使之不依赖jQuery)第一个参数设为true(默认false)，开启深拷贝
		isFunction: isFunction,
		isPlainObject: isPlainObject,//判断参数是否通过"{}"或"new Object"创建
		isArray: isArray,
		isString: isString,
		//是否是移动端
		isMobile:function(){
			return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobi/i.test(navigator.userAgent);
		},
		//是否是微信,(还可判断是否存在WeixinJSBridge,需在WeixinJSBridgeReady事件后)
		isWechat:function(){
			return /micromessenger/i.test(navigator.userAgent) || typeof navigator.wxuserAgent !== 'undefined';
		},
		//IP地址
		isIP:function(value){
			return /^(([1-9]|([1-9]\d)|(1\d\d)|(2([0-4]\d|5[0-5])))\.)(([1-9]|([1-9]\d)|(1\d\d)|(2([0-4]\d|5[0-5])))\.){2}([1-9]|([1-9]\d)|(1\d\d)|(2([0-4]\d|5[0-5])))$/.test(value);
		},
		//身份证
		isIdCardNo:function(value){
			var birthday=new Date(value.substr(6,4)+"-"+value.substr(10,2)+"-"+value.substr(12,2)); //不考虑15位身份证，目前有效身份证均为18位
			return /^(\d{6})()?(\d{4})(\d{2})(\d{2})(\d{3})(\w)$/.test(value)&&(birthday<new Date());
		},
		//车牌号
		isPlateNo:function(value){
			return /^[\u4e00-\u9fa5]{1}[A-Z]{1}[A-Z_0-9]{5}$/.test(value);
		},
		//联系手机/电话
		isPhone:function(value){
			var mobile = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
			var tel = /^(\d{3,4}-?)?\d{7,9}$/g;
			return mobile.test(value)||tel.test(value);
		},
		//QQ号码
		isQQ:function(value){
			return /^[1-9]\d{4,10}$/.test(value);
		},
		//字母开头，长度在6-12之间，只能包含字符、数字和下划线的密码,按需修改。
		isPassword:function(value){
			return /^[a-zA-Z]\w{5,12}$/.test(value);
		},
		//一个或多个中文
		isChinese:function(value){
			return /^[\u4e00-\u9fa5]+$/.test(value);
		},
		//网址
		isUrl:function(value){
			return /^(?:ht|f)tp(?:s)?\:\/\/(?:[\w\-\.]+)\.\w+/i.test(value)
		},
		isEmail:function(value){
			return /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test( value );
		},
		//计算字节长度,双字节字符[^\x00-\xff]
		getStrLength:function(value){
			return value.replace(/[^\x00-\xff]/g,"aa").length; //将双字节字符替换为单字节字符
		},
		//阻止右键及复制保存,
		preventCopy:function(selector){
			selector=selector?selector:'body';
			$(selector).on('contextmenu selectstart dragstart',function(e){
				e.preventDefault();
				e.returnValue=false;
			})
		},
		//下载图片,下载完成后进行回调
		loadImage: function (url, callback, data) {
			var img = new Image(); //创建一个Image对象，实现图片的预下载
			img.src = url;
			img.data = data;
			if (img.complete) { // 如果图片已经存在于浏览器缓存，直接调用回调函数
				callback.call(img);
				return; // 直接返回，不用再处理onload事件
			}
			img.onload = function () { //图片下载完毕时异步调用callback函数。
				callback.call(img);//将回调函数的this替换为Image对象
			};
		},
		//图片上传前 js压缩，files：图片input上传对象数组，回调函数返回base64编码数组，scale_base:宽、高最小尺寸,k:压缩系数
		// 去掉base64标记后 src = src.replace(/^data:image\/(png|jpg|jpeg);base64,/, "") 可以用ajax提交到后台，提交后可以直接存byte[] Image
		imgCompress:function(files,callback,kb,scale_base,k){
			kb=kb?kb:300;//当图片大小大于kb时才进行压缩(单位kb)
			scale_base=scale_base?scale_base:1000;//宽、高最小尺寸,默认1000,等比缩放
			k=k?k:0.9;//压缩系数,默认0.9
			var srcs=[];//返回的base64编码数组
			var canvas = document.getElementById('imgCompressCanvas');
			if(!canvas){
				canvas=document.createElement('canvas');
				canvas.id='imgCompressCanvas';
			}			
			var ctx = canvas.getContext('2d');//获取2d编辑容器
			var img_cache=document.createElement("img");
			//var img_cache = new Image();//创建一个图片

			var tmpFile,i=0;
			var compress=function(){
				if(i>=files.length){
					callback(srcs);
					return;
				}
				var reader = new FileReader();
				tmpFile=files[i];
				reader.readAsDataURL(tmpFile);
				reader.onload = function (e) {
					img_cache.src=e.target.result;
					img_cache.onload = function () {
						var m;
						if(tmpFile.size>kb*1024){
							if (img_cache.width>img_cache.height){
								m = img_cache.width / img_cache.height;
								canvas.height =scale_base;
								canvas.width= scale_base*m ;
							}else{
								m = img_cache.height/img_cache.width ;
								canvas.height =scale_base*m;
								canvas.width= scale_base;
							}
						}else{
							canvas.height =img_cache.height;
							canvas.width= img_cache.width;
						}

						ctx.drawImage(img_cache, 0, 0,canvas.width,canvas.height);

						srcs.push(canvas.toDataURL("image/jpeg", k));
						i++;
						compress();
					}
				}
			};
			compress();
		},
		//将毫秒数times转换为-天-时-分-秒
		getTime:function(times){
			var day=times/(1000*3600*24);
			var cache1=times%(1000*3600*24);
			var hour=times/(1000*3600);
			var cache2=cache1%(1000*3600);
			var minute=cache2/(1000*60);
			var cache3=cache2%(1000*60);
			var second=cache3/1000;
			return{
				day:Math.ceil(day),
				hour:parseInt(hour)<10?'0'+parseInt(hour):''+parseInt(hour),
				minute:parseInt(minute)<10?'0'+parseInt(minute):''+parseInt(minute),
				second:parseInt(second)<10?'0'+parseInt(second):''+parseInt(second)
			}
		},
		//获取当前滚动位置,用于跳转到其他页面后在返回时恢复跳转前的状态
		getPageScroll: function () {
			var x = 0, y = 0;
			if (window.pageYOffset) {    // all except IE
				y = window.pageYOffset;
				x = window.pageXOffset;
			} else if (document.documentElement && document.documentElement.scrollTop) {    // IE 6 Strict
				y = document.documentElement.scrollTop;
				x = document.documentElement.scrollLeft;
			} else if (document.body) {    // all other IE
				y = document.body.scrollTop;
				x = document.body.scrollLeft;
			}
			return {x: x, y: y};
		},
		//通过参数名获取url中的参数值,decodeURI转中文,decodeURIComponent转特殊字符
		getUrlParam: function (name) {
			var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
			var r = window.location.search.substr(1).match(reg);
			if (r != null) return decodeURIComponent(decodeURI(r[2]));
			return "";
		},
		//获取参数名获取cookie中的参数值
		getCookie: function (name) {
			var reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
			var r = document.cookie.match(reg);
			if (r != null) return decodeURIComponent(decodeURI(r[2]));
			return "";
		},
		addJsonObject: function (json, key, value, maxNum) {
			if (!maxNum) maxNum = 999999999;
			json = common.delJsonObject(json, key);
			while (Object.getOwnPropertyNames(json).length >= maxNum) {
				for (var i in json) {
					delete json[i];
					break;
				}
			}
			json[key] = value;
			return json;
		},
		delJsonObject: function (json, key) {
			if (json[key]) {
				delete json[key];
			}
			return json;
		},
		addJsonArray: function (json, obj, maxNum) {
			if (!maxNum) maxNum = 999999999;
			json = common.delJsonArray(json, obj);
			while (json.length >= maxNum) {
				json.shift();
			}
			json.push(obj);
			return json;
		},
		delJsonArray: function (json, obj) {
			for (var i in json) {
				if (JSON.stringify(json[i]) == JSON.stringify(obj)) {
					json.splice(i, 1);
					break;
				}
			}
			return json;
		},
		addLocalStorage: function (key, obj, maxNum) {
			var json = common.getLocalStorage(key);
			json = common.addJsonArray(json, obj, maxNum);
			common.setLocalStorage(key, json);
		},
		addLocalStorageObj: function (key, name, value, maxNum) {
			var json = common.getLocalStorageObj(key);
			json = common.addJsonObject(json, name, value, maxNum);
			common.setLocalStorage(key, json);
		},
		setLocalStorage: function (key, json) {
			if (typeof json != "string") {
				json = JSON.stringify(json);
			}
			localStorage.setItem(key, json);
		},
		getLocalStorage: function (key) {
			var json;
			var value = localStorage.getItem(key);
			if (value) {
				try {
					json = JSON.parse(value);
					if (!(json instanceof Array)) {
						json = new Array();
					}
				} catch (e) {
					json = new Array();
				}
			} else {
				json = new Array();
			}
			return json;
		},
		getLocalStorageObj: function (key) {
			var json;
			var value = localStorage.getItem(key);
			if (value) {
				try {
					json = JSON.parse(value);
					if (json instanceof Array) {
						json = json[0] ? json[0] : new Object();
					}
				} catch (e) {
					json = new Object();
				}
			} else {
				json = new Object();
			}
			return json;
		},
		delLocalStorage: function (key, obj) {
			if (obj) {
				var json = common.getLocalStorage(key);
				json = common.delJsonArray(json, obj);
				common.setLocalStorage(key, json);
			} else {
				localStorage.removeItem(key);
			}
		},
		addSessionStorage: function (key, name, value, maxNum) {
			var json = common.getSessionStorage(key);
			json = common.addJsonObject(json, name, value, maxNum);
			common.setSessionStorage(key, json);
		},
		setSessionStorage: function (key, json) {
			if (typeof json != "string") {
				json = JSON.stringify(json);
			}
			sessionStorage.setItem(key, json);
		},
		getSessionStorage: function (key) {
			var json;
			var value = sessionStorage.getItem(key);
			if (value) {
				try {
					json = JSON.parse(value);
					if (json instanceof Array) {
						json = json[0] ? json[0] : new Object();
					}
				} catch (e) {
					json = new Object();
				}
			} else {
				json = new Object();
			}
			return json;
		},
		delSessionStorage: function (key, name) {
			if (name) {
				var json = common.getSessionStorage(key);
				json = common.delJsonObject(json, name);
				common.setSessionStorage(key, json);
			} else {
				sessionStorage.removeItem(key);
			}
		},
		//转意符换成普通字符
		escape2Html: function (str) {
			var arrEntities = {'lt': '<', 'gt': '>', 'nbsp': ' ', 'amp': '&', 'quot': '"'};
			return str.replace(/&(lt|gt|nbsp|amp|quot);/ig, function (all, t) {
				return arrEntities[t];
			});
		},
		// &nbsp;转成空格
		nbsp2Space: function (str) {
			var arrEntities = {'nbsp': ' '};
			return str.replace(/&(nbsp);/ig, function (all, t) {
				return arrEntities[t];
			});
		}
	}
})();

//公共头部初始化
$(function(){
	var $body=$("body"),
		$header=$("#header"),
		$btnTop=$(".btn-fixed.btn-top");
	//滚动回调
	function scrollHandle(){
		var top=$body.scrollTop();
		//console.log(top);
		if(top===0){
			$header.addClass("top");
		}else{
			$header.removeClass("top");
			//滚至顶部按钮浮现
			if(top>600){
				$btnTop.addClass("active");
			}else{
				$btnTop.removeClass("active");
			}
		}
	}
	scrollHandle();//由于浏览器可能会记住滚动状态，必需初始化执行一次
	$(window).on('scroll',scrollHandle); //滚动监听
	//PC切换应用菜单
	$(".m-navs .nav-menu>li").on("mouseover",function(e){
		var $self=$(this);
		//console.log($self.hasClass("active"));
		if(!$self.hasClass("active")){
			var index=$self.data("index");
			$self.closest(".menu-left").find(".nav-menu>li.active").removeClass("active");
			$self.addClass("active");
			$self.closest(".menu-body").find(".menu-product").eq(index).addClass("active").siblings(".active").removeClass("active");
		}
	});
	//下拉按钮点击隐藏
	$(".menu-foot>.iconfont").on("click",function(e){
		var $self=$(this);
		$self.addClass("hide");
		setTimeout(function(){
			$self.removeClass("hide");
		},300)
	});
	//滚至顶部
	$btnTop.on("click",function(){
		$body.animate({
			scrollTop: 0
		}, 200);
	});
	//打开联系按钮
	$(".btn-fixed.btn-link").on("mouseover",function(){
		$(".btn-fixed .link-wrap").addClass("active");
	});
	//关闭联系弹框
	$(".btn-fixed.btn-link .iconfont").on("click",function(e){
		$(".btn-fixed .link-wrap").removeClass("active");
	});
	//切换菜单图片
	$(".header .nav-tabs").on("click",'>li',function(){
		var $self=$(this);
		if(!$self.hasClass("active")){
			var index=$self.data("index");
			$self.addClass("active").siblings(".active").removeClass("active");
			var $target=$self.closest(".nav-tabs").siblings(".tab-content").find(".tab-pane").eq(index);
			$target.addClass("active").siblings(".active").removeClass("active");
		}
	});

	//移动端展开应用菜单
	$(".mobile-navs .navs-list>li").on("click",function(e){
		var $self=$(this);
		$self.toggleClass("active");
		/*if($self.has(".navs-menus")){
			$self.toggleClass("active");
		}*/
	});
	//显示移动端菜单
	$(".header .m-toggle").on("click",function(e){
		$(".mobile-navs").addClass("active");
	});
	//关闭移动端菜单
	$(".mobile-navs .navs-head>.iconfont").on("click",function(e){
		$(".mobile-navs").removeClass("active");
	});
	//来自GCI的问候
	try{
		window.console&&window.console.log&&(console.log("诚邀精英加盟\n"+
			"一起建设信息化大交通！\n"+
			"公司总部地址：广东省广州市天河区体育东路108号创展中心西座1402室\n"),
			console.log("请将简历发送至 %c zhaopin@96900.com.cn（邮件主题格式：姓名+应聘职位）","color:red"),
			console.log("或在前程无忧、智联招聘，搜索\"广州交通信息化建设投资营运有限公司\""))
	} catch (e){
		//alert(e)
	}
});



