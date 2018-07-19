<template>
  <div class="error-container">
    <img class="center-block" src="/images/404.png" />
    <p class="text-center">你没有如期而至，而这正是等待的意义。</p>
  </div>
</template>
<style lang="less" scoped>
  .error-container {
    padding-top: 30px;
    &>p{
      margin: 10px 0;
      color: #999;
    }
  }
  .center-block {
    display: block;
    margin-left: auto;
    margin-right: auto;
  }
  .text-center {
    text-align: center;
  }
</style>