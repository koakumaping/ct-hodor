<template>
  <ctForm labelWidth="9em">
    <ctFormLine label="当前登录密码">
      <ctInput></ctInput>
    </ctFormLine>
    <ctFormLine label="新的登录密码">
      <ctInput></ctInput>
    </ctFormLine>
    <ctFormLine label="确认登录密码">
      <ctInput></ctInput>
    </ctFormLine>
    <ctFormLine>
      <ctButton type="primary">确定</ctButton>
    </ctFormLine>
  </ctForm>
</template>

<script>
export default {
  name: 'passwordForm',
}
</script>
