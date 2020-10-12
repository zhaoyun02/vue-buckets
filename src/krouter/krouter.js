let Vue;
export default class VueRouter {
  constructor(options) {
    this.$options = options;
    this.current = window.location.hash.slice(1) || "/";
    // matched只存放当前hash下的所有路由
    Vue.util.defineReactive(this, "matched", []);
    //递归遍历路由解决嵌套路由
    this.match();
    // const init = window.location.hash.slice(1) || "/";
    // Vue.util.defineReactive(this, "current", init);
    window.addEventListener("hashchange", () => {
      this.current = window.location.hash.slice(1);
      this.matched = [];
      this.match();
    });
  }
  match(routes) {
    routes = routes || this.$options.routes;
    // console.log(routes);
    for (const route of routes) {
      // console.log(111,route.path,this.current);
      if (route.path === "/" && this.current === "/") {
        this.matched.push(route);
        return;
      }
      // 暂未处理path相近的 /info /info111 /info222
      if (route.path !== "/" && this.current.indexOf(route.path) !== -1) {
        this.matched.push(route);
        if (route.children) {
          this.match(route.children);
          return;
        }
      }
    }
    console.log(this.matched);
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
      // 标记当前router-view的深度
      this.$vnode.data.routerView = true;
      let depth = 0;
      let parent = this.$parent;
      while (parent) {
        const vnodeData = parent.$vnode && parent.$vnode.data;
        if (vnodeData) {
          if (vnodeData.routerView) {
            depth++;
          }
        }
        // if(window.location.hash.indexOf('/about/info')){
        //   console.log(parent);
        // }
        parent = parent.$parent;
      }
      // console.log(depth);
      let component = null;
      const route = this.$router.matched[depth];
      if (route) {
        component = route.component;
      }

      // const route = this.$router.$options.routes.find(
      //   (route) => route.path === this.$router.current
      // );
      // if (!route) {
      //   console.error("组件不存在！");
      //   return;
      // }
      // component = route.component;
      return h(component);
    },
  });
};
