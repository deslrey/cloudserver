import Layout from '@/layout/index.vue'

export default {
    path: '/files',
    name: 'Files',
    component: Layout,
    redirect: '/files',
    meta: {
        title: '文件管理',
        icon: 'nested',
        noCache: false,
        roles: ['admin']
    },
    children: [
        {
            path: '/files/all',
            name: 'All',
            component: () => import('@/views/files/index.vue'),
            meta: {
                title: '全部',
                noCache: false
            },
            // redirect: '/files',
        },
        {
            path: '/files/video',
            name: 'Video',
            component: () => import('@/views/files/index.vue'),
            meta: {
                title: '视频',
                noCache: false,
                // icon : 'devices',
                roles: ['admin']
            }
        },
        {
            path: '/files/music',
            name: 'Music',
            component: () => import('@/views/files/index.vue'),
            meta: {
                title: '音频',
                noCache: false,
                // icon : 'devices',
                roles: ['admin']
            }
        },
        {
            path: '/files/image',
            name: 'Image',
            component: () => import('@/views/files/index.vue'),
            meta: {
                title: '图片',
                noCache: false,
                // icon : 'devices',
                roles: ['admin']
            }
        },
        {
            path: '/files/doc',
            name: 'Doc',
            component: () => import('@/views/files/index.vue'),
            meta: {
                title: '文档',
                noCache: false,
                // icon : 'devices',
                roles: ['admin']
            }
        },
        {
            path: '/files/others',
            name: 'Others',
            component: () => import('@/views/files/index.vue'),
            meta: {
                title: '其他',
                noCache: false,
                // icon : 'devices',
                roles: ['admin']
            }
        },
    ]
}
