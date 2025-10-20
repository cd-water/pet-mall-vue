<template>
  <el-tabs type="border-card">
    <el-tab-pane label="宠物订单">
      <el-tabs v-model="petStatus" type="card">
        <el-tab-pane v-for="tab in orderTabs" :key="tab.name" :label="tab.label" :name="tab.name">
          <div class="search-part">
            <el-input v-model="orderNo" placeholder="请输入订单号搜索" clearable />
            <el-button icon="Search" type="primary" @click="petOrderNoSearch">搜索</el-button>
          </div>
          <template v-if="petStatusList[tab.name] && petStatusList[tab.name].length > 0">
            <el-card v-for="item in petStatusList[tab.name]" :key="item.id">
              <template #header>
                <RouterLink :to="`/customer/visitor-toall/petShopDetail?id=${item.shopId}`" class="link shop-link">
                  <span>{{ item.shopName }}</span>
                  <el-icon><ArrowRight /></el-icon>
                </RouterLink>
              </template>
              <el-row :gutter="24">
                <el-col :span="5">
                  <img :src="item.petImg" alt="pet" class="pet-img" />
                </el-col>
                <el-col :span="19">
                  <el-card>
                    <template #header>
                      <div class="two-side">
                        <div>
                          <span>订单信息&nbsp;</span>
                          <el-tag v-if="item.orderStatus === 0" effect="dark" type="warning">待付款</el-tag>
                          <el-tag v-else-if="item.orderStatus === 1" effect="dark" type="warning">待接单</el-tag>
                          <el-tag v-else-if="item.orderStatus === 2" effect="dark" type="primary">派送中</el-tag>
                          <el-tag v-else-if="item.orderStatus === 3" effect="dark" type="success">已送达</el-tag>
                          <el-tag v-else-if="item.orderStatus === 4" effect="dark" type="success">已完成</el-tag>
                          <el-tag v-else-if="item.orderStatus === 5" effect="dark" type="danger">已取消</el-tag>
                        </div>
                        <div>
                          <el-button
                            v-show="item.orderStatus === 0 || item.orderStatus === 1"
                            type="warning"
                            :loading="cancelLoading"
                            @click="handlePetCancel(item.orderNo)"
                          >
                            取消订单
                          </el-button>
                          <el-button
                            v-show="item.orderStatus === 3"
                            type="primary"
                            :loading="completedLoading"
                            @click="handlePetCompleted(item.orderNo)"
                          >
                            完成订单
                          </el-button>
                          <RouterLink :to="`/customer/visitor-toall/petDetail?id=${item.petId}`">
                            <el-button v-show="item.orderStatus === 4 || item.orderStatus === 5" type="success">
                              再次购买
                            </el-button>
                          </RouterLink>
                        </div>
                      </div>
                    </template>
                    <div class="two-side">
                      <div>{{ item.petName }}</div>
                      <div class="price">￥{{ item.petPrice }}</div>
                    </div>
                    <div class="two-side">
                      <div>订单号</div>
                      <div>{{ item.orderNo }}</div>
                    </div>
                    <div class="two-side">
                      <div>下单时间</div>
                      <div>{{ item.orderTime }}</div>
                    </div>
                  </el-card>
                </el-col>
              </el-row>
            </el-card>
          </template>
          <el-empty v-else description="暂无订单" />
        </el-tab-pane>
      </el-tabs>
    </el-tab-pane>
    <el-tab-pane label="宠物用品订单">
      <el-tabs v-model="goodsStatus" type="card">
        <el-tab-pane v-for="tab in orderTabs" :key="tab.name" :label="tab.label" :name="tab.name">
          <div class="search-part">
            <el-input v-model="orderNo" placeholder="请输入订单号搜索" clearable />
            <el-button icon="Search" type="primary" @click="goodsOrderNoSearch">搜索</el-button>
          </div>
          <template v-if="goodsStatusList[tab.name] && goodsStatusList[tab.name].length > 0">
            <el-card v-for="item in goodsStatusList[tab.name]" :key="item.id">
              <template #header>
                <RouterLink :to="`/customer/visitor-toall/petShopDetail?id=${item.shopId}`" class="link shop-link">
                  <span>{{ item.shopName }}</span>
                  <el-icon><ArrowRight /></el-icon>
                </RouterLink>
              </template>
              <el-row :gutter="24">
                <el-col :span="5">
                  <img :src="item.goodsImg" alt="goods" class="goods-img" />
                </el-col>
                <el-col :span="19">
                  <el-card>
                    <template #header>
                      <div class="two-side">
                        <div>
                          <span>订单信息&nbsp;</span>
                          <el-tag v-if="item.orderStatus === 0" effect="dark" type="warning">待付款</el-tag>
                          <el-tag v-else-if="item.orderStatus === 1" effect="dark" type="warning">待接单</el-tag>
                          <el-tag v-else-if="item.orderStatus === 2" effect="dark" type="primary">派送中</el-tag>
                          <el-tag v-else-if="item.orderStatus === 3" effect="dark" type="success">已送达</el-tag>
                          <el-tag v-else-if="item.orderStatus === 4" effect="dark" type="success">已完成</el-tag>
                          <el-tag v-else-if="item.orderStatus === 5" effect="dark" type="danger">已取消</el-tag>
                        </div>
                        <div>
                          <el-button
                            v-show="item.orderStatus === 0 || item.orderStatus === 1"
                            type="warning"
                            :loading="cancelLoading"
                            @click="handleGoodsCancel(item.orderNo)"
                          >
                            取消订单
                          </el-button>
                          <el-button
                            v-show="item.orderStatus === 3"
                            type="primary"
                            :loading="completedLoading"
                            @click="handleGoodsCompleted(item.orderNo)"
                          >
                            完成订单
                          </el-button>
                        </div>
                      </div>
                    </template>
                    <div class="two-side">
                      <div>{{ item.goodsName }}</div>
                      <div>￥{{ item.goodsPrice }} × {{ item.quantity }}</div>
                      <div class="price">￥{{ item.totalPrice }}</div>
                    </div>
                    <div class="two-side">
                      <div>订单号</div>
                      <div>{{ item.orderNo }}</div>
                    </div>
                    <div class="two-side">
                      <div>下单时间</div>
                      <div>{{ item.orderTime }}</div>
                    </div>
                  </el-card>
                </el-col>
              </el-row>
            </el-card>
          </template>
          <el-empty v-else description="暂无订单" />
        </el-tab-pane>
      </el-tabs>
    </el-tab-pane>
  </el-tabs>

  <el-dialog
    v-model="searchPetVisible"
    title="订单信息"
    :close-on-click-modal="false"
    width="500px"
    align-center
    :show-close="false"
  >
    <el-descriptions :column="1" border>
      <el-descriptions-item label="订单号">{{ searchPetObj.orderNo }}</el-descriptions-item>
      <el-descriptions-item label="订单状态">
        <el-tag v-if="searchPetObj.orderStatus === 0" effect="dark" type="warning">待付款</el-tag>
        <el-tag v-else-if="searchPetObj.orderStatus === 1" effect="dark" type="warning">待接单</el-tag>
        <el-tag v-else-if="searchPetObj.orderStatus === 2" effect="dark" type="primary">派送中</el-tag>
        <el-tag v-else-if="searchPetObj.orderStatus === 3" effect="dark" type="success">已送达</el-tag>
        <el-tag v-else-if="searchPetObj.orderStatus === 4" effect="dark" type="success">已完成</el-tag>
        <el-tag v-else-if="searchPetObj.orderStatus === 5" effect="dark" type="danger">已取消</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="下单时间">{{ searchPetObj.orderTime }}</el-descriptions-item>
      <el-descriptions-item label="宠物名称">{{ searchPetObj.petName }}</el-descriptions-item>
      <el-descriptions-item label="宠物图片">
        <el-image
          :src="searchPetObj.petImg"
          fit="cover"
          :preview-teleported="true"
          :preview-src-list="[searchPetObj.petImg]"
          class="pet-img"
        />
      </el-descriptions-item>
      <el-descriptions-item label="价格">
        <span class="price">￥{{ searchPetObj.petPrice }}</span>
      </el-descriptions-item>
      <el-descriptions-item label="宠物店昵称">{{ searchPetObj.shopName }}</el-descriptions-item>
    </el-descriptions>
    <template #footer>
      <el-button type="warning" @click="searchPetVisible = false">关闭</el-button>
    </template>
  </el-dialog>

  <el-dialog
    v-model="searchGoodsVisible"
    title="订单信息"
    :close-on-click-modal="false"
    width="500px"
    align-center
    :show-close="false"
  >
    <el-descriptions :column="1" border>
      <el-descriptions-item label="订单号">{{ searchGoodsObj.orderNo }}</el-descriptions-item>
      <el-descriptions-item label="订单状态">
        <el-tag v-if="searchGoodsObj.orderStatus === 0" effect="dark" type="warning">待付款</el-tag>
        <el-tag v-else-if="searchGoodsObj.orderStatus === 1" effect="dark" type="warning">待接单</el-tag>
        <el-tag v-else-if="searchGoodsObj.orderStatus === 2" effect="dark" type="primary">派送中</el-tag>
        <el-tag v-else-if="searchGoodsObj.orderStatus === 3" effect="dark" type="success">已送达</el-tag>
        <el-tag v-else-if="searchGoodsObj.orderStatus === 4" effect="dark" type="success">已完成</el-tag>
        <el-tag v-else-if="searchGoodsObj.orderStatus === 5" effect="dark" type="danger">已取消</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="下单时间">{{ searchGoodsObj.orderTime }}</el-descriptions-item>
      <el-descriptions-item label="商品名称">{{ searchGoodsObj.goodsName }}</el-descriptions-item>
      <el-descriptions-item label="商品图片">
        <el-image
          :src="searchGoodsObj.goodsImg"
          fit="cover"
          :preview-teleported="true"
          :preview-src-list="[searchGoodsObj.goodsImg]"
          class="goods-img"
        />
      </el-descriptions-item>
      <el-descriptions-item label="商品单价">
        <span class="price">￥{{ searchGoodsObj.goodsPrice }}</span>
      </el-descriptions-item>
      <el-descriptions-item label="购买数量">{{ searchGoodsObj.quantity }}</el-descriptions-item>
      <el-descriptions-item label="商品总价">
        <span class="price">￥{{ searchGoodsObj.totalPrice }}</span>
      </el-descriptions-item>
      <el-descriptions-item label="宠物店昵称">{{ searchGoodsObj.shopName }}</el-descriptions-item>
    </el-descriptions>
    <template #footer>
      <el-button type="warning" @click="searchGoodsVisible = false">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { listPetOrdersApi, cancelPetOrdersApi, completedPetOrdersApi } from '@/api/customer/petOrders'
import { listGoodsOrdersApi, cancelGoodsOrdersApi, completedGoodsOrdersApi } from '@/api/customer/GoodsOrders'
import { ElMessage, ElMessageBox } from 'element-plus'

const cancelLoading = ref(false)
const completedLoading = ref(false)

const orderNo = ref()

const petStatus = ref(6)
const goodsStatus = ref(6)

const orderTabs = [
  { label: '全部', name: 6 },
  { label: '待付款', name: 0 },
  { label: '待接单', name: 1 },
  { label: '派送中', name: 2 },
  { label: '已送达', name: 3 },
  { label: '已完成', name: 4 },
  { label: '已取消', name: 5 },
]

const searchPetVisible = ref(false)
const searchPetObj = ref({})
const petOrderNoSearch = () => {
  const found = petStatusList.value[6]?.find((item) => item.orderNo === orderNo.value)
  if (!found) return
  searchPetObj.value = found
  searchPetVisible.value = true
}

const searchGoodsVisible = ref(false)
const searchGoodsObj = ref({})
const goodsOrderNoSearch = () => {
  const found = goodsStatusList.value[6]?.find((item) => item.orderNo === orderNo.value)
  if (!found) return
  searchGoodsObj.value = found
  searchGoodsVisible.value = true
}

const petStatusList = ref([])

const allPetSearch = async () => {
  const res = await listPetOrdersApi()
  if (res.code === 200) {
    const allData = res.data
    const arr = [[], [], [], [], [], [], []]
    allData.forEach((item) => {
      if (item.orderStatus >= 0 && item.orderStatus <= 5) {
        arr[item.orderStatus].push(item)
      }
    })
    arr[6] = allData
    petStatusList.value = arr
  }
}

const goodsStatusList = ref([])

const allGoodsSearch = async () => {
  const res = await listGoodsOrdersApi()
  if (res.code === 200) {
    const allData = res.data
    const arr = [[], [], [], [], [], [], []]
    allData.forEach((item) => {
      if (item.orderStatus >= 0 && item.orderStatus <= 5) {
        arr[item.orderStatus].push(item)
      }
    })
    arr[6] = allData
    goodsStatusList.value = arr
  }
}

const handlePetCancel = (orderNo) => {
  if (cancelLoading.value) return
  cancelLoading.value = true
  ElMessageBox.confirm('确认要取消该订单吗？', '提醒', {
    confirmButtonText: '确认取消',
    cancelButtonText: '我再想想',
    type: 'warning',
  })
    .then(async () => {
      try {
        const res = await cancelPetOrdersApi(orderNo)
        if (res.code === 200) {
          ElMessage.success('订单已取消')
          allPetSearch()
        }
      } finally {
        cancelLoading.value = false
      }
    })
    .catch(() => {
      cancelLoading.value = false
    })
}

const handleGoodsCancel = (orderNo) => {
  if (cancelLoading.value) return
  cancelLoading.value = true
  ElMessageBox.confirm('确认要取消该订单吗？', '提醒', {
    confirmButtonText: '确认取消',
    cancelButtonText: '我再想想',
    type: 'warning',
  })
    .then(async () => {
      try {
        const res = await cancelGoodsOrdersApi(orderNo)
        if (res.code === 200) {
          ElMessage.success('订单已取消')
          allGoodsSearch()
        }
      } finally {
        cancelLoading.value = false
      }
    })
    .catch(() => {
      cancelLoading.value = false
    })
}

const handlePetCompleted = (orderNo) => {
  if (completedLoading.value) return
  completedLoading.value = true
  ElMessageBox.confirm('该订单是否已完成？', '提醒', {
    confirmButtonText: '是',
    cancelButtonText: '否',
    type: 'warning',
  })
    .then(async () => {
      try {
        const res = await completedPetOrdersApi(orderNo)
        if (res.code === 200) {
          ElMessage.success('订单已完成')
          allPetSearch()
        }
      } finally {
        completedLoading.value = false
      }
    })
    .catch(() => {
      completedLoading.value = false
    })
}

const handleGoodsCompleted = (orderNo) => {
  if (completedLoading.value) return
  completedLoading.value = true
  ElMessageBox.confirm('该订单是否已完成？', '提醒', {
    confirmButtonText: '是',
    cancelButtonText: '否',
    type: 'warning',
  })
    .then(async () => {
      try {
        const res = await completedGoodsOrdersApi(orderNo)
        if (res.code === 200) {
          ElMessage.success('订单已完成')
          allGoodsSearch()
        }
      } finally {
        completedLoading.value = false
      }
    })
    .catch(() => {
      completedLoading.value = false
    })
}

onMounted(() => {
  allPetSearch()
  allGoodsSearch()
})
</script>

<style scoped>
.shop-link {
  color: var(--primary-color);
  cursor: pointer;
  font-size: var(--font-size-lg);
}
.goods-img,
.pet-img {
  height: 180px;
  border-radius: var(--border-radius-lg);
}
.two-side {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.price {
  color: var(--danger-color);
  font-size: var(--font-size-lg);
  font-weight: bold;
}
.search-part {
  display: flex;
  gap: var(--spacing-xl);
  margin-bottom: var(--spacing-md);
}
</style>
