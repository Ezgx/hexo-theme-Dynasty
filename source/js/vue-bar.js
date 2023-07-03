document.addEventListener("copy", function () {
    new Vue({
      data: function () {
          this.$notify({
              title: "复制成功",
              message: "转载请遵守cc协议",
              position: 'top-left',
              offset: 50,
              showClose: true,
              type: "success",
              duration: 4000
          });
      }
    })
  })