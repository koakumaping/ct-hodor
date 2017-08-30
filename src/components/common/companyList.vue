<template>
  <div id="warp">
    <ctTable :list="list" :theadList="theadList" :loading="loading" :selection="true">
      <template scope="props">
        <ctTableTd label="客户名称">
          <span class="text-main pointer">
            {{props.row.company}}
          </span>
        </ctTableTd>
        <ctTableTd label="姓名">{{props.row.name}}</ctTableTd>
        <ctTableTd label="电话">{{props.row.telephone}}</ctTableTd>
        <ctTableTd label="职位">{{props.row.position}}</ctTableTd>
      </template>
    </ctTable>
    <pages
      v-show="list.length > 0"
      :perPage="perPage"
      :currentPage="currentPage"
      :total="total"
    ></pages>
    <span class="btn btn-normal btn-small" v-on:click="save">确定</span>
    <span class="btn btn-reserve btn-small" v-on:click="add">新增</span>
    <window :show.sync="companyNewWindow" title="新增联系客户单位">
      <companyNew v-on:save="saveCompanyList"></companyNew>
    </window>
  </div>
</template>

<script>
import companyNew from './companyNew'

export default {
  name: 'companyList',
  components: {
    companyNew,
  },
  data() {
    return {
      selectIndexList: [],
      defaultList: [
        {
          isSelected: false,
          company: 'lala公司',
          name: '扎昂是',
          telephone: '123457697012',
          position: '前台',
        },
        {
          isSelected: false,
          company: '折扣价公司',
          name: '阿斯顿',
          telephone: '24873842',
          position: '后台',
        },
      ],
      theadList: [
        {
          name: '客户名称',
        },
        {
          name: '姓名',
        },
        {
          name: '电话',
        },
        {
          name: '职位',
        },
      ],
      list: [],
      sex: 0,
      sexList: [
        {
          key: 0,
          value: '男',
        },
        {
          key: 1,
          value: '女',
        },
      ],
      perPage: Number(window.localStorage.getItem('perPage')) || this.$perPage,
      currentPage: Number(this.$route.query.page) || 1,
      total: 0,
      shName: '',
      companyNewWindow: false,
      loading: false,
    }
  },
  created() {
    this.initData()
    this.total = this.defaultList.length
  },
  methods: {
    initData() {
      this.list = this.$util.clone(this.defaultList)
    },
    getList() {
      console.log('getList')
    },
    selectedList() {
      const selectIndexList = []
      this.list.forEach((element, index) => {
        if (element.checked) {
          selectIndexList.push(index)
        }
      })

      return selectIndexList
    },
    save() {
      const list = this.selectedList()
      if (list.length === 0) {
        this.$show('请选择')
        return false
      }
      if (list.length > 1) {
        this.$show('只能选择一项')
        return false
      }
      this.$emit('save', this.list[list[0]], list[0])
    },
    add() {
      this.companyNewWindow = true
    },
    saveCompanyList(list) {
      this.companyNewWindow = false
      this.list = [...this.list, ...list]
    },
  },
}
</script>