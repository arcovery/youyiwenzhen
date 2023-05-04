import { OrderType } from '@/enums'
import { followDoctorAPI } from '@/services/consult'
import { cancelOrderAPI, deleteOrderAPI } from '@/services/order'
import type { Doctor } from '@/types/consult'
import type { patientConsultOrderListDataRow } from '@/types/user'
import { showConfirmDialog, showSuccessToast } from 'vant'
export const useFollow = () => {
  // 关注逻辑
  const loading = ref(false)
  const follow = async (item: Doctor) => {
    loading.value = true
    const res = await followDoctorAPI({
      id: item.id
    })
    if (res.code === 10000) {
      item.likeFlag = item.likeFlag === 1 ? 0 : 1
    }
    loading.value = false
  }
  return {
    follow,
    loading
  }
}

// 取消订单
export const useCancelOrder = () => {
  const loading = ref<boolean>(false)
  const orderCancel = async (item: patientConsultOrderListDataRow) => {
    await showConfirmDialog({
      title: '是否确认取消订单？'
    })
    try {
      loading.value = true
      await cancelOrderAPI(item.id)
      item.status = OrderType.ConsultCancel
      item.statusValue = '已取消'
      showSuccessToast('取消成功')
    } catch {
      showSuccessToast('取消失败')
    } finally {
      loading.value = false
    }
  }
  return {
    orderCancel,
    loading
  }
}

// 删除订单
export const useDeleteOrder = (cb: () => void) => {
  const deleteLoading = ref(false)
  const deleteOrder = async (item: patientConsultOrderListDataRow) => {
    await showConfirmDialog({
      title: '是否确认删除订单？'
    })
    try {
      deleteLoading.value = true
      await deleteOrderAPI(item.id)
      cb()
      showSuccessToast('删除成功')
    } catch {
      showSuccessToast('删除失败')
    } finally {
      deleteLoading.value = false
    }
  }
  return {
    deleteLoading,
    deleteOrder
  }
}
// 获取订单详情数据
import { getMedicalOrderDetail } from '@/services/order'
import type { OrderDetail } from '@/types/order'
import { onMounted, ref } from 'vue'

export const useOrderDetail = (id: string) => {
  const loading = ref(false)
  const order = ref<OrderDetail>()
  onMounted(async () => {
    loading.value = true
    try {
      const res = await getMedicalOrderDetail(id)
      order.value = res.data
    } finally {
      loading.value = false
    }
  })
  return { order, loading }
}
