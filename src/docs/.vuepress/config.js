module.exports = {
    title: 'Barry7的个人博客',
    description: '欢迎来到Barry7的个人博客',
    markdown: {
        lineNumbers: true
    },
    themeConfig: {
        // sidebarDepth:4,
        // sidebar:'auto',
        sidebar: {
            '/frontend/': [
                {
                    title: '前端开发分享',
                    children: [
                        '',
                        'largeList',
                        'select'
                    ]
                }

            ],
            '/algorithm/': [
                {
                    title: '算法分享',
                    children: [
                        ''
                        // '/algorithm/test'
                    ]
                }
            ]
        },
        // displayAllHeaders: true, // 默认值：false
        nav: [
            {text: '算法', link: '/algorithm/'},
            {text: '前端', link: '/frontend/'},
            // 下拉列表
            {
                text: 'GitHub',
                items: [
                    {text: 'GitHub地址', link: 'https://github.com/barry7'}
                ]
            }
        ],
        // sidebar: {
        //     '/froentend/': [
        //         '',     /* /foo/ */
        //         'lageList',  /* /foo/one.html */
        //         'select'   /* /foo/two.html */
        //     ],
        //     // docs文件夹下面的accumulate文件夹 文档中md文件 书写的位置(命名随意)
        //     '/accumulate/': [
        //         '/accumulate/', // accumulate文件夹的README.md 不是下拉框形式
        //         {
        //             title: '侧边栏下拉框的标题1',
        //             children: [
        //                 '/accumulate/JS/test', // 以docs为根目录来查找文件
        //                 // 上面地址查找的是：docs>accumulate>JS>test.md 文件
        //                 // 自动加.md 每个子选项的标题 是该md文件中的第一个h1/h2/h3标题
        //             ]
        //         }
        //     ],
        //     // docs文件夹下面的algorithm文件夹 这是第二组侧边栏 跟第一组侧边栏没关系
        //     '/algorithm/': [
        //         '/algorithm/',
        //         {
        //             title: '第二组侧边栏下拉框的标题1',
        //             children: [
        //                 '/algorithm/simple/test'
        //             ]
        //         }
        //     ]
        // }
    }
};
