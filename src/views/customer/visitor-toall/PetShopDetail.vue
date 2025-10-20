<template>
  <el-card shadow="hover">
    <template #header>
      <span class="shop-name">{{ shopDetail.nickname }}</span>
    </template>
    <el-row :gutter="24">
      <el-col :span="5" class="part-avatar">
        <img :src="shopDetail.avatar" alt="shop" class="img-shop" />
      </el-col>
      <el-col :span="11">
        <div>
          <span>联系电话：{{ shopDetail.phone }}</span>
        </div>
        <div>
          <span>邮箱：{{ shopDetail.email }}</span>
        </div>
        <div>
          <span>
            宠物店地址：{{
              [shopDetail.provinceCode, shopDetail.cityCode, shopDetail.districtCode]
                .map((code) => codeToText[code])
                .filter(Boolean)
                .join(' ')
            }}&nbsp;{{ shopDetail.detailAddress }}
          </span>
        </div>
        <div>
          <el-divider content-position="left">宠物店简介</el-divider>
          <p>{{ shopDetail.introduce }}</p>
        </div>
      </el-col>
      <el-col :span="8">
        <MapContainer
          v-if="shopDetail.provinceCode && shopDetail.cityCode && shopDetail.districtCode"
          :code="[shopDetail.provinceCode, shopDetail.cityCode, shopDetail.districtCode]"
        />
        <el-empty v-else description="加载失败" />
      </el-col>
    </el-row>
  </el-card>

  <el-card shadow="hover">
    <template #header>
      <span>宠物信息</span>
    </template>
    <el-row :gutter="24">
      <el-col v-for="item in petState.petList" :key="item.id" :span="4" class="show-item">
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

    <el-pagination
      v-show="petState.total > 0"
      v-model:current-page="petState.pageNum"
      v-model:page-size="petState.pageSize"
      :total="petState.total"
      :page-sizes="[6, 12, 24, 48]"
      layout="total,sizes,prev,pager,next,jumper"
      @current-change="shopPetPage"
      @size-change="
        () => {
          petState.pageNum = 1
          shopPetPage()
        }
      "
    />
    <el-empty v-if="petState.total === 0" description="暂无宠物信息" />
  </el-card>

  <el-card shadow="hover">
    <template #header>
      <span>宠物用品信息</span>
    </template>
    <el-row :gutter="24">
      <el-col v-for="item in goodsState.goodsList" :key="item.id" :span="4" class="show-item">
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

    <el-pagination
      v-show="goodsState.total > 0"
      v-model:current-page="goodsState.pageNum"
      v-model:page-size="goodsState.pageSize"
      :total="goodsState.total"
      :page-sizes="[6, 12, 24, 48]"
      layout="total,sizes,prev,pager,next,jumper"
      @current-change="shopGoodsPage"
      @size-change="
        () => {
          goodsState.pageNum = 1
          shopGoodsPage()
        }
      "
    />
    <el-empty v-if="goodsState.total === 0" description="暂无宠物用品信息" />
  </el-card>

  <el-dialog
    v-model="dialogState.visible"
    width="600px"
    destroy-on-close
    :close-on-click-modal="false"
    align-center
    :show-close="false"
  >
    <template #header>
      <span class="dialog-title">宠物用品详情</span>
    </template>
    <el-row :gutter="24">
      <el-col :span="10">
        <img :src="dialogState.form.img" alt="goods" class="dialog-img-goods" />
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
import { codeToText } from 'element-china-area-data'
import { pagePetApi } from '@/api/customer/pet'
import { pageGoodsApi } from '@/api/customer/goods'
import { ElMessage } from 'element-plus'
import { joinCartApi } from '@/api/customer/cart'
import { useRoute } from 'vue-router'
import { detailPetShopApi } from '@/api/customer/petShop'
import { useAuthStore } from '@/stores'
import MapContainer from '@/components/MapContainer.vue'

const authStore = useAuthStore()
const route = useRoute()
const joinCartLoading = ref(false)

const petState = ref({
  pageNum: 1,
  pageSize: 6,
  total: 0,
  petList: [],
})

const goodsState = ref({
  pageNum: 1,
  pageSize: 6,
  total: 0,
  goodsList: [],
})

const dialogState = ref({
  visible: false,
  form: {},
})

const shopDetail = ref({})

const handleDetail = async () => {
  const shopId = route.query.id
  const res = await detailPetShopApi(shopId)
  if (res.code === 200) {
    shopDetail.value = res.data
  }
}

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

const shopPetPage = async () => {
  const shopId = route.query.id
  const res = await pagePetApi({ shopId }, petState.value.pageNum, petState.value.pageSize)
  if (res.code === 200) {
    petState.value.petList = res.data.list
    petState.value.total = res.data.total
  }
}

const shopGoodsPage = async () => {
  const shopId = route.query.id
  const res = await pageGoodsApi({ shopId }, goodsState.value.pageNum, goodsState.value.pageSize)
  if (res.code === 200) {
    goodsState.value.goodsList = res.data.list
    goodsState.value.total = res.data.total
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
  handleDetail()
  shopPetPage()
  shopGoodsPage()
})
</script>

<style scoped>
.shop-name {
  font-size: 30px;
  color: var(--primary-color);
  border-bottom: 2px solid var(--warning-color);
  padding-bottom: var(--spacing-sm);
}
.part-avatar {
  display: flex;
  align-items: center;
}
.img-shop {
  height: 240px;
  border-radius: var(--border-radius-xl);
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
.img-pet {
  height: 160px;
  border-radius: var(--border-radius-lg);
}
.two-side {
  display: flex;
  justify-content: space-between;
  align-items: center;
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
.dialog-img-goods {
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
.dialog-title {
  color: var(--primary-color);
  font-size: var(--font-size-xl);
}
</style>
