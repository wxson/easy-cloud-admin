<template>
  <div class="app-container">
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="商品编码" width="190">
        <template slot-scope="scope">
          <span>{{ scope.row.no }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="商品名称">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="售价" width="80px">
        <template slot-scope="scope">
          <span>{{ scope.row.salesPrice }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="原价" width="80px">
        <template slot-scope="scope">
          <span>{{ scope.row.originalPrice }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="采购价" width="80px">
        <template slot-scope="scope">
          <span>{{ scope.row.purchasePrice }}</span>
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

      <el-table-column class-name="status-col" label="状态" width="110">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ row.status === 0 ? '启用' : '禁用' }}
          </el-tag>
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
import { page } from '@/api/goods'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'GoodsList',
  components: { Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = {
        0: 'success',
        1: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        current: 1,
        size: 10
      }
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
