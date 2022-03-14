# max-length

<!-- Badge -->
![gitHub tag badge](https://img.shields.io/github/v/tag/Gavin-yh/max-length)
![gitHub release badge](https://img.shields.io/github/v/release/Gavin-yh/max-length)
![npm badge](https://img.shields.io/npm/v/maxlength)
![gitHub repo size badge](https://img.shields.io/github/repo-size/Gavin-yh/max-length)
![jest badge badge](https://img.shields.io/badge/unit%20test-jest-yellowgreen)

<br />

<p align="center">
  <h3 align="center">max-length</h3>

  <p align="center">
    针对contenteditable实现的输入框，限制其输入长度。
    <br />
    <a href="https://gavin-yh.github.io/max-length/"><strong>在线例子</strong></a>
    <br />
  </p>
</p>


##  介绍

contenteditable可编辑容器的内容长度限制。一般利用contenteditable实现的可以输入区域，很难做到限制其输入的长度。这个库处理了英文输入、输入法输入、复制粘贴等情况，限制其内容的长度。


## maxlength API
需要传入一个options配置项

maxlength(options)

```js
maxlength({
  dom: '', // 必填属性，原生dom
  maxLength: 0, // 必填属性，如果没填，限制不生效
})
```


## 安装和使用
### CDN
```js
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/maxlength@latest/dist/index.min.js"></script>

<script>
  const editor = document.getElementById('editor')

  maxLength({
    dom: editor,
    maxLength: 10
  }
</script>
```
### NPM
安装maxlength
```base
npm i maxlength --save
```

### 使用
引入包，使用包
```js
import maxLength from 'maxlength'
// 获取设置了contenteditable属性的dom
const editor = document.getElementById('editor')

maxLength({
  dom: editor,
  maxLength: 10
}
```

html结构
```html
<div>
  <h1>max-length</h1>
  <hr />
  <p>contenteditable可编辑容器的内容最大长度限制</p>

  <div id="editor" contenteditable>
  </div>
</div>
```