<template>
  <div class="ct-form-search clear">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'ctFormSearch',
}
</script>

<style lang="stylus">
.ct-form-search
  margin-bottom: 24px
  font-size: 0
  .search-line
    margin-bottom: 12px
    // float: left
    width: 20%
    font-size: 12px
    position: relative
    display: inline-block
    vertical-align: top
    & > dl
      display: block
      .ct-input
        display: block
    .title
      padding: 7px 0
      padding-right: 8px
      text-align: right
      width: 100%
    .content
      padding-right: 16px
      margin-left: 6em
    .btn
      margin-right: 8px
      &:last-child
        margin-right: 0

@media screen and ( max-width: 1500px )
  .ct-form-search
    .search-line
      width: 25%

@media screen and ( max-width: 1368px )
  .ct-form-search
    .search-line
      width: 33.3%
</style>
