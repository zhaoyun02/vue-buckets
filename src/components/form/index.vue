<template>
  <div>
    <k-form :model="model" :rules="rules" ref="loginForm">
      <k-input-item label="用户名：" prop="username">
        <k-input v-model="model.username" placeholder="请输入用户名" />
      </k-input-item>
      <k-input-item label="密码：" prop="password">
        <k-input
          type="password"
          v-model="model.password"
          placeholder="请输入密码"
        />
      </k-input-item>
      <k-input-item>
        <button @click="onLogin">Login</button>
      </k-input-item>
    </k-form>

    {{ model.username }} :{{ model.password }}
  </div>
</template>

<script>
import KInput from "./KInput";
import KInputItem from "./KInputItem";
import KForm from "./KForm";
export default {
  components: {
    KInput,
    KInputItem,
    KForm,
  },
  data() {
    return {
      model: {
        username: "zhaoyun",
        password: "",
      },
      rules: {
        username: [{ required: true, message: "用户名为必填项" }],
        password: [{ required: true, message: "请输入密码" }],
      },
    };
  },
  methods: {
    onLogin() {
      this.$refs.loginForm.validate((isValid) => {
        if (isValid) {
          console.log("submit login");
        } else {
          alert("校验失败");
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
