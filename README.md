# notes

日常学习的一些有用小笔记

## 博客
* [剖析Vue原理&实现双向绑定MVVM](https://segmentfault.com/a/1190000006599500)
* [微信小游戏跳一跳Node版本 - 半自动版](https://github.com/DMQ/jumpgame-auto/blob/master/README.md)
* [移动端web app自适应布局探索与总结](http://segmentfault.com/a/1190000003931773)
* [web app遇到的一些坑及小技能（持续更新...）](http://segmentfault.com/a/1190000003932970)
* [css编码规范](http://segmentfault.com/a/1190000003992270)
* [遍历多叉树（递归、非递归广度优先、深度优先）](https://segmentfault.com/a/1190000003004435)

## 网站收录
* [基于webpack的在线调试(vue)工具 -- webpackbin](http://www.webpackbin.com/EJsur-jpl)
* [基于bootstrap的拖拉生成页面工具](https://bootstrapstudio.io/)
* [占位图利器 -- placehold](https://placehold.it/)
* [js编译成app利器 -- fuse](https://www.fusetools.com/); [相关文章](http://www.tuicool.com/articles/NfyuY3i)
* [设置网站图标favico.js](http://lab.ejci.net/favico.js/)
* [短链服务](http://www.ft12.com/)


短链接口（百度api）：
```javascript
$.ajax({
 headers: {
   'apikey': '0bcae0071cafdafadd3a85acd22493af'
 },
 type: 'GET',
 url: '//apis.baidu.com/3023/shorturl/shorten?url_long=' + encodeURIComponent('http://baidu.com')
})
```
