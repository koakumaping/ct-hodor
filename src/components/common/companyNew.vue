<template>
  <div>
    <ctForm>
      <ctFormLine label="名称">
        <ctInput v-model="item.company"></ctInput>
      </ctFormLine>
      <ctFormLine label="类型">
        <ctSelect v-model="item.type">
          <ctOption v-for="item in companyList" :key="item.id" :label="item.value" :value="item.key"></ctOption>
        </ctSelect>
      </ctFormLine>
      <ctFormLine label="电话">
        <ctInput v-model="item.telephone"></ctInput>
      </ctFormLine>
      <ctFormLine label="网址">
        <ctInput v-model="item.http"></ctInput>
      </ctFormLine>
      <ctFormLine label="地址">
        <ctInput v-model="item.address"></ctInput>
      </ctFormLine>
      <ctFormLine label="区域">
        <span>{{item.area}}</span>
        <span class="btn btn-small btn-normal" v-on:click="showArea">{{getText}}</span>
      </ctFormLine>
      <ctFormLine label="所在行业">
        <ctInput v-model="item.part"></ctInput>
      </ctFormLine>
      <ctFormLine label="所在行业">
        <ctInput v-model="item.part"></ctInput>
      </ctFormLine>
      <ctFormLine label="备注">
        <ctInput v-model="item.remarks" type="textarea"></ctInput>
      </ctFormLine>
    </ctForm>
    <div class="ct-tabs">
      <span class="ct-tabs-item"
        :class="{ active: current === 0 }"
        v-on:click="changeTab(0)"
      >银行信息</span>
      <span class="ct-tabs-item"
        :class="{ active: current === 1 }"
        v-on:click="changeTab(1)"
      >联系人</span>
    </div>

    <ctTable :theadList="bankTheadList" :list="bankList" v-show="current === 0">
      <template scope="props">
        <ctTableTd label="银行">
          <ctInput v-model="props.row.name" width="100%"></ctInput>
        </ctTableTd>
        <ctTableTd label="分行">
          <ctInput v-model="props.row.branch" width="100%"></ctInput>
        </ctTableTd>
        <ctTableTd label="支行">
          <ctInput v-model="props.row.subBranch" width="100%"></ctInput>
        </ctTableTd>
        <ctTableTd label="账号">{{holder}}</ctTableTd>
        <ctTableTd label="开户人">
          <ctInput v-model="props.row.name" width="100%"></ctInput>
        </ctTableTd>
        <ctTableTd label="操作">
          <span class="btn btn-small btn-reserve" v-on:click="delBank(props.index)">删除</span>
        </ctTableTd>
      </template>
      <div class="table-action" slot="footer">
        <span class="btn btn-small" v-on:click="addBank">增加银行信息</span>
      </div>
    </ctTable>

    <ctTable :theadList="personTheadList" :list="personList" v-show="current === 1">
      <template scope="props">
        <ctTableTd label="姓名">
          <ctInput v-model="props.row.name" width="100%"></ctInput>
        </ctTableTd>
        <ctTableTd label="性别">
          <ctSelect v-model="props.row.sex" width="4em">
            <ctOption v-for="item in sexList" :key="item.id" :label="item.value" :value="item.key"></ctOption>
          </ctSelect>
        </ctTableTd>
        <ctTableTd label="职务">
          <ctInput v-model="props.row.position" width="100%"></ctInput>
        </ctTableTd>
        <ctTableTd label="电话">
          <ctInput v-model="props.row.telephone" width="100%"></ctInput>
        </ctTableTd>
        <ctTableTd label="邮件">
          <ctInput v-model="props.row.mail" width="100%"></ctInput>
        </ctTableTd>
        <ctTableTd label="备注">
          <ctInput v-model="props.row.remarks" width="100%"></ctInput>
        </ctTableTd>
        <ctTableTd label="操作">
          <span class="btn btn-small btn-reserve" v-on:click="delPerson(props.index)">删除</span>
        </ctTableTd>
      </template>
      <div class="table-action" slot="footer">
        <span class="btn btn-small" v-on:click="addPerson">增加联系人</span>
      </div>
    </ctTable>

    <span class="btn btn-normal btn-small" v-on:click="save">保存</span>
    <window :show.sync="areaWindow" title="选择区域">
      <tree :data="baseData" v-on:on-list-change="setList"></tree>
      <span class="btn btn-normal" v-on:click="saveArea">确定</span>
      <span class="btn btn-reserve" v-on:click="hideArea">取消</span>
    </window>
  </div>
</template>

<script>
import tree from '@/components/tree/index'

export default {
  name: 'companyNew',
  components: {
    tree,
  },
  computed: {
    getText() {
      return this.item.area ? '更改' : '选择'
    },
    holder() {
      return this.item.company ? this.item.company : '未填写'
    },
  },
  data() {
    return {
      baseData: this.$util.clone(this.$store.getters.areaList),
      submiting: false,
      areaWindow: false,
      current: 0,
      areaList: [],
      defaultItem: {
        telephone: '',
        company: '',
        type: '',
        area: '',
        http: '',
        address: '',
        part: '',
        remarks: '',
      },
      item: {},
      bankTheadList: [
        {
          name: '银行',
          width: '150px',
        },
        {
          name: '分行',
          width: '150px',
        },
        {
          name: '支行',
          width: '150px',
        },
        {
          name: '账号',
          width: '200px',
        },
        {
          name: '开户人',
        },
        {
          name: '操作',
          width: '70px',
        },
      ],
      bankList: [],
      defaultBankItem: {
        name: '',
        branch: '',
        subBranch: '',
        code: '',
      },
      personTheadList: [
        {
          name: '姓名',
        },
        {
          name: '性别',
          width: '4em',
        },
        {
          name: '职务',
        },
        {
          name: '电话',
        },
        {
          name: '邮件',
        },
        {
          name: '备注',
        },
        {
          name: '操作',
        },
      ],
      personList: [],
      defaultPersonItem: {
        company: '',
        name: '',
        sex: '男',
        position: '',
        telephone: '',
        email: '',
        remarks: '',
      },
      companyList: [
        {
          key: '供应商',
          value: '供应商',
        },
        {
          key: '合作客户',
          value: '合作客户',
        },
      ],
      sexList: [
        {
          key: '男',
          value: '男',
        },
        {
          key: '女',
          value: '女',
        },
      ],
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.item = this.$util.clone(this.defaultItem)
      this.bankList = []
      this.personList = []
      this.addBank()
      this.addPerson()
    },
    save() {
      const addCompany = (element, index, array) => {
        console.log(element, index, array)
        array[index].company = this.item.company
      }
      this.personList.forEach(addCompany)
      this.$emit('save', this.personList)
      this.init()
    },
    showArea() {
      this.areaWindow = true
    },
    hideArea() {
      this.areaWindow = false
    },
    saveArea() {
      if (this.areaList.length === 0) {
        this.$show('请选择区域！')
        return false
      }

      if (this.areaList.length === 1) {
        this.item.area = this.areaList[0].replace(/,/g, '-')
      } else {
        this.$show('只能选择一个区域！')
        return false
      }

      this.areaWindow = false
    },
    onCheckChange(data) {
      console.log(data)
      this.areaList = data
    },
    addBank() {
      this.bankList.push(this.$util.clone(this.defaultBankItem))
    },
    delBank(index) {
      console.log(index)
      this.bankList.splice(index, 1)
    },
    addPerson() {
      this.personList.push(this.$util.clone(this.defaultPersonItem))
    },
    delPerson(index) {
      console.log(index)
      this.personList.splice(index, 1)
    },
    changeTab(index) {
      this.current = Number(index)
    },
    setList(list) {
      console.log(list)
      this.areaList = list
    },
  },
}
</script>
