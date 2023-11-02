<template>
  <el-button :disabled="!getUserAuthPrems" :size="size" :type="type" :text="text"
             @click="onClickBtnEvent">
    <el-icon v-if="icon">
      <component :is="icon"></component>
    </el-icon>
    {{ title }}
  </el-button>
</template>

<script setup lang="ts" name="auth">
import {computed} from 'vue';
import {storeToRefs} from 'pinia';
import {useUserInfo} from '/@/stores/userInfo';
// 定义子组件向父组件传值/事件
const emit = defineEmits(['click']);
// 定义父组件传过来的值
const props = defineProps({
  value: {
    type: String,
    default: () => '',
  },
  size: {
    type: String,
    default: () => 'default',
  },
  title: {
    type: String,
    default: () => '',
  },
  type: {
    type: String,
    default: () => 'primary',
  },
  text: {
    icon: {
      type: Boolean,
      default: () => false,
    }
  },
  icon: {
    type: String,
    default: () => '',
  },
  // 默认启用权限认证，关闭则不验证权限
  auth: {
    type: Boolean,
    default: () => true,
  },
  // 默认不禁用
  lock: {
    type: Boolean,
    default: () => false,
  },
});

// 定义变量内容
const stores = useUserInfo();
const {userInfos} = storeToRefs(stores);

// 获取 pinia 中的用户权限
const getUserAuthPrems = computed(() => {
  // 若禁用，则表示不允许点击按钮
  if (props.lock) return false;
  // 如果不启用权限验证，则允许操作
  return props.auth ? userInfos.value.permissions.some((v: string) => v === props.value) : true;
});

// 点击事件
const onClickBtnEvent = (param) => {
  emit('click', param);
}
</script>
