hexo.extend.generator.register('random', function (locals) {
    const config = hexo.config.random || {}
    const posts = []
    for (const post of locals.posts.data) {
        if (post.random !== false) posts.push(post.path)
    }
    return {
        path: 'js/random.js',
        data: `var posts=${JSON.stringify(posts)};
                    function toRandomPost() {
                        window.open('/'+posts[Math.floor(Math.random() * posts.length)],"_self");
                        new Vue({
                            data: function () {
                                this.$notify({
                                    title: "跳转中",
                                    message: "前往随机文章",
                                    position: 'top-left',
                                    offset: 50,
                                    showClose: true,
                                    type: "success",
                                    duration: 4000
                                });
                            }
                        });
                    };`
    }
})