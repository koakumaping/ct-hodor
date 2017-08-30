<template>
  <ctButton icon="times" @click="$router.go(-1)"></ctButton>
</template>

<script>
export default {
  name: 'backButton',
}
</script>