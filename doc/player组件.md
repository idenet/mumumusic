# 播放器组件

## 控制

整个播放器通过 state 来控制。

## 动画

mini 播放器的动画，执行速度会比渲染的快。

## 组件功能完善流程

1.  先做动画
2.  使用`shouldComponentUpdate`来观测`currentSong`和`playing`状态。有 song 的时候执行播放。playing 控制暂停和播放
    **注意**这里的并没有进行数据上的比对，粗暴的返回 true 来实时渲染。这么做是不好的。正确的做法是要比对的，但是数据深度比较深。更好的做法是引入`immutable`来进行数据的比对
3.  控制 css，这里可以引入`classnames`包，不过因为有些 css 是可以复用的，那么直接用变量更好
4.  功能区
    1.  前进后退：注意前进后退之后要切换播放状态
    2.  增加标志位，如果 audio 播放器未准备好，则不允许使用功能区
    3.  播放进度条组件，这个组件需要三个状态，进度百分比，改变进度，将改变进度传入 currentTime
        1.  通过获得的 percent，实时修改 btn 的进度
        2.  点击 bar 区域，可以跳转进度
        3.  移动 barbtn 可以跳转进度：同样是已经移过的宽度+move-start 的距离
    4.  mini 播放器的进度条
        1.  简单的使用 svg 来实现，传入 percent 和 radius
    5.  模式切换
        1.  点击模式切换，改变 mode 和 playList 的值，通过改变 state 改变 css
        2.  监听 end 方法，通过模式改变播放顺序或者状态
5.  歌词
    1.  因为 song 是通过类构建的，而类中是有`getLyric`方法，所以只需要`nextSong.getLyric()`就能获取歌词了
    2.  在监听的`currentSong`中调用获取歌词方法，并使用`lyric-parser`
    3.  在使用进度跳转的时候，同时对歌词操作进行跳转
    4.  确保歌词始终在中间
    5.  纯音乐分支
    6.  通过一个标志位来控制歌词的播放，如果歌曲 ready 则设置为 true。(解决歌曲未放歌词先放的问题)
    7.  pause 方法解决网页多个音频的问题
    8.  toggle 的时候 歌词也暂停
6.  实现 cd 和歌词切换的动画
    1.  计算 move 中 x 的距离来实现动画，取消 y 的移动

## playlist

1.  动画
    1.  `react-transition-group`实在是太奇怪了，如果不使自定义动画，必须在下级组件中通过标志位控制，然后`exit`动画中，走到`exit`就已经 none 了，必须先置为 block 再置为 none
2.  功能
    1.  滚动，在 setstate 为 true 的回调中，refresh scroll 组件
    2.  监听 scrollToCrrent，当改变歌曲就滚动到当前歌曲
