# Element中select自定义过滤函数 
## 引言

Element中的el-select组件使用非常方便。
```html
<el-select
    filterable
    v-model="value"
    placeholder="请选择">
    <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value">
    </el-option>
</el-select>
```
像这样，就可以实现一个简单的选择器，并且带有输入框可以
根据用户输入过滤选项。
```javascript
export default {
    data() {
      return {
        value: '',
        options:[
          {label:'苹果',key:0},
          {label:'梨子',key:1},
          {label:'菠萝',key:2},
          {label:'香蕉',key:3},
        ]
      };
    }
  };
```  
但是有一个问题，默认的选择器只会根据label过滤内容，
如果我希望根据options中其他属性过滤应该怎么办呢？
  
## 变通方案

网上许多博客给出了一种变通的方案：绑定另一个数组。  
代码如下：
```html
<el-select
    filterable
    :filter-method="filterMethod"
    v-model="value"
    placeholder="请选择">
    <el-option
        v-for="item in otherOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value">
    </el-option>
</el-select>
```
仔细看会发现，这时候v-for中遍历的不是原来的option了，
接着看js代码
```javascript
export default {
  data() {
    return {
      value: '',
      options:[
        {label:'苹果',eng:'pingguo'},
        {label:'梨子',eng:'lizi'},
        {label:'菠萝',eng:'boluo'},
        {label:'香蕉',eng:'xiangjiao'},
      ]
    };
  },
  methods:{
    filterMethod(query){
      if (query) {
        this.otherOptions = this.options.filter(item => {
          return (
            (item.label && item.label.indexOf(query) > -1) ||
            (item.eng && item.eng.indexOf(query) > -1)
          )
        })
      } else {
        this.otherOptions = this.options
      }
    }
  }
};
```
上述代码中，query是输入框中内容。  
这个逻辑也很简单，当输入内容的时候判断是否有过滤条件query，
如果没有那么otherOptions就是所有的options，
如果有，那么对item中label和eng属性做判断，如果符合条件，
则将这个item加入otherOptions。  
GIF
