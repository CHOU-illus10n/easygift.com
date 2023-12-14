<script setup>
import { Edit, Delete } from '@element-plus/icons-vue'

import { ref } from 'vue'

//文章分类数据模型
const categorys = ref([
  {
    categoryId: 3,
    "categoryName": "",
    "createTime": '2023-09-02 12:06:59',
    "updateTime": '2023-09-02 12:06:59',
  },
  {
    categoryId: 4,
    "categoryName": '美食',
    "createTime": '2023-09-02 12:06:59',
    "updateTime": '2023-09-02 12:06:59',
  },
])

//用户搜索时选中的分类id
const categoryId = ref('')

//用户搜索时选中的发布状态
const state = ref('')

//文章列表数据模型
const articles = ref([
  {
    giftId: '2',
    userId: '1',
    giftName: null,
    description: null,
    createTime: '2023-12-13T16:06:55',
    state: null,
  },
])

//分页条数据模型
const pageNum = ref(1) //当前页
const total = ref(20) //总条数
const pageSize = ref(6) //每页条数

//当每页条数发生了变化，调用此函数
const onSizeChange = (size) => {
  pageSize.value = size
  giftList()
}
//当前页码发生变化，调用此函数
const onCurrentChange = (num) => {
  pageNum.value = num
  giftList()
}

//回显文章分类
import {
  articleCategoryListService,
  giftListService,
} from '@/api/article.js'
const articleCategoryList = async () => {
  let result = await articleCategoryListService()
  categorys.value = result.data
  console.log(categorys);
}

const giftList = async () => {
  let params = {
    pageNum: pageNum.value,
    pageSize: pageSize.value,
    categoryId: categoryId.value ,
    state: state.value 
  }
  let result = await giftListService(params)

  //渲染视图 赋值给数据模型
  total.value = result.data.total
  articles.value = result.data.items

  //处理数据,给数据模型扩展一个属性categoryName,分类名称
  for (let i = 0; i < articles.value.length; i++) {
    let article = articles.value[i]
    for (let j = 0; j < categorys.value.length; j++) {
      if (article.categoryId == categorys.value[j].id) {
        article.categoryName = categorys.value[j].categoryName
      }
    }
  }
}
//调用
articleCategoryList()
giftList()

//搜索
const onSearch = async() => {
  giftList()
}


</script>
<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <span>物品审核</span>
      </div>
    </template>
    <!-- 搜索表单 -->
    <el-form inline>
      <el-form-item label="物品分类：">
        <el-select placeholder="请选择" v-model="categoryId" value-key="categoryName">
          <el-option
            v-for="c in categorys"
            :key="c.categoryId"
            :label="c.categoryName"
            :value="c.categoryId"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="审核状态：">
        <el-select placeholder="请选择" v-model="state">
          <el-option label="未审核" :value="0"></el-option>
          <el-option label="已审核" :value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSearch">搜索</el-button>
        <el-button @click=";(categoryId = ''), (state = '')">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 文章列表 -->
    <el-table :data="articles" style="width: 100%">
      <el-table-column label="物品名称" prop="giftId"></el-table-column>
      <el-table-column label="发布人" prop="userId"></el-table-column>
      <el-table-column label="发表时间" prop="createTime"> </el-table-column>
      <el-table-column label="状态" prop="state"
        ><template v-slot="{ row }">
          <span :style="{ color: row.state === 0 ? 'red' : 'green' }">
            {{ row.state === 0 ? '未审核' : '已审核' }}
          </span>
        </template></el-table-column
      >
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <el-button :icon="Edit" circle plain type="primary"></el-button>
          <el-button :icon="Delete" circle plain type="danger"></el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="没有数据" />
      </template>
    </el-table>
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

    <!-- 抽屉 -->
    <el-drawer
      v-model="visibleDrawer"
      title="添加文章"
      direction="rtl"
      size="50%"
    >
      添加文章表单
      <el-form :model="articleModel" label-width="100px">
        <el-form-item label="文章标题">
          <el-input
            v-model="articleModel.title"
            placeholder="请输入标题"
          ></el-input>
        </el-form-item>
        <el-form-item label="文章分类">
          <el-select placeholder="请选择" v-model="articleModel.categoryId" >
            <el-option
              v-for="c in categorys"
              :key="c.cId"
              :label="c.categoryName"
              :value="c.cId"
            >
            </el-option>
          </el-select>
        </el-form-item>
        
      </el-form>
    </el-drawer>
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

/* 抽屉样式 */
.avatar-uploader {
  :deep() {
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }
  

    .el-upload {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
    }

    .el-upload:hover {
      border-color: var(--el-color-primary);
    }

    .el-icon.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      text-align: center;
    }
  }
}

.editor {
  width: 100%;

  :deep(.ql-editor) {
    min-height: 200px;
  }
}
</style>
