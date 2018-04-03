# music-list 动画

1.  实现上滑到标题处暂停

因为获取了 bs 的`scrolly`，然后通过`Math.max(this.minTranslateY, scrolly)`当滑动到，`this.minTranslateY`的时候，停止滑动

2.  当`scrolly`大于 0 的时候：下拉

```
scale = 1 + percent // 拉伸
zIndex = 10 // index的值
```

设置 scale 拉伸的程度

```
this.bgImage.current.style.paddingTop = '70%'
this.bgImage.current.style.height = 0
this.playBtn.current.style.display = ''
```

这里主要是还原上滑时候更改的代码

3.  当`scrolly`小于 0

```
this.bgImage.current.style[transform] = `scale(${scale})`
this.bgImage.current.style.zIndex = zIndex
```

这是所有情况都要运行的代码，设置背景的拉伸比，并且可以覆盖拉伸的后的区域
