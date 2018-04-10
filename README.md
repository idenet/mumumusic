# react-musc

学习 react，将慕课网 vue2.0 的音乐课程改写成 react 的

## 运行

```
git clone git@github.com:idenet/react-music.git

cd ./music-list

npm i

npm start
```

**注意如果获取不到 song 的播放 url 是会直接报错的，这里的逻辑我没有改，也没有 catch**

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
15. `good-storage` localStorage 的存储库

## 开发总结

1.  最好在 react 给予的样板逻辑中区书写代码，官方推荐的总是有理由的，自己乱搞反而出 bug(多么痛的领悟)
2.  动画
    1.  和 vue 自带不同，react 需要加载第三方库，而且使用`classNames`(css3 动画)，`exit`是没有效果的需要使用动画钩子`onExit`和`onExited`去 hack，或者直接在回调中写吧
    2.  react 中使用三目运算符来展示 dom 和不展示(类比 vue 中的`v-if`)，那么不知道为啥就会覆盖动画的效果。你需要换成`display`(即 vue 中的`v-show`)
    3.  就大多数来说，三目应该优先于`display`，特别是在使用`better-scroll`的时候(性能？)
3.  状态管理
    1.  这里参考了良知的代码，除了样板代码比较多，书写的很好。分的很清楚
    2.  `action-creator`中只写单个的逻辑即(`{type: XXX, payload:xx}`)
    3.  `action`中写`action-creator`的集合(多个操作)，或者有副作用的(例如 localstorage 和异步)
    4.  `state`中只写一个单一树
    5.  `reducer`将单一树拆分为一个个子集(对应模块)
    6.  所以说实在的其实和`vuex`差不多，知识`vuex`没有`reducer`，增加了`getter`
4.  watch：shouldComponentUpdate
    1.  写到这里我才明白，`immutable`对于 react 是有多重要。和 vue 的`watch`自动观测不同，react 需要自己来判断什么时候应该实时执行这个逻辑。
    2.  除了需要实时执行的代码，一般需要进行数据比对，js 的比对是浅比对，对于较深的数据，`immutable`的作用就很大
    3.  **注意** :千万不要每次一个逻辑就返回 true，在执行方法的时候，执行完都应该返回 false，在生命周期的最后去返回 true，让他去统一刷新
5.  子父组件通信
    1.  props 两者来回都一样。vue 中有 emit 和 on 就比较好理解，虽然 react 写起来也是方便的
6.  mixin
    1.  react 实现的方式是高阶组件，将相同代码抽到高阶组件中
    2.  这里需要注意的是，如果高阶组件的子组件需要它的子组件的 ref，需要使用新特性`forwardRef`(可以拉到后面看)
7.  函数式组件(pure)
    1.  这里引出一个 react 的概念，`smart`组件和`dumb`组件。
    2.  一个项目中应该大多数是`dumb`组件，`dumb`组件只负责渲染数据，那么关于数据的调试就不需要关心他
    3.  除非这个组件真的组负责渲染数据(比如 song-list)，那么刚开始不应该先思考它是不是`pure`，而是当作`smart`去编写。
    4.  函数式组件是非常好的，既清晰又易于编写
8.  `setState`
    1.  首先，它是请求，不要当他是一个同步的命令，一半来说，`setState`的状态在`render`中才会取到
    2.  多次`setState`会合并成一次，所以如果你需要多次，选择传入一个函数更好(建议以后都使用函数)
    3.  它还接收一个回调，这个回调会在 render 之后执行，也可以在`didUpdate`中获取

## 感想

1.  写 react 确实有助于对 vue 的理解，vue 的某些方法，确实把 react 的写法简化了(书写形式上)
2.  `pure`形式的组件，写法上很简单，但给我传递了一种如何更好的去优化组件的理念
3.  react 非常自由，正因为太自由了反而比较难。所以 vue 是真的好啊 😊

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
