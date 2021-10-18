<template>
  <q-page class="flex flex-center">
    <q-form @submit="onSubmit">
      <q-input
        v-model.number="axieId"
        type="number"
        label="Axie ID"
        :rules="[val => !!val || 'Field is required']"
      />
      <q-btn
        color="primary"
        class="full-width"
        type="submit"
        label="Load"
      />
    </q-form>
  </q-page>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'PageIndex',
  setup () {
    const $router = useRouter()

    const axieId = ref()
    const onSubmit = async function () {
      console.log(axieId.value)
      $router.push('/axie/' + axieId.value)
    }

    return {
      axieId,
      onSubmit
    }
  }
}
</script>
