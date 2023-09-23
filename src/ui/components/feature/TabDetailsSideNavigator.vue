<template>
  <el-table
    ref="multipleTableRef"
    :data="tableData"
    :span-method="spanMethod"
    @selection-change="handleSelectionChange"
  >
    <el-table-column type="selection" />
    <el-table-column label="Suites">
      <template #default="{ row }">{{ row }}</template>
    </el-table-column>
  </el-table>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import type { ElTable } from 'element-plus'
import { Suite } from '@commonTypes'

interface User {
  date: string
  number: string
  phone: string
}

const multipleTableRef = ref<InstanceType<typeof ElTable>>()
const multipleSelection = ref<User[]>([])
// const toggleSelection = (rows?: User[]) => {
//   if (rows) {
//     rows.forEach((row) => {
//       // TODO: improvement typing when refactor table
//       // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//       // @ts-expect-error
//       multipleTableRef.value!.toggleRowSelection(row, undefined)
//     })
//   } else {
//     multipleTableRef.value!.clearSelection()
//   }
// }

const handleSelectionChange = (val: User[]) => {
  multipleSelection.value = val
}

const tableData: Suite[] = window.__input_json__.suites

function spanMethod({ columnIndex }: { columnIndex: number }) {
  // merge all columns into one, so all data are available in the default column slot
  if (columnIndex === 1) {
    return {
      rowspan: 1,
      colspan: -1
    }
  }
}
</script>
