# react-musc

学习 react，将慕课网 vue2.0 的音乐课程改写成 react 的

## 使用的包

1.  `react` 16.3 使用新特性
2.  `react-router-dom` react-routerv4 后分为了 dom 和 native 包，浏览器端只要安装 dom 包就行了.而且在在第一级的 route 组件中，可以直接通过 props 获取方法和 url
3.  `redux`、`react-redux` 控制共享状态
4.  `react-lazyload` 图片懒加载，注意使用的时候最好加上 throttle 配置
5.  `classnames` 功能上和模版字符串差不多
6.  `bebal-plugin-transform-decorators-legacy` js 的 decorator，使用如下所示

```
@connect(state=>state, {set_xxxx})
class componentName extends Compoent {
  ...
}
```

7.  `stylus`、`stylus-loader` css 预编译器，**需要在 webpackdev 中添加 stylus 的 rules**
8.  `create-keyframe-animation` js 方式创建动画
9.  `jsonp`
10. `lyric-parser` 歌词转化
11. `better-scroll` 滚动、轮播
12. `axios` ajax 请求
13. `redux-thunk`和`redux-logger` 前者是`redux`异步请求需要的中间件，后者是 redux 的 logger 日志
14. `react-transition-group` react 动画组件，难用
15. `good-storage` localStorage的存储库


## 痛苦的领悟
如果你不使用框架给予的逻辑区书写，即使hack成功了，也是增加了代码量

## BUG

在使用新特性的时候，出现一个问题

```
@playerHOC
@connect(state=>state)
class player extends Compoent {
  constructor() {
    super()
    this.children = React.createRef()
  }
  show() {
    this.cildren.current.show() // this.playListRef.current.show is not a function
  }
  render() {
    return <Children ref={this.children}>
  }
}

@playerHOC
<!-- @connect(state=>state) --> // 如果注释这个，就能够使用了
class Children extends COmpoent {
  show(){}
  render() {
    return <div></div>
  }
}
```

从 dev tool 中可以看出，在子组件中使用 connect 之后，ref 都变成 connect 了，所以不能在子组件中使用 connect。可以将 action 放到 HOC 中

## 新特性

### forwardRef

当使用了高阶组件，并且在被包裹组件中有子组件，恰好又需要子组件的实例(通过`ref`)来调用子组件的方法，这时候就会发现`ref`获取的`current`是`connect`，也就是说`ref`是无法穿透的

`react 16.3`通过一个想你的 API`React.forwardRef`来解决

```
export const HOC = (WrapperComponent) => {
  // 或者直接在这里 @connect(...)
  class PLayerHOC extends Component {
    render() {
      return <WrapperComponent ref={this.props.forwardedRef} {...this.props}/>
    }
  }
  const ForwardRefCompoent = connect(state=>state, {set_xxxx})(PLayerHOC)
  return React.forwardRef((props, ref) => {
    <ForwardRefCompoent {...props} forwardedRef={ref}/>
  })
}
```

可以看见，React.forwardRef 是一个方法，内部对 ref 进行了注入

### ref

这个使用非常简单

```
class PLayerHOC extends Component {
  constructor(){
    super()
    this.ref = React.createRef()
  }

  render() {
    return <div ref={this.ref}></div>  
  }
}
```

以往的字符串，react 是标记为不安全的，所以现在用这种被称为“0”隐患的方式来创建。函数的方式仍旧保留。

### static getDerivedStateFromProps(nextProps, prevState)

16.3 取消了 willMount、ReceiveProps 和 WillUpdate，另一个用的不多，这个还是非常常用的。在 16.3 中，获取 ajax 数据被要求放在 didMount 中，那么如果子组件的数据是通过父组件 props 传递过来就非常有用

1.  先来看一个父组件到子组件的渲染流程：**不在父组件的 DidMount 周期中使用 ajax 请求**

```
constructor father
App.js:78 ========
App.js:80 getDerivedStateFromProps father
App.js:116 render father
App.js:16 constructor children
App.js:20 getDerivedStateFromProps children
App.js:53 render children
App.js:24 componentDidMount children
App.js:89 componentDidMount father
```

可以看到，(父)cons --> getDerivedState ---> render --->(子)cons --->getDerivedState-->render--->DidMount --->(父)DidMount

**在子组件 render 之后，是从内到外启动 DidMount**

2.  那么来看看在**父组件中的 DidMount 使用 ajax 请求**

```
constructor father
App.js:78 ========
App.js:80 getDerivedStateFromProps father
App.js:116 render father
App.js:16 constructor children
App.js:20 getDerivedStateFromProps children
App.js:53 render children
App.js:24 componentDidMount children
App.js:89 componentDidMount father
App.js:92 ======  // 上面的和刚才一样
App.js:93 shouldComponentUpdate father
App.js:116 render father
App.js:20 getDerivedStateFromProps children
App.js:29 shouldComponentUpdate children
App.js:53 render children
App.js:35 getSnapshotBeforeUpdate children
App.js:98 getSnapshotBeforeUpdate father
App.js:41 componentDidUpdate children
App.js:42 1
App.js:104 componentDidUpdate father
App.js:105 1
```

接上面 (父)should ---> render(父) ---> getDerived(子) ---> should(子) ---> render(子)
---> getSnaps(子) ---> getSnaps(父) ---> DidUpdate(子) ---> DidUpdate(父)

**总结**

1.  `render`之后开始从内到外执行各个 hook
2.  `getDerived`在首次刷新和获取新的`props`才会调用(和官方说的一样)
3.  在`setState`之后，父组件没有调用`getDerived`， 所以`setState`不会触发`getDerived`，(和官方说的一样)
4.  在`setState`之后，`render`是会刷新两次的，用户不可见(和官方说的一样)
5.  所以子组件的`getDerived`是会调用两次的，因此你想在子组件操作`props`设置`state`最好做一次比对

**使用方法**

```
static getDerivedStateFromProps(nextProps, prevState) {
  if(!nextProps.data.length) {
    return {
      XXX: data.map or filter
    }
  }
  return null
}
```

### getSnapshotBeforeUpdate

这个生命周期用的很少，它返回的数据能被`componentDidUpdate`接收到

这个生命周期的 return 直接等于 setState。如果不进行操作就返回 null

## 最重要的生命周期 shouldComponentUpdate(nextProps, nextState)

这个生命周期相对于 vue 的`watch`，就是实时关注数据的变化，

1.  使用 immutable：很重要，如果是较深数据这个就很有用
2.  不建议在使用的调用方法，或者判断中直接返回`true`，一般返回 false，在方法以后 return ture 那样一次性更新。如果都返回 true，在最后返回`false`反而会导致卡顿




