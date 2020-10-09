let Vue;
export default class VueRouter {
  constructor(options) {
    this.$options = options;
    const init = window.location.hash.slice(1) || "/";
    Vue.util.defineReactive(this, "current", init);
    window.addEventListener("hashchange", () => {
      this.current = window.location.hash.slice(1);
    });
  }
}

VueRouter.install = function(_Vue) {
  Vue = _Vue;
  //1.this.$router.push ==> 将router实例挂在到Vue.proptotype
  Vue.mixin({
    beforeCreate() {
      // 只有根组件中存在的router new Vue时传入的
      if (this.$options.router) {
        Vue.prototype.$router = this.$options.router;
      }
    },
  });
  // 实现两个全局的组件 router-link router-view
  Vue.component("router-link", {
    props: {
      to: {
        type: String,
        required: true,
      },
    },
    // h会返回虚拟dom
    render(h) {
      return h(
        "a",
        {
          attrs: {
            href: "#" + this.to,
          },
        },
        this.$slots.default
      );
    },
  });
  Vue.component("router-view", {
    render(h) {
      let component = null;
      const route = this.$router.$options.routes.find(
        (route) => route.path === this.$router.current
      );
      if (!route) {
        console.error("组件不存在！");
        return;
      }
      component = route.component;
      return h(component);
    },
  });
};
