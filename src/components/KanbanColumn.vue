<template>
  <div class="column">
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

<script setup>
import KanbanCard from './KanbanCard.vue';

defineProps({
  column: Object,
  tasks: Array
});

defineEmits(['edit', 'delete', 'move', 'create']);
</script>

<style scoped>
.column {
  background-color: #ebecf0;
  border-radius: 8px;
  width: 300px;
  min-width: 300px;
  display: flex;
  flex-direction: column;
  max-height: 100%;
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

.add-btn:hover {
  background-color: rgba(9, 30, 66, 0.08);
  color: #172b4d;
}
</style>