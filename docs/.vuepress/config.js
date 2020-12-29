module.exports = {
    title: '日积月累',
    description: '技术积累',
    // 注入到当前页面的 HTML <head> 中的标签
    head: [
        ['link', { rel: 'icon', href: '/favicon.ico' }], // 增加一个自定义的 favicon(网页标签的图标)
    ],
    base: '/docs/', // 这是部署到github相关的配置 下面会讲
    markdown: {
        lineNumbers: true // 代码块显示行号
    },
    themeConfig: {
        sidebarDepth: 3, // e'b将同时提取markdown中h2 和 h3 标题，显示在侧边栏上。
        lastUpdated: 'Last Updated',
        nav:[
            // { text: '前端算法', link: '/algorithm/' }, // 内部链接 以docs为根目录
            // { text: '博客', link: 'http://obkoro1.com/' }, // 外部链接
            // 下拉列表
            {
                text: 'GitHub',
                items: [
                    { text: 'GitHub地址', link: 'https://github.com/HuaYuan92/docs' },
                ]
            }
        ],
        sidebar: {
            '/vue/':[
                'base',
                'vue',
                'optimised',
                'bugs',
                'website',
                'data',
                'article'
            ],
        },
    }
}
