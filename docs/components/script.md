## JS工具库

### ccActEnv

WEB活动项目中用于判断CC环境

```js
//判断当前环境是否为正式服
exports.isRelease = (window.location.hostname === 'cc.163.com');

//判断是否在PC客户端的房间的浏览器
exports.isInGameRoom4PC = !!(typeof external !== 'undefined' && external.ICC_WebkitVersion);
exports.isInMicRoom4PC = !!(typeof external !== 'undefined' && external.ICC_WebkitVersion);
exports.isInMobileRoom4PC = !!(typeof external !== 'undefined' && external.ICC_ShowMobileUserInfoTip);

//判断是否在手机客户端中打开的页面
exports.isInIOS
exports.isInAndroid
```

<p class="tip">
  注意：从客户端打开的页面会加上 'm_from=android/m_from=ios' 参数，但在页面自已内跳转到其它的页面时没有
</p>


---

### toUserPhotoUrl

根据purl, ptype来获取用户头像的url

* ` purl ` [string] 默认 = ` '22' `
* ` ptype `  [Integer] 默认 = ` 0 `

```js
var toUserPhotoUrl = require('toUserPhotoUrl');

toUserPhotoUrl(22, 0);
```

---

### classNames

详细文档见 [classNames](https://github.com/JedWatson/classnames)

```js
classNames('foo', 'bar'); // => 'foo bar'
classNames('foo', { bar: true }); // => 'foo bar'
classNames({ 'foo-bar': true }); // => 'foo-bar'
classNames({ 'foo-bar': false }); // => ''
classNames({ foo: true }, { bar: true }); // => 'foo bar'
classNames({ foo: true, bar: true }); // => 'foo bar'

// lots of arguments of various types
classNames('foo', { bar: true, duck: false }, 'baz', { quux: true }); // => 'foo bar baz quux'

// other falsy values are just ignored
classNames(null, false, 'bar', undefined, 0, 1, { baz: null }, ''); // => 'bar 1'
```

---

### querystring 

解析的 URL 查询字符串

querystring.parse(str[, sep[, eq[, options]]])

* `str` [String] 要解析的 URL 查询字符串。 

* `sep` [String] 用于界定查询字符串中的键值对的子字符串。默认为 `'&'`。

* `eq` [String] 用于界定查询字符串中的键与值的子字符串。默认为 `'='`。

* `options` [Object] 

    * maxKeys [Number] 指定要解析的键的最大数量。默认为 `1000`。指定为 `0` 则移除键数的限制。

例子，查询字符串 `'foo=bar&abc=xyz&abc=123'` 被解析成：

```javascript
{foo: 'bar',abc: ['xyz', '123']}
```

```javascript
//也可以解析链接上的参数
querystring.parse(location.search.substr(1))
```

---

### pad

数字字符串补0

* `str` [String/Number] 要进行补位的字符串/数字。 

* `n` [Number] 补位之后的长度。

```javascript
//也可以解析链接上的参数
pad(1, 3); //001
```

---

### weinreClient

将 `weinreClient` 引入进你的代码中，它会在页面的左上角创建一个 `10px*10px` 可点击的透明小按钮，点击后让会加载 `weinre` 的对应host的js

weinreClient.init(host)

```javascript
require('weinreClient').init('http://10.255.204.197:8020');
```

---

### ccapiPcShiv

使 `ccapi` 可以运行在PC客户端，对 `ccapi` 中的一些方法进行兼容

```javascript
//直接引用却可
require('ccapiPcShiv'); 
```

<p class="tip">
  目前只测试了在手机直播的房间有效，其它的还没有测试过
</p>

---

### keysPrevented

在PC客户端中使用，用于禁按钮事件

```javascript
//直接引用却可
require('keysPrevented'); 
```

* `oncontextmenu` 在正式环境下（`ccActEnv.isRelease==true`），禁止左键菜单

* `ondragstart` 禁止拖拽事件（如果没有禁止，PC客户端中图片会被拖拽）

* `ondragstart` 禁止复制到剪贴板事件

* `onkeypress/onkeydown` 禁止后退等其它按键事件

---

### domUtils

HTML DOM 操作的工具方法

domUtils.contains(container, contained)

判断 container 是否包含 contained

* `container` [Element] The DOM element that may contain the other element. 

* `contained` [Element] The DOM element that may be contained by (a descendant of) the other element

```javascript
domUtils.contains( document.documentElement, document.body ); // true
domUtils.contains( document.body, document.documentElement ); // false
```