# 超大列表性能优化

## 引言

前两天，在项目中，遇到一个需求：
需要一个下拉框组件实现搜索功能，
乍一看需求很容易，使用element也有现成的组件，
很快就做出了第一版：
```html
<el-select filterable
    multiple
    clearable
    placeholder="placeholder"
    v-model="selected"
    @change="handleChange"
    :filter-method="filterFunc">
    <el-option v-for="(item, index) in selectedUser"
        key="index"
        :label="item.name"
        :value="item.id"></el-option>
</el-select>
```
```javascript
data(){
    return{
        allUser:Array,
        selectedUser:Array
    }
},
methods{
    filterUser (query) {
      if (query) {
        this.selectedUser = this.allUser.filter(item => {
          return (
            (item.id && item.id.indexOf(query.toLowerCase()) > -1) ||
            (item.name && item.name.indexOf(query.toLowerCase()) > -1)
          )
        })
      } else {
        this.selectedUser = this.allUser
      }
    }
}
```
想法很简单，就是根据输入的query，查找user的id或者name，满足的推入selectedUser，
然后option中通过v-for渲染，如果query为空，那么直接v-for所有用户。
  
## 问题
很快问题来了，allUser是一个长度几千的大数组，并且用户数还在不断增加，
当我搜索的时候已经出现卡顿了。  

## 想法
第一个想法就是防抖和节流，短时间内尽量不要多次触发方法，减轻负担。
尝试之后，并没有改变现状。  
通过Chrome性能分析，发现可能是由于selectedUser的变化，导致reflow
的发生。  

## 尝试

通过查阅博客，了解到有一种叫虚拟列表的方法，大意就是：只渲染视图内的列表项。
（当然，为了体验更好，可以多渲染一些，防止滚动过快来不及实时加载）
由于使用了框架，有诸多限制，所以尝试解决的时候我使用了空白的VUE模板。

代码如下：分为三层  
1. 最外层container容器，用于触发滚动事件；
2. 中间层list-container用于包裹列表项，需要调整margin的也是他；
3. 内层item，也就是真正的内容。
  
其中：最外层容器必须指定高度才能触发scroll、
中间层需要指定margin-top、margin-bottom来撑开容器，
根据滚动位置实时改变margin造成“没有滚动”的假象，
内层需要根据滚动位置刷新数据。
```html
<div class="container" @scroll="handleScroll">
  <div class="list-container" :style="{marginTop:mtop,marginBottom:mbot}">
    <div class="item" :key="item.name" v-for="item in visibleList">
      {{item.name}}
    </div>
  </div>
</div>
```  
```css
.container {
    height: 500px;
    overflow-x: scroll;
}

.item {
    border: 1px solid black;
    height: 100px
}
```
```javascript
let list = []
let height = 100
let scrolled = 0
for (let i = 0; i < 10000; i++) {
  list.push({name: '第' + i + '个item', key: i})
}
export default {
  name: 'VirtualList',
  data () {
    return {
      list: [],
      startIndex: 0,
      endIndex: 10
    }
  },
  computed: {
    mtop: function () {
      // return 0
      return height * this.startIndex + 'px'
    },
    mbot: function () {
      // return 0
      return (this.list.length - this.endIndex) * height + 'px'
    },
    visibleList: function () {
      return this.list.slice(this.startIndex, this.endIndex)
    }
  },
  methods: {
    handleScroll () {
      let scrolledpx = this.$el.scrollTop
      let scrolledItem = Math.floor(scrolledpx / height)
      console.log('scroll', scrolledpx, scrolledItem)
      if (scrolled !== scrolledItem) {
        let sub = scrolledItem - scrolled
        this.startIndex += sub
        this.endIndex += sub
        scrolled = scrolledItem
      }
    }
  },
  mounted () {
    this.list = list
  }
}
```
我们先看js代码，
首先定义一个长度1000的列表，
在mounted中赋值给list；  
- data中：startIndex和endIndex用于表示需要渲染的
**item**范围。  
- 几个计算属性：mtop、mbot分别为margin-top和margin-bottom，
需要根据index计算得出；  
visibleList是可见item的列表，也是上面v-for的数据来源。  
- methods中：handleScroll是在container滚动时触发，
需要获取scrollTop来计算已经滚动了多少个item，然后根据
是否不等于外部暂存变量来判断是否需要更新index。  
  
## 结果
GIF。
