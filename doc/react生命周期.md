# 父子组件生命周期

```
constructor father  
App.js:78 ========
App.js:80 getDerivedStateFromProps father
App.js:113 render father

// 父组件首次渲染
App.js:16 constructor children
App.js:20 getDerivedStateFromProps children
App.js:53 render children
// 子组件首次渲染
App.js:24 componentDidMount children
App.js:86 componentDidMount father
// 官方推荐在这里进行setState，因此传给子组件的props改变导致之后子组件的 getDerivedStateFromProps
// 这里就是首次渲染之后的hook，从外到内
App.js:89 ======
App.js:90 shouldComponentUpdate father
App.js:113 render father
// 父组件没有getDerivedStateFromProps是因为setState并不会触发这个hook

App.js:20 getDerivedStateFromProps children
App.js:29 shouldComponentUpdate children
App.js:53 render children
// 子组件的updating 完全触发了，因为props是改变了
App.js:35 getSnapshotBeforeUpdate children
App.js:95 getSnapshotBeforeUpdate father
App.js:41 componentDidUpdate children
App.js:42 1
App.js:101 componentDidUpdate father
App.js:102 1
// 这两个从內到外依次触发
```

## 注意区别

1.  getDerivedStateFromProps 接收到新的 props 触发
2.  shouldComponentUpdate 接收到新的 props 和 state 触发
