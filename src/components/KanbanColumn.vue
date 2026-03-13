<script setup>
import { ref, inject } from 'vue';
import KanbanCard from './KanbanCard.vue';

const props = defineProps({
  column: Object,
  tasks: Array
});

const emit = defineEmits(['edit', 'delete', 'move', 'create']);

const store = inject('kanbanStore');
const isDragOver = ref(false);

const onDragOver = (e) => {
  e.preventDefault();
  isDragOver.value = true;
};

const onDragLeave = () => {
  isDragOver.value = false;
};

const onDrop = (e) => {
  e.preventDefault();
  isDragOver.value = false;

  const taskId = store.draggedTaskId.value;
  if (taskId) {
    store.handleDrop(taskId, props.column.id);
  }
};
</script>

<template>
  <div
      class="column"
      @dragover.prevent="onDragOver"
      @dragleave="onDragLeave"
      @drop="onDrop"
      :class="{ 'drag-over': isDragOver }"
  >
    <div class="column-header">
      <h3>{{ column.title }}</h3>
      <span class="count">{{ tasks.length }}</span>
    </div>

    <div class="task-list">
      <KanbanCard
          v-for="task in tasks"
          :key="task.id"
          :task="task"
          :column-id="column.id"
          @edit="$emit('edit', task)"
          @delete="$emit('delete', task.id)"
          @move="$emit('move', task.id, $event.status, $event.reason)"
      />
    </div>

    <button
        v-if="column.id === 'planned'"
        class="add-btn"
        @click="$emit('create')"
    >
      + Добавить задачу
    </button>
  </div>
</template>

<style scoped>
.column {
  background-color: #ebecf0;
  border-radius: 8px;
  width: 300px;
  min-width: 300px;
  display: flex;
  flex-direction: column;
  max-height: 100%;
  transition: background-color 0.2s;
}

.column.drag-over {
  background-color: #dfe1e6;
  box-shadow: inset 0 0 0 2px #0052cc;
}

.column-header {
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
}

.count {
  background: rgba(0,0,0,0.1);
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
}

.task-list {
  padding: 0 8px;
  overflow-y: auto;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 100px;
}

.add-btn {
  margin: 10px;
  padding: 10px;
  border: none;
  background: transparent;
  color: #5e6c84;
  cursor: pointer;
  text-align: left;
  border-radius: 4px;
  transition: background 0.2s;
}
</style>