let Vue;
class Store {
  constructor(options) {
    console.log(options.actions);
    // 借助Vue的date响应式数据来实现vuex的响应式state
    //为了不对外暴露Vue实例
    this._vm = new Vue({
      data: {
        $$state: options.state,
      },
    });
    this._mutations = options.mutations;
    this._actions = options.actions;

    // 统一修改this指向
    this.commit = this.commit.bind(this);
    this.dispatch = this.dispatch.bind(this);
  }
  get state() {
    return this._vm._data.$$state;
  }
  set state(e) {
    return console.error("不允许你这样操作！");
  }
  commit(type, payload) {
    const operate = this._mutations[type];
    if (!operate) {
      console.error("没有此方法啊！");
    }
    //commit需要参数为当前实例的state
    operate(this.state, payload);
  }

  dispatch(type, payload) {
    const operate = this._actions[type];
    if (!operate) {
      console.error("没有此方法啊！");
    }
    // dispatch需要的参数为当前实例 使用方法是从this中解构出{commit}
    operate(this, payload);
  }
}

function install(_Vue) {
  Vue = _Vue;
  // 通过混合的方式将实例挂载到Vue实例
  Vue.mixin({
    beforeCreate() {
      // 只有根组件存在这个store
      if (this.$options.store) {
        Vue.prototype.$store = this.$options.store;
      }
    },
  });
}

export default { Store, install };
