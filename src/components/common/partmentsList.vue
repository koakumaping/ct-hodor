<template>
  <fullscreen title="部门列表" width="600px" v-sync:visiable="visiable">
    <div class="warp">
      <tree :data="list" v-on:on-list-change="setList"></tree>
      <span class="btn btn-normal" @click="save">确定</span>
    </div>
  </fullscreen>
</template>

<script>
export default {
  name: 'partmentsList',
  data() {
    return {
      visiable: false,
      list: [],
      selectList: [],
    }
  },
  mounted() {
    // this.getList()
  },
  methods: {
    getList() {
      const sucessCallback = (response) => {
        console.log('部门列表', response)
        this.list = response.data.partmentsList
      }

      const failCallback = (response) => {
        console.log(response)
      }
      this.$request('partmentList', {}, sucessCallback, failCallback)
    },
    setList(payload) {
      console.log(payload)
      this.selectList = payload
    },
    save() {
      this.$emit('on-change', this.selectList.toString())
      this.$nextTick(() => {
        this.visiable = false
      })
    },
  },
}
</script>
