<script setup>
import { Edit, Delete } from '@element-plus/icons-vue'
import { ref } from 'vue'

//用户搜索时的信息
const OrderId = ref('')

//文章分类数据模型
const categorys = ref([
  {
    categoryId: 3,
    categoryName: '',
    createTime: '2023-09-02 12:06:59',
    updateTime: '2023-09-02 12:06:59',
  },
  {
    categoryId: 4,
    categoryName: '美食',
    createTime: '2023-09-02 12:06:59',
    updateTime: '2023-09-02 12:06:59',
  },
])
const goods = ref([
  {
    goodId: 1,
    goodCategoryId: 1,
    goodImg: null,
    goodName: null,
    goodPoint: 0,
    goodDesc: null,
    goodCount: 0,
    createTime: '2023-12-14T13:11:37.000+00:00',
    updateTime: '2023-12-14T13:11:37.000+00:00',
    isDeleted: 0,
  },
])

const pageNum = ref(1) //当前页
const total = ref(20) //总条数
const pageSize = ref(4) //每页条数
//当每页条数发生了变化，调用此函数
const onSizeChange = (size) => {
  pageSize.value = size
  goodShowList()
}
//当前页码发生变化，调用此函数
const onCurrentChange = (num) => {
  pageNum.value = num
  goodShowList()
}

//回显文章分类
import {
  giftCategoryService,
  giftListService,
  goodListService,
  goodInfoService,
} from '@/api/article.js'
const giftCategoryList = async () => {
  let result = await giftCategoryService()
  categorys.value = result.data
  console.log(categorys)
}
//搜索事件绑定
const onSearch = async () => {
  goodShowList()
}

const goodShowList = async () => {
  let params = {
    pageNum: pageNum.value,
    pageSize: pageSize.value,
    goodName: gName.value ? gName.value : null,
  }
  let result = await goodListService(params)
  console.log(result)

  goods.value = result.data.items
  total.value = result.data.total

  for (let i = 0; i < goods.value.length; i++) {
    let good = goods.value[i]
    for (let j = 0; j < categorys.value.length; j++) {
      if (good.goodCategoryId == categorys.value[j].categoryId) {
        good.categoryName = categorys.value[j].categoryName
        console.log(goods.categoryName)
      }
    }
  }
}
giftCategoryList()
goodShowList()
</script>
<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <span>商品订单管理</span>
      </div>
    </template>
    <el-form inline>
      <el-form-item label="订单id">
        <el-input v-model="OrderId" placeholder="请输入订单id" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSearch">搜索</el-button>
        <el-button @click="OrderId = ''">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="goods" style="width: 100%">
      <el-table-column label="序号" width="100" type="index"> </el-table-column>
      <el-table-column label="商品id" prop="goodId"></el-table-column>
      <el-table-column label="商品名称" prop="goodName"></el-table-column>
      <el-table-column label="分类名称" prop="categoryName"></el-table-column>
      <el-table-column label="图片">
        <template v-slot="{ row }">
          <el-image
            style="width: 30px; height: 30px"
            :src="row.goodImg"
            :preview-src-list="[row.goodImg]"
            :key="row.goodId"
          >
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline"></i>
            </div>
          </el-image> </template
      ></el-table-column>
      <el-table-column label="所需积分" prop="goodPoint"></el-table-column>
      <el-table-column label="所剩数量" prop="goodCount"></el-table-column>
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <el-button
            :icon="Edit"
            circle
            plain
            type="primary"
            @click="showDialog(row)"
          ></el-button>
          <el-button
            :icon="Delete"
            circle
            plain
            type="danger"
            @click="deleteCategory(row)"
          ></el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="没有数据" />
      </template>
    </el-table>

    <!-- 添加分类弹窗 -->
    <el-dialog v-model="dialogVisible" :title="title" width="30%">
      <el-form
        :model="categoryModel"
        :rules="rules"
        label-width="100px"
        style="padding-right: 30px"
      >
        <el-form-item label="物品名称" prop="categoryName">
          <el-input
            v-model="categoryModel.categoryName"
            minlength="1"
            maxlength="10"
          ></el-input>
        </el-form-item>
        <el-form-item label="分类别名" prop="categoryAlias">
          <el-input
            v-model="categoryModel.categoryAlias"
            minlength="1"
            maxlength="15"
          ></el-input>
        </el-form-item>
        <el-form-item label="分类别名" prop="categoryAlias">
          <el-input
            v-model="categoryModel.categoryAlias"
            minlength="1"
            maxlength="15"
          ></el-input>
        </el-form-item>
        <el-form-item label="分类别名" prop="categoryAlias">
          <el-input
            v-model="categoryModel.categoryAlias"
            minlength="1"
            maxlength="15"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button
            type="primary"
            @click="title == '添加分类' ? addCategory() : updateCategory()"
          >
            确认
          </el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 分页条 -->
    <el-pagination
      v-model:current-page="pageNum"
      v-model:page-size="pageSize"
      :page-sizes="[3, 5, 10, 15]"
      layout="jumper, total, sizes, prev, pager, next"
      background
      :total="total"
      @size-change="onSizeChange"
      @current-change="onCurrentChange"
      style="margin-top: 20px; justify-content: flex-end"
    />
  </el-card>
</template>

<style lang="scss" scoped>
.page-container {
  min-height: 100%;
  box-sizing: border-box;

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
