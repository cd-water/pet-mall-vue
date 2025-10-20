<template>
  <el-form :inline="true" :model="searchForm">
    <el-form-item>
      <el-select
        v-model="searchForm.typeId"
        placeholder="请选择宠物类型"
        clearable
        style="width: 180px"
        :value-key="'id'"
        @change="handleSearch"
      >
        <el-option v-for="item in petTypeList" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-input v-model="searchForm.name" placeholder="请输入宠物名称" clearable @keyup.enter="handleSearch" />
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
    <el-col v-for="item in petList" :key="item.id" :span="4.8" class="show-item">
      <RouterLink :to="`/customer/visitor-toall/petDetail?id=${item.id}`" class="link">
        <div>
          <img :src="item.img" alt="pet" class="img-pet" />
        </div>
        <div>{{ item.name }}</div>
        <div class="tag">
          <el-tag v-if="item.gender === 0" type="danger" effect="dark" round>母</el-tag>
          <el-tag v-else-if="item.gender === 1" type="primary" effect="dark" round>公</el-tag>
          <el-tag v-if="item.saleStatus === 0" type="info" effect="dark">已售罄</el-tag>
          <el-tag v-else-if="item.saleStatus === 1" type="danger" effect="dark">售卖中</el-tag>
          <el-tag v-else-if="item.saleStatus === 2" type="warning" effect="dark">未上架</el-tag>
          <el-tag v-if="item.store > 0" type="success" effect="dark">有货</el-tag>
          <el-tag v-else type="info" effect="dark">缺货</el-tag>
        </div>
        <div class="price">￥{{ item.price }}</div>
      </RouterLink>
    </el-col>
  </el-row>
  <el-empty v-if="total === 0" description="暂无宠物信息" />
  <el-backtop :right="30" :bottom="30" target=".show-area" />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { allPetTypeApi } from '@/api/customer/petType'
import { pagePetApi } from '@/api/customer/pet'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const searchForm = ref({})
const petTypeList = ref([])
const petList = ref([])
const searchLoading = ref(false)
const noMore = ref(false)
const pageNum = ref(1)
const pageSize = ref(25)
const total = ref(0)

const priceRange = ref([0, 10000])

const getAllPetType = async () => {
  const res = await allPetTypeApi()
  if (res.code === 200) {
    petTypeList.value = res.data
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
    const res = await pagePetApi(searchForm.value, pageNum.value, pageSize.value)
    if (res.code === 200) {
      petList.value = res.data.list
      total.value = res.data.total
      if (petList.value.length >= total.value) {
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
    const res = await pagePetApi(searchForm.value, pageNum.value, pageSize.value)
    if (res.code === 200) {
      const loadList = res.data.list
      total.value = res.data.total
      if (loadList.length > 0) {
        petList.value = petList.value.concat(loadList)
        if (petList.value.length >= total.value) {
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
  pageSize.value = 25
  const newQuery = { ...route.query }
  delete newQuery.typeId
  router.replace({ path: route.path, query: newQuery })
  handleSearch()
}

onMounted(() => {
  getAllPetType()
  const typeId = route.query.typeId
  if (typeId) {
    searchForm.value.typeId = Number(typeId)
  }
  handleSearch()
})
</script>

<style scoped>
.show-area {
  height: 680px;
  overflow-y: auto;
  align-items: center;
}
.show-item {
  margin: var(--spacing-sm);
  padding: var(--spacing-sm) 0;
  border-radius: var(--border-radius-md);
  background: var(--item-color);
  width: 100%;
  max-width: 250px;
}
.show-item:hover {
  box-shadow: inset 0 0 0 2px var(--primary-color);
  border-radius: var(--border-radius-md);
}
.img-pet {
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
</style>
