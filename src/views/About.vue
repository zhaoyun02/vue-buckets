<template>
  <div class="about">
    <router-view></router-view>
    <h1>This is an about page</h1>
    <p class="pic"> 👇看看这个是我家的狗狗，他叫嘟嘟！</p>
    <img src="../images/1.jpeg"/>
    <img src="../images/2.jpeg"/>
  </div>
</template>
<script>
export default {
  methods: {
    change() {
      alert('你点我干啥啊')
    }
  },
}
</script>

<style scoped>
.aa{
  color: red;
}
.pic{
  background-color: greenyellow;
  color:purple;
  font-size: 20px;
}
img{
  width:500px;
  height: 500px;
  margin-left: 20px;
}
</style>
