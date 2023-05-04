<script setup lang="ts">
import { getMedicalOrderLogistics } from '@/services/order'
import type { Logistics } from '@/types/order'
import AMapLoader from '@amap/amap-jsapi-loader'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import startImg from '@/assets/start.png'
import endImg from '../../assets/end.png'
import carImg from '@/assets/car.png'
const route = useRoute()

// 获取物流数据
const logistics = ref<Logistics>()
// 高德地图配置
window._AMapSecurityConfig = {
  securityJsCode: '99240abf1188823cd88cfe635a521af3'
}
// 初始化高德地图
const initMap = async () => {
  const res = await getMedicalOrderLogistics(route.params.id as string)
  logistics.value = res.data
  AMapLoader.load({
    key: 'b5a3290bb8e23f2361bcc36be9435bcd', // 申请好的Web端开发者Key，首次调用 load 时必填
    version: '2.0' // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
  }).then((AMap) => {
    const map = new AMap.Map('map', {
      //设置地图容器id
      mapStyle: 'amap://styles/whitesmoke',
      zoom: 12 //初始化地图级别
    })

    AMap.plugin('AMap.Driving', function () {
      const driving = new AMap.Driving({
        map: map,
        showTraffic: false,
        hideMarkers: true
      })
      if (logistics.value?.logisticsInfo && logistics.value.logisticsInfo.length >= 2) {
        const list = [...logistics.value.logisticsInfo]
        // 起点
        const start = list.shift()
        // 终点
        const end = list.pop()
        driving.search(
          [start?.longitude, start?.latitude],
          [end?.longitude, end?.latitude],
          { waypoints: list.map((item) => [item.longitude, item.latitude]) },
          () => {
            // 规划完毕\
            // 创建 AMap.Icon 实例：
            // 起点
            // 创建起点标记📌
            const startMarker = new AMap.Marker({
              position: [start?.longitude, start?.latitude],
              icon: startImg,
              anchor: 'center'
            })
            // 添加起点到地图上📌
            map.add(startMarker)

            // 终点
            // 创建终点标记📌
            const endMarker = new AMap.Marker({
              position: [end?.longitude, end?.latitude],
              icon: endImg,
              anchor: 'center'
            })
            // 添加终点到地图上📌
            map.add(endMarker)
          }
        )

        driving.search(
          [start?.longitude, start?.latitude],
          [end?.longitude, end?.latitude],
          {
            waypoints: res.data.logisticsInfo.map((item) => [item.longitude, item.latitude])
          },
          (status: string, result: object) => {
            // 未出错时，result即是对应的路线规划方案
            console.log(status, result)
            const carMarker = new AMap.Marker({
              icon: carImg,
              position: [
                res.data.currentLocationInfo.longitude,
                res.data.currentLocationInfo.latitude
              ],
              anchor: 'center'
            })
            map.add(carMarker)
            setTimeout(() => {
              map.setFitView([carMarker])
              map.setZoom(9)
            }, 3000)
          }
        )
      }
    })
  })
}
//  组件挂载获取数据
onMounted(() => {
  initMap()
})
</script>

<template>
  <div class="order-logistics-page">
    <div id="map">
      <div class="title">
        <van-icon name="arrow-left" @click="$router.back()" />
        <span>{{ logistics?.statusValue }}</span>
        <van-icon name="service" />
      </div>
      <div class="current">
        <p class="status">{{ logistics?.statusValue }} 预计{{ logistics?.estimatedTime }}送达</p>
        <p class="predict">
          <span>{{ logistics?.name }}</span>
          <span>{{ logistics?.awbNo }}</span>
        </p>
      </div>
    </div>
    <div class="logistics">
      <p class="title">物流详情</p>
      <van-steps direction="vertical" :active="0">
        <van-step v-for="item in logistics?.list" :key="item.id">
          <p class="status">{{ item.statusValue }}</p>
          <p class="content">{{ item.content }}</p>
          <p class="time">{{ item.createTime }}</p>
        </van-step>
      </van-steps>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.order-logistics-page {
  --van-step-icon-size: 18px;
  --van-step-circle-size: 10px;
}
#map {
  height: 450px;
  background-color: var(--cp-bg);
  overflow: hidden;
  position: relative;
  .title {
    background-color: #fff;
    height: 46px;
    width: 355px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    padding: 0 15px;
    font-size: 16px;
    position: absolute;
    left: 10px;
    top: 10px;
    box-sizing: border-box;
    box-shadow: 0px 0px 22px 0px rgba(229, 229, 229, 0.5);
    z-index: 999;
    > span {
      flex: 1;
      text-align: center;
    }
    .van-icon {
      font-size: 18px;
      color: #666;
      &:last-child {
        color: var(--cp-primary);
      }
    }
  }
  .current {
    height: 80px;
    border-radius: 4px;
    background-color: #fff;
    height: 80px;
    width: 355px;
    box-sizing: border-box;
    padding: 15px;
    position: absolute;
    left: 10px;
    bottom: 10px;
    box-shadow: 0px 0px 22px 0px rgba(229, 229, 229, 0.5);
    z-index: 999;
    .status {
      font-size: 15px;
      line-height: 26px;
    }
    .predict {
      color: var(--cp-tip);
      font-size: 13px;
      margin-top: 5px;
      > span {
        padding-right: 10px;
      }
    }
  }
}
.logistics {
  padding: 0 10px 20px;
  .title {
    font-size: 16px;
    padding: 15px 5px 5px;
  }
  .van-steps {
    :deep(.van-step) {
      &::after {
        display: none;
      }
    }
    .status {
      font-size: 15px;
      color: var(--cp-text3);
      margin-bottom: 4px;
    }
    .content {
      font-size: 13px;
      color: var(--cp-tip);
      margin-bottom: 4px;
    }
    .time {
      font-size: 13px;
      color: var(--cp-tag);
    }
  }
}
</style>
