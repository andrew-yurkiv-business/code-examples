<template>
  <v-dialog
    v-model="dialogState"
    width="auto"
    :data-id="dialogData.dialogId"
    @after-leave="onDialogAfterLeave"
  >
    <v-card v-if="dialogData.preBuiltLayout === 'card'" class="dialog-card">
      <v-btn
        v-if="dialogData.closeButton"
        @click="closeDialog"
        icon="mdi-close"
        variant="flat"
        size="small"
        class="close-button"
      ></v-btn>
      <component
        :is="dialogData.component"
        v-bind="dialogData.componentOptions"
        :key="`modal-${dialogData.dialogId}-component`"
        @close="closeDialog"
      ></component>
    </v-card>
    <component
      v-else
      :is="dialogData.component"
      v-bind="dialogData.componentOptions"
      :key="`modal-${dialogData.dialogId}-component`"
      @close="closeDialog"
    ></component>
  </v-dialog>
</template>

<script setup lang="ts">
import type { DialogPayloadType } from '~/types/Dialog'

const { $addGlobalEventListener, $removeGlobalEventListener, $emitGlobalEvent } = useNuxtApp()

const dialogState = ref(false)
const dialogData: Ref<DialogPayloadType> = ref({} as DialogPayloadType)

const onDialogOpen = (payload: DialogPayloadType) => {
  dialogData.value = payload
  dialogState.value = true
}

const onDialogClose = (payload: DialogPayloadType) => {
  if (payload.dialogId === dialogData.value.dialogId) {
    closeDialog()
  }
}

const closeDialog = () => {
  dialogState.value = false
}

const onDialogAfterLeave = () => {
  $emitGlobalEvent(`dialog-${dialogData.value.dialogId}:closed` as any, dialogData.value)
}

$addGlobalEventListener('dialog:open', onDialogOpen)
$addGlobalEventListener('dialog:close', onDialogClose)

onBeforeUnmount(() => {
  $removeGlobalEventListener('dialog:open', onDialogOpen)
  $removeGlobalEventListener('dialog:close', onDialogClose)
})
</script>

<style lang="scss" scoped>
.v-card.dialog-card {
  @include tabletAndHigher {
    padding: 0 32px 40px;
    border-radius: 12px;
  }

  @include mobile {
    padding: 0 24px 25px;
    border-radius: 8px;
  }
}

.close-button {
  position: relative;
  top: 5px;
  margin-left: auto;
  margin-top: 10px;

  @include tabletAndHigher {
    right: -17px;
  }

  @include mobile {
    right: -9px;
  }

  :deep(.mdi-close) {
    font-size: 27px;
    color: $neutral-black-900;
  }
}
</style>
