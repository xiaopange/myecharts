#广州交通信息化建设投资营运有限公司官网#
	GCI官网改造 => 一周敏捷开发方案
###主要内容###
- 分离公共组件，节省编写静态文件时间
- less编译，兼容处理，代码压缩
- 精灵图生成

###目录结构###
```
├── resources             静态资源文件
│   ├── css              css目录  
│   ├── fonts            自定义字体文件
│   ├── images           图片资源
│   ├── js               
│   ├── less               
│   └── libs             第三方公用库
│ 
├── template              分块的html模版文件
│   ├── Home             默认模块
│   └── Shared           公共组件模版
└── views                 由template编译后的html类文件
```
