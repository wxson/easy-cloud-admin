<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.no" placeholder="订单编号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.currencyType" placeholder="货币类型" clearable style="width: 120px" class="filter-item">
        <el-option v-for="item in currencyType" :key="item.code" :label="item.desc" :value="item.code" />
      </el-select>
      <el-select v-model="listQuery.payStatus" placeholder="支付状态" clearable style="width: 120px" class="filter-item">
        <el-option v-for="item in payStatus" :key="item.code" :label="item.desc" :value="item.code" />
      </el-select>
      <el-select v-model="listQuery.orderStatus" placeholder="订单状态" clearable class="filter-item" style="width: 120px">
        <el-option v-for="item in orderStatus" :key="item.code" :label="item.desc" :value="item.code" />
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="getList">
        查询
      </el-button>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="订单编码" width="240">
        <template slot-scope="scope">
          <span>{{ scope.row.no }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="商品名称">
        <template slot-scope="scope">
          <span>{{ scope.row.goodsName }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="支付货币" width="80px">
        <template slot-scope="scope">
          <span>{{ enumsFilter(scope.row.currencyType, currencyType) }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="订单金额" width="80px">
        <template slot-scope="scope">
          <span>{{ scope.row.amount }}</span>
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="支付状态" width="110">
        <template slot-scope="{row}">
          <el-tag type="success">
            {{ enumsFilter(row.payStatus, payStatus) }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="订单状态" width="110">
        <template slot-scope="{row}">
          <el-tag type="success">
            {{ enumsFilter(row.orderStatus, orderStatus) }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="创建人" width="80px">
        <template slot-scope="scope">
          <span>{{ scope.row.creatorAt }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="创建时间" width="180px">
        <template slot-scope="scope">
          <span>{{ scope.row.createAt }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="120">
        <template slot-scope="scope">
          <router-link :to="'/example/edit/'+scope.row.id">
            <el-button type="primary" size="small" icon="el-icon-edit">
              编辑
            </el-button>
          </router-link>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :current.sync="listQuery.current" :size.sync="listQuery.size" @pagination="getList" />
  </div>
</template>

<script>
import { page } from '@/api/order'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'OrderList',
  components: { Pagination },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        currencyType: null,
        payStatus: null,
        orderStatus: null,
        current: 1,
        size: 10
      },
      // 货币类型
      currencyType: [
        { code: 1, desc: '人民币' },
        { code: 2, desc: '金币' },
        { code: 3, desc: '钻石' },
        { code: 4, desc: '点券' }
      ],
      // 支付状态
      payStatus: [
        { code: 1, desc: '待支付' },
        { code: 2, desc: '已支付部分' },
        { code: 3, desc: '已支付' }
      ],
      // 订单状态
      orderStatus: [
        { code: 1, desc: '新订单' },
        { code: 2, desc: '出库失败' },
        { code: 3, desc: '已确认' },
        { code: 4, desc: '已付款' },
        { code: 5, desc: '已发货' },
        { code: 6, desc: '已收货' },
        { code: 7, desc: '已完成' },
        { code: 8, desc: '已取消' },
        { code: 9, desc: '售后中' }
      ]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      page(this.listQuery).then(response => {
        this.list = response.data.records
        this.total = response.data.total
        this.listLoading = false
      })
    },
    enumsFilter(type, list) {
      for (const element of list) {
        if (type === element.code) {
          return element.desc
        }
      }
    }
  }
}
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>
