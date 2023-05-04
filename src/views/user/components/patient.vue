<script setup lang="ts" name="patient">
import { addPatientAPI, delPatientAPI, editPatientAPI, patientListAPI } from '@/services/user'
import { useConsultStore } from '@/stores'
import type { PatientList, patientInfo } from '@/types/user'
import { idCardRules, nameRules } from '@/utils/rules'
import { showConfirmDialog, showNotify, type FormInstance, showToast } from 'vant'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useRoute } from 'vue-router'

// 初始化患者表单信息
const initPatient: patientInfo = {
  name: '',
  idCard: '',
  gender: 1,
  defaultFlag: 0
}

// 是否是选择患者
const route = useRoute()
const isChange = computed(() => route.query.isChange === '1')

// 点击选中患者
const patientId = ref<string>()
const selectedPatient = (item: patientInfo) => {
  if (isChange.value) {
    patientId.value = item.id
  }
}

// 患者表单信息
const patient = ref<patientInfo>({ ...initPatient })

// 患者列表
const patientList = ref<PatientList>([])

// 显示底部弹窗
const showBottom = ref<boolean>(false)
// 表单
const form = ref<FormInstance>()

// 性别选项
const options = [
  { label: '男', value: 1 },
  { label: '女', value: 0 }
]

// 控制编辑/添加
const isEdit = ref<boolean>(false)
// 转换数据-布尔值:1|0 (默认就诊人)
const defaultFlag = computed({
  get() {
    return patient.value.defaultFlag ? true : false
  },
  set(val) {
    patient.value.defaultFlag = val ? 1 : 0
  }
})

// 获取患者详细信息
// async function getPatientInfo(id: string) {
//   // const res = await patientInfoAPI(id)
//   // patient.value = res.data
// }

// 获取患者列表
async function getPatientList() {
  const res = await patientListAPI()
  patientList.value = res.data
  // 设置默认选中的ID，当你是选择患者的时候，且有患者信息的时候
  if (isChange.value && patientList.value.length) {
    const defPatient = patientList.value.find((item) => item.defaultFlag === 1)
    if (defPatient) patientId.value = defPatient.id
    else patientId.value = patientList.value[0].id
  }
}

// 编辑,添加患者
async function setPatient(items?: patientInfo) {
  if (items) {
    const { id, gender, name, idCard, defaultFlag } = items
    patient.value = { id, gender, name, idCard, defaultFlag }
    isEdit.value = true
  } else {
    form.value?.resetValidation()
    isEdit.value = false
  }
  showBottom.value = true
}

// 组件挂载,获取患者列表
onMounted(() => {
  getPatientList()
})
// 提交表单
async function submit() {
  await form.value?.validate()
  // 身份证倒数第二位，单数是男，双数是女
  const gender = +patient.value.idCard.slice(-2, -1) % 2
  if (gender !== patient.value.gender) {
    await showConfirmDialog({
      title: '温馨提示',
      message: '填写的性别和身份证号中的不一致\n您确认提交吗？'
    })
  }
  const res = isEdit.value
    ? await editPatientAPI(patient.value)
    : await addPatientAPI(patient.value)

  if (res.code === 10000) {
    showNotify({ type: 'success', message: '操作成功' })
    showBottom.value = false
    getPatientList()
  }
}

// 删除患者
function delPatient() {
  showConfirmDialog({
    title: '温馨提示',
    message: '您确认要删除该患者吗?'
  }).then(async () => {
    const res = await delPatientAPI(patient.value.id as string)
    if (res.code === 10000) {
      showNotify({ type: 'success', message: '删除成功' })
      showBottom.value = false
      getPatientList()
    } else {
      showNotify({ type: 'danger', message: '操作失败' })
    }
  })
}

// 弹出层关闭
const closed = () => {
  patient.value = { ...initPatient }
}

// 下一步
const store = useConsultStore()
const router = useRouter()
const nextStep = () => {
  if (!patientId.value) return showToast('请选就诊择患者')
  store.setPatient(patientId.value)
  router.push('/consult/pay')
}
</script>
<template>
  <div class="patient-page">
    <nav-bar :title="isChange ? '选择患者' : '家庭档案'"></nav-bar>
    <div class="patient-list">
      <!-- 头部提示 -->
      <div class="patient-change" v-if="isChange">
        <h3>请选择患者信息</h3>
        <p>以便医生给出更准确的治疗，信息仅医生可见</p>
      </div>
      <div
        class="patient-item"
        v-for="items in patientList"
        :key="items.id"
        @click="selectedPatient(items)"
        :class="{ selected: patientId === items.id }"
      >
        <div class="info">
          <span class="name">{{ items.name }}</span>
          <span class="id">{{ items.idCard.replace(/^(.{6}).+(.{4})$/, '\$1********\$2') }}</span>
          <span>{{ items.gender ? '男' : '女' }}</span>
          <span>{{ items.age }}岁</span>
        </div>
        <div @click="setPatient(items)" class="icon"><svg-icon name="user-edit" /></div>
        <div v-if="items.defaultFlag" class="tag">默认</div>
      </div>
      <div class="patient-add" v-if="patientList.length < 6" @click="setPatient()">
        <svg-icon name="user-add" />
        <p>添加患者</p>
      </div>
      <div class="patient-tip">最多可添加 6 人</div>

      <!-- 底部按钮 -->
      <div class="patient-next" v-if="isChange">
        <van-button @click="nextStep" type="primary" round block>下一步</van-button>
      </div>
      <van-popup @closed="closed" v-model:show="showBottom" round position="bottom">
        <nav-bar
          :back="() => (showBottom = false)"
          :title="isEdit ? '编辑患者' : '添加患者'"
          right-text="保存"
          @click-right="submit"
        ></nav-bar>
        <van-form autocomplete="off" ref="form">
          <van-field
            :rules="nameRules"
            v-model="patient.name"
            label="真实姓名"
            placeholder="请输入真实姓名"
          />
          <van-field
            :rules="idCardRules"
            v-model="patient.idCard"
            label="身份证号"
            placeholder="请输入身份证号"
          />
          <van-field label="性别" class="pb4">
            <!-- 单选按钮组件 -->
            <template #input>
              <radio-btn :options="options" v-model="patient.gender"></radio-btn>
            </template>
          </van-field>
          <van-field label="默认就诊人">
            <template #input>
              <van-checkbox v-model="defaultFlag" :icon-size="18" round />
            </template>
          </van-field>
          <van-action-bar v-if="isEdit">
            <van-action-bar-button @click="delPatient()">删除信息</van-action-bar-button>
          </van-action-bar>
        </van-form>
      </van-popup>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.patient-page {
  padding: 46px 0 80px;
  :deep().van-popup {
    width: 100%;
    height: 100%;
    padding-top: 46px;
    box-sizing: border-box;
  }
}
.patient-list {
  padding: 15px;
}
.patient-item {
  display: flex;
  align-items: center;
  padding: 15px;
  background-color: var(--cp-bg);
  border-radius: 8px;
  margin-bottom: 15px;
  position: relative;
  border: 1px solid var(--cp-bg);
  transition: all 0.3s;
  overflow: hidden;
  .info {
    display: flex;
    flex-wrap: wrap;
    flex: 1;
    span {
      color: var(--cp-tip);
      margin-right: 20px;
      line-height: 30px;
      &.name {
        font-size: 16px;
        color: var(--cp-text1);
        width: 80px;
        margin-right: 0;
      }
      &.id {
        color: var(--cp-text2);
        width: 180px;
      }
    }
  }
  .icon {
    color: var(--cp-tag);
    width: 20px;
    text-align: center;
  }
  .tag {
    position: absolute;
    right: 60px;
    top: 21px;
    width: 30px;
    height: 16px;
    font-size: 10px;
    color: #fff;
    background-color: var(--cp-primary);
    border-radius: 2px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  &.selected {
    border-color: var(--cp-primary);
    background-color: var(--cp-plain);
    .icon {
      color: var(--cp-primary);
    }
  }
}
.patient-add {
  background-color: var(--cp-bg);
  color: var(--cp-primary);
  text-align: center;
  padding: 15px 0;
  border-radius: 8px;
  .svg-icon {
    font-size: 24px;
    width: 1em;
    height: 1em;
  }
}
.patient-tip {
  color: var(--cp-tag);
  padding: 12px 0;
}
.pb4 {
  padding-bottom: 4px;
}
.svg-icon {
  width: 1.5em;
  height: 1.5em;
}
// 底部操作栏
.van-action-bar {
  padding: 0 10px;
  margin-bottom: 10px;
  .van-button {
    color: var(--cp-price);
    background-color: var(--cp-bg);
  }
}
.patient-change {
  padding: 15px;
  > h3 {
    font-weight: normal;
    margin-bottom: 5px;
  }
  > p {
    color: var(--cp-text3);
  }
}
.patient-next {
  padding: 15px;
  background-color: #fff;
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 80px;
  box-sizing: border-box;
}
</style>
