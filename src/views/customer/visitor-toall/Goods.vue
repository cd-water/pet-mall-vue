<template>
  <el-form :inline="true" :model="searchForm">
    <el-form-item>
      <el-select
        v-model="searchForm.typeId"
        placeholder="请选择宠物用品类型"
        clearable
        style="width: 180px"
        @change="handleSearch"
      >
        <el-option v-for="item in goodsTypeList" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-input v-model="searchForm.name" placeholder="请输入宠物用品名称" clearable @keyup.enter="handleSearch" />
    </el-form-item>
    <el-form-item>
      <el-switch v-model="searchForm.onlyInStock" active-text="仅看有货" inactive-text="全部" @change="handleSearch" />
    </el-form-item>
    <el-form-item label="价格区间">
      <el-slider
        v-model="priceRange"
        range
        :min="0"
        :max="10000"
        style="width: 250px; margin: 0 var(--spacing-md)"
        show-stops
        :marks="{
          0: '0',
          2000: '2k',
          5000: '5k',
          8000: '8k',
          10000: '10k',
        }"
        @change="handlePriceChange"
        @keyup.enter="handleSearch"
      />
    </el-form-item>
    <el-form-item>
      <el-button icon="Search" type="primary" :loading="searchLoading" @click="handleSearch">搜索</el-button>
      <el-button icon="Refresh" type="warning" @click="handleClear">重置</el-button>
    </el-form-item>
  </el-form>

  <el-row
    v-show="total > 0"
    v-infinite-scroll="handleLoad"
    :gutter="24"
    class="show-area"
    :infinite-scroll-disabled="searchLoading || noMore"
    :infinite-scroll-distance="100"
  >
    <el-col v-for="item in goodsList" :key="item.id" :span="4" class="show-item">
      <div>
        <img :src="item.img" alt="goods" class="img-goods" />
      </div>
      <div>
        <div>{{ item.name }}</div>
        <div class="two-side">
          <div class="tag">
            <el-tag v-if="item.saleStatus === 0" type="info" effect="dark">已售罄</el-tag>
            <el-tag v-else-if="item.saleStatus === 1" type="danger" effect="dark">售卖中</el-tag>
            <el-tag v-else-if="item.saleStatus === 2" type="warning" effect="dark">未上架</el-tag>
            <el-tag v-if="item.store > 0" type="success" effect="dark">有货</el-tag>
            <el-tag v-else type="info" effect="dark">缺货</el-tag>
          </div>
          <div class="price">￥{{ item.price }}</div>
        </div>
        <div class="two-side">
          <el-button type="primary" size="small" icon="View" @click="viewGoodsDetail(item)">查看详情</el-button>
          <el-button
            type="success"
            size="small"
            :loading="joinCartLoading"
            icon="ShoppingCart"
            @click="joinCart(item.id)"
          >
            加入购物车
          </el-button>
        </div>
      </div>
    </el-col>
  </el-row>
  <el-empty v-if="total === 0" description="暂无宠物用品信息" />

  <el-backtop :right="30" :bottom="30" target=".show-area" />

  <el-dialog
    v-model="dialogState.visible"
    width="600px"
    destroy-on-close
    :close-on-click-modal="false"
    align-center
    :show-close="false"
  >
    <template #header>
      <span class="text-dialog-title">宠物用品详情</span>
    </template>
    <el-row :gutter="24">
      <el-col :span="10">
        <img :src="dialogState.form.img" alt="goods" class="img-goods-dialog" />
      </el-col>
      <el-col :span="14">
        <el-row class="dialog-row">
          <el-col :span="24">
            <span class="text-dialog-name">{{ dialogState.form.name }}</span>
            <div class="dialog-tag-price">
              <div class="tag">
                <el-tag v-if="dialogState.form.saleStatus === 0" type="info" effect="dark">已售罄</el-tag>
                <el-tag v-else-if="dialogState.form.saleStatus === 1" type="danger" effect="dark">售卖中</el-tag>
                <el-tag v-else-if="dialogState.form.saleStatus === 2" type="warning" effect="dark">未上架</el-tag>
                <el-tag v-if="dialogState.form.store > 0" type="success" effect="dark">有货</el-tag>
                <el-tag v-else type="info" effect="dark">缺货</el-tag>
              </div>
              <span class="price">￥{{ dialogState.form.price }}</span>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="24" class="dialog-row">
          <el-col :span="12">
            <span>销售宠物店：{{ dialogState.form.shopName }}</span>
          </el-col>
          <el-col :span="12">
            <span>商品类型：{{ dialogState.form.typeName }}</span>
          </el-col>
        </el-row>
        <el-row :gutter="24" class="dialog-row">
          <el-col :span="12">
            <span>商品销量：{{ formatSalesVolume(dialogState.form.saleVolume) }}</span>
          </el-col>
          <el-col :span="12">
            <span>商品库存：{{ formatInventory(dialogState.form.store) }}</span>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-divider content-position="left">商品简介</el-divider>
    <el-row class="dialog-row">
      <el-col :span="24">
        <p>{{ dialogState.form.introduce }}</p>
      </el-col>
    </el-row>
    <template #footer>
      <el-button type="warning" @click="dialogState.visible = false">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { allGoodsTypeApi } from '@/api/customer/goodsType'
import { pageGoodsApi } from '@/api/customer/goods'
import { joinCartApi } from '@/api/customer/cart'
import { useAuthStore } from '@/stores'
import { ElMessage } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const searchForm = ref({})
const goodsTypeList = ref([])
const goodsList = ref([])
const searchLoading = ref(false)
const joinCartLoading = ref(false)
const noMore = ref(false)
const pageNum = ref(1)
const pageSize = ref(30)
const total = ref(0)

const priceRange = ref([0, 10000])

const getAllGoodsType = async () => {
  const res = await allGoodsTypeApi()
  if (res.code === 200) {
    goodsTypeList.value = res.data
  }
}

const handleSearch = async () => {
  if (searchLoading.value) return
  searchLoading.value = true
  try {
    pageNum.value = 1
    noMore.value = false
    const newQuery = { ...route.query }
    if (searchForm.value.typeId) {
      newQuery.typeId = String(searchForm.value.typeId)
    } else {
      delete newQuery.typeId
    }
    router.replace({ path: route.path, query: newQuery })
    const res = await pageGoodsApi(searchForm.value, pageNum.value, pageSize.value)
    if (res.code === 200) {
      goodsList.value = res.data.list
      total.value = res.data.total
      if (goodsList.value.length >= total.value) {
        noMore.value = true
      }
    }
  } finally {
    searchLoading.value = false
  }
}

const handlePriceChange = (val) => {
  searchForm.value.priceMin = val[0]
  searchForm.value.priceMax = val[1]
}

const handleLoad = async () => {
  if (searchLoading.value || noMore.value) return
  searchLoading.value = true
  try {
    pageNum.value += 1
    const res = await pageGoodsApi(searchForm.value, pageNum.value, pageSize.value)
    if (res.code === 200) {
      const loadList = res.data.list
      total.value = res.data.total
      if (loadList.length > 0) {
        goodsList.value = goodsList.value.concat(loadList)
        if (goodsList.value.length >= total.value) {
          noMore.value = true
        }
      } else {
        noMore.value = true
      }
    }
  } finally {
    searchLoading.value = false
  }
}

const handleClear = () => {
  searchForm.value = {}
  priceRange.value = [0, 10000]
  pageNum.value = 1
  pageSize.value = 30
  const newQuery = { ...route.query }
  delete newQuery.typeId
  router.replace({ path: route.path, query: newQuery })
  handleSearch()
}

const dialogState = ref({
  visible: false,
  form: {},
})

const viewGoodsDetail = (detail) => {
  dialogState.value.visible = true
  dialogState.value.form = detail
}

const joinCart = async (goodsId) => {
  if (joinCartLoading.value) return
  joinCartLoading.value = true
  try {
    const userId = authStore.authMsg.id
    const res = await joinCartApi({ userId, goodsId })
    if (res.code === 200) {
      ElMessage.success('加入购物车成功')
    }
  } finally {
    joinCartLoading.value = false
  }
}

// 格式化销量显示
const formatSalesVolume = (volume) => {
  if (!volume || volume === 0) return '暂无销量'
  if (volume < 100) return `${volume}+`
  const hundreds = Math.floor(volume / 100)
  return `${hundreds * 100}+`
}

// 格式化库存显示
const formatInventory = (store) => {
  if (!store || store === 0) return '缺货'
  if (store >= 100) return '有现货'
  return '库存不多'
}

onMounted(() => {
  getAllGoodsType()
  const typeId = route.query.typeId
  if (typeId) {
    searchForm.value.typeId = Number(typeId)
  }
  handleSearch()
})
</script>

<style scoped>
.two-side {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.show-area {
  height: 680px;
  overflow-y: auto;
  align-items: center;
}
.show-item {
  margin: var(--spacing-sm) 0;
  padding: var(--spacing-sm) 0;
  border-radius: var(--border-radius-md);
  background: var(--item-color);
}
.show-item:hover {
  box-shadow: inset 0 0 0 2px var(--primary-color);
  border-radius: var(--border-radius-md);
}

.text-dialog-title {
  color: var(--primary-color);
  font-size: var(--font-size-xl);
}
.img-goods {
  height: 160px;
  border-radius: var(--border-radius-lg);
}
.tag {
  display: flex;
  gap: var(--spacing-sm);
}
.price {
  color: var(--danger-color);
  font-size: var(--font-size-lg);
  font-weight: bold;
}
.img-goods-dialog {
  height: 200px;
  width: 200px;
  border-radius: var(--border-radius-lg);
}
.text-dialog-name {
  color: var(--text-black);
  font-size: var(--font-size-xl);
}
.dialog-tag-price {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
}
.dialog-row {
  margin: var(--spacing-md) 0;
  font-size: var(--font-size-md);
  color: var(--text-black);
}
</style>
