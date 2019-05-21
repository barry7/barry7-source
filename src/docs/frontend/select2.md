# Element中select自定义过滤属性
 
## 引言
上篇文章我自己实现了一个“更高效率”的select自定义过滤函数，
后来我又有了另外一个想法：
既然原生option是通过`this.visible = new RegExp(escapeRegexpString(query), 'i').test(this.currentLabel) || this.created;`
来控制显示隐藏的，那么为什么我不可以把`option`整个对象传进来，
通过遍历所有属性，最后得到是否显示的boolean呢？


## 实现 
既然要传入item，那么就需要在`options.vue`中的`props`定义
item,
```javascript
props: {
  item: Object
}
```
然后修改一下`queryChange()`
```javascript
queryChange(query) {
  let regexp = new RegExp(escapeRegexpString(query), 'i');
  let tmpVisible = false;
  Object.keys(this.item).forEach(k => {
    tmpVisible = tmpVisible || (regexp.test(this.item[k]) || this.created);
  });
  this.visible = tmpVisible;
  // this.visible = new RegExp(escapeRegexpString(query), 'i')
  //   .test(this.currentLabel) || this.created;
  if (!this.visible) {
    this.select.filteredOptionsCount--;
  }
}
```
看下代码，首先定义一个正则表达式（其实就是注释部分的正则）和
一个用于暂存的临时变量`tmpVisible`，通过遍历`this.item`的所有属性
查找是否匹配`query`，最后把临时变量赋给`this.visible`，其他操作和
官方原版一致。  
接下来只需要把`item`传入`option`即可。
```html
<el-select filterable v-model="value" placeholder="请选择">
  <el-option
    v-for="item in options"
    :item="item"
    :key="item.value"
    :label="item.label"
    :value="item.value">
  </el-option>
</el-select>
```
数据格式如下：
```javascript
options: [{
  value: '选项1',
  label: '黄金糕'
}, {
  value: '选项2',
  label: '双皮奶'
}, {
  value: '选项3',
  label: '蚵仔煎'
}, {
  value: '选项4',
  label: '龙须面'
}, {
  value: '选项5',
  label: '北京烤鸭'
}]
```
## 效果

<div align="center">
<img src="./assets/select2.gif">  
</div>
的确实现了“根据用户输入，遍历数据的所有属性，返回结果”
的功能。


## 更进一步

那么我们再加一个需求，我想自定义哪些属性需要遍历，怎么样？  
比如我们有一个员工列表，数据格式如下：
```javascript
users:[{
    name:'张某',
    id:'1',
    phone:13600000000
},{
    name:'王某',
    id:'2',
    phone:18900000000
},{
    name:'李某',
    id:'3',
    phone:18600000000
}]
```
如果用上面的方法，我们会遍历全部属性，无论用户的输入是匹配了
`name`还是`id`或者是`phone`都会显示。  
假设我只需要匹配`name`和`id`怎么办呢？  
我的想法是传入一个字符串数组，用于标识需要匹配的属性名。
```javascript
queryChange(query) {
  let regexp = new RegExp(escapeRegexpString(query), 'i');
  let tmpVisible = false;
  this.filterProps.forEach(k=>{
    if (this.item[k]) {
      tmpVisible = tmpVisible || (regexp.test(this.item[k]) || this.created);
    }
  });
  this.visible = tmpVisible;
  if (!this.visible) {
    this.select.filteredOptionsCount--;
  }
}
```
其实和上面的逻辑差不多，只是循环的内容不一样了。 
<div align="center">
<img src="./assets/select2_1.gif">  
</div> 

再更进一步：如果用户有需求，就遍历用户规定的属性，
否则就默认遍历全部属性。
```javascript
if (typeof this.filterProps !== 'undefined') {
  this.filterProps.forEach(k=>{
    if (this.item[k]) {
      tmpVisible = tmpVisible || (regexp.test(this.item[k]) || this.created);
    }
  });
} else {
  Object.keys(this.item).forEach(k => {
    tmpVisible = tmpVisible || (regexp.test(this.item[k]) || this.created);
  });
}
```
只要加一个`if...else`判断就可以了。
