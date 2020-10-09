let Vue;
class Store {
  constructor(options) {
      console.log(options.actions)
    // this.options = options;
    // 借助Vue的date响应式数据来实现vuex的响应式state
    this._vm = new Vue({
      data: {
        $$state: options.state,
      },
    });
    this._mutations = options.mutations;
    this._actions = options.actions;

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
    operate(this.state, payload);
  }

  dispatch(type, payload) {
    const operate = this._actions[type];
    if (!operate) {
      console.error("没有此方法啊！");
    }
    operate(this, payload);
  }
}

function install(_Vue) {
  Vue = _Vue;
  Vue.mixin({
    beforeCreate() {
      if (this.$options.store) {
        Vue.prototype.$store = this.$options.store;
      }
    },
  });
}

export default { Store, install };
