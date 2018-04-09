# search

## 组件层次

### 高阶组件 searchHOC

1.  保存 query
2.  取消 blur

### 主组件 search

1.  主要用来展示 hotkey
2.  连接高阶组件和子组件

### 子组件 search-box search-list suggest confirm

1.  search-box 搜索框 双向绑定 input 和 state，将 state 传入父组件(通过高阶组件)
2.  search-list 展示搜索历史。
3.  suggest 展示搜索内容、可以上拉加载更多
4.  confirm 弹出框
