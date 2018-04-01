
var gulp = require('gulp'); //本地安装gulp所用到的地方
var less = require('gulp-less'); //less编译
var webserver = require('gulp-webserver'); //静态服务(其他选择gulp-connect或livereload)
// var connect = require('gulp-connect');
var concat = require('gulp-concat');  //文件合并
var rename = require('gulp-rename'); //文件重命名
var replace = require('gulp-replace');//文件正则替换
var autoprefixer = require('gulp-autoprefixer');//自动处理css浏览器前缀

var uglify = require('gulp-uglify'); //js压缩
var minifyCss = require("gulp-minify-css"); //css压缩
var minifyHtml = require("gulp-minify-html"); //html压缩

var spritesmith = require('gulp.spritesmith'); //精灵图合成
//gulp-file-include 引入公用模块文件
var fileinclude = require('gulp-file-include');
var basedir='';

//国内建议cnpm：(npmjs.org镜像)，命令：npm install cnpm -g --registry=https://registry.npm.taobao.org

// 文件include
gulp.task('fileinclude', function() {
  gulp.src([basedir+'template/Home/*.html'])
    .pipe(fileinclude({
      prefix: '@@',
      basepath: basedir+'template/Shared/'
    }))
    .pipe(gulp.dest(basedir+'views/Home'));
});
//定义默认任务
gulp.task('default',['fileinclude','server','watch'],function(){
	console.info("gulp 已经运行！");
});
var url = require('url');
var fs = require('fs');
var path = require('path');
//web服务
gulp.task('server',function(){
/* 	connect.server({
		port: 8002,
		root: '', //项目的根目录
		livereload: true,  //实现自动刷新
		directoryListing: true,  //目录列表显示
		open: true,               //打开浏览器
		fallback: 'index.html'    //默认打开文件
	}); */

	gulp.src(basedir).pipe(webserver({
		port:9988,
		path:'',
		livereload: true,         //自动刷新
		directoryListing: true,  //目录列表显示
		open: true,               //打开浏览器
		fallback: 'index.html'    //默认打开文件
	}));
});
// 自动监听任务
gulp.task('watch', function() {
	gulp.watch(basedir + 'template/*/*.html',['fileinclude']);
	gulp.watch(basedir + 'resources/css/*.css');
	gulp.watch(basedir + 'resources/less/*.less',['less']);
	gulp.watch(basedir + 'resources/js/*.js');
});

//编译Less
gulp.task('less', function () {
	gulp.src(basedir+'resources/less/gci.less') //该任务针对的文件
		.pipe(less({
			compress:true
		})) //该任务调用的模块
		.pipe(autoprefixer({
			browsers: ['> 5%', 'Android >= 4.0'], // > 5%: 全球统计有超过5%的使用率
			cascade: true, //是否美化属性值 默认：true 像这样：
			//-webkit-transform: rotate(45deg);
			//        transform: rotate(45deg);
			remove:true //是否去掉不必要的前缀 默认：true
		}))
		.pipe(minifyCss())
		.pipe(rename('gci.min.css'))
		.pipe(gulp.dest(basedir+'resources/css/'));//将会在resources/css下生成gci.min.css
});

//当图片名以-hover结尾时，自动生成:hover伪类样式
function hoverClass(name){
	return /-hover$/.test(name)?name.replace(/-hover$/,':hover'):name;
}
gulp.task('sprite', function () {
	var spriteData = gulp.src(basedir+'resources/images/sprite/*.png').pipe(spritesmith({
		imgName: 'sprite.png',//保存合并后图片的地址
		cssName: 'sprite.css',//保存合并后对于css样式的地址，可输出SASS,Stylus,LESS,JSON等格式
		padding:5,//合并时两个图片的间距
		algorithm: 'binary-tree',//排列规则有：top-down、left-right、diagonal、alt-diagonal、binary-tree
		//cssTemplate:'sprite-temp.css'//精灵图样式模版地址，内置默认模版如下：
		// {{#sprites}}
		//     .icon-{{name}}{
		//         background-image: url("{{escaped_image}}");
		//         background-position: {{px.offset_x}} {{px.offset_y}};
		//         width: {{px.width}};
		//         height: {{px.height}};
		//     }
		// {{/sprites}}
		// 函数定义模版
		cssTemplate: function (data) {
			var arr=[];
			var base_url='../images/';
			data.sprites.forEach(function (sprite) {
				arr.push('.sprite-'+hoverClass(sprite.name)+
					'{\n' +
					'background-image: url("'+base_url+sprite.escaped_image+'");\n'+
					'background-position: '+sprite.px.offset_x+' '+sprite.px.offset_y+';\n'+
					'width:'+sprite.px.width+';\n'+
					'height:'+sprite.px.height+';\n'+
					'}\n');
			});
			return arr.join('');
		}
	}));
	spriteData.img.pipe(gulp.dest(basedir+'resources/images/'));
	spriteData.css.pipe(gulp.dest(basedir+'resources/css/'));
});

gulp.task('minify-js', function() {
	gulp.src(basedir+'resources/js/*.js')
		//.pipe(concat('all.js'))
		.pipe(gulp.dest(basedir+'dist/js'))
		//.pipe(rename('all.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest(basedir+'dist/js'));
});

