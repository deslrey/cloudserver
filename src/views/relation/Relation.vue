<template>
    <div id="main" ref="main" class="main"></div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'

// 使用 ref 来获取 DOM 元素
const main = ref(null)

onMounted(() => {
    const myChart = echarts.init(main.value)
    const categories = []
    for (let i = 0; i < 4; i++) {
        categories[i] = {
            name: '级别' + (i + 1)
        }
    }
    const option = {
        title: {
            text: 'ECharts 关系图'
        },
        tooltip: {
            formatter: function (x) {
                return x.data.des
            }
        },
        toolbox: {
            show: true,
            feature: {
                mark: { show: true },
                restore: { show: true },
                saveAsImage: { show: true }
            }
        },
        legend: [{
            data: categories.map(function (a) {
                return a.name
            })
        }],
        series: [{
            type: 'graph',
            layout: 'force',
            symbolSize: 40,
            focusNodeAdjacency: true,
            roam: true,
            edgeSymbolSize: [2, 10],
            edgeLabel: {
                normal: {
                    textStyle: {
                        fontSize: 20
                    }
                }
            },
            force: {
                repulsion: 2500,
                edgeLength: [10, 50]
            },
            draggable: true,
            lineStyle: {
                normal: {
                    width: 2,
                    color: '#4b565b',
                }
            },
            edgeLabel: {
                normal: {
                    show: true,
                    formatter: function (x) {
                        return x.data.name
                    }
                }
            },
            label: {
                normal: {
                    show: true,
                    textStyle: {}
                }
            },
            data: [
                { name: 'node01', des: 'nodedes01', symbolSize: 70, category: 0, itemStyle: { color: '#0000ff' } },
                { name: 'node02', des: 'nodedes02', symbolSize: 50, category: 1 },
                { name: 'node03', des: 'nodedes3', symbolSize: 50, category: 1 },
                { name: 'node04', des: 'nodedes04', symbolSize: 50, category: 1, itemStyle: { color: '#2EA7C2FF' } },
                { name: 'node05', des: 'nodedes05', symbolSize: 50, category: 3 },
                { name: 'node06', des: 'nodedes04', symbolSize: 50, category: 2 },
            ],
            links: [
                { source: 'node01', target: 'node02', name: 'link01', des: 'link01des' },
                { source: 'node01', target: 'node03', name: 'link02', des: 'link02des' },
                { source: 'node01', target: 'node04', name: 'link03', des: 'link03des' },
                { source: 'node01', target: 'node05', name: 'link04', des: 'link05des' },
                { source: 'node01', target: 'node06', name: 'link06', des: 'link05des', symbol: ['circle', 'arrow'], lineStyle: { color: '#66FFCC' } }
            ],
            categories: categories,
        }]
    }
    myChart.setOption(option)
    //点击事件
    myChart.on('click', function (params) {
        alert(params.name)
    })
})
</script>

<style scoped>
.main {
    flex: 1;
    width: 100%;
    height: 100%;
    overflow: hidden;
    box-sizing: border-box;
}
</style>
