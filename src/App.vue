<script setup>
import { provide } from 'vue';
import { useKanbanStore } from './composables/useKanbanStore';
import KanbanColumn from './components/KanbanColumn.vue';
import TaskModal from './components/TaskModal.vue';

const store = useKanbanStore();

provide('kanbanStore', store);

const {
  columns, isModalOpen, currentTask, isCreating,
  openEditModal, openCreateModal, deleteTask, moveTask, createTask, updateTask
} = store;

const getTasksByColumn = (status) => {
  return store.tasks.filter(t => t.status === status);
};

const handleSave = (taskData) => {
  if (isCreating.value) {
    createTask(taskData);
  } else {
    updateTask(taskData);
  }
};
</script>

<template>
  <div class="app-container">
    <header class="header">
      <h1>Kanban Board</h1>
    </header>

    <div class="board">
      <KanbanColumn
          v-for="col in columns"
          :key="col.id"
          :column="col"
          :tasks="getTasksByColumn(col.id)"
          @edit="openEditModal"
          @delete="deleteTask"
          @move="moveTask"
          @create="openCreateModal"
      />
    </div>

    <TaskModal
        v-if="isModalOpen"
        :is-creating="isCreating"
        :task="currentTask"
        @close="isModalOpen = false"
        @save="handleSave"
    />
  </div>
</template>

<style>
.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
}

.header {
  background-color: #0052cc;
  color: white;
  padding: 1rem 2rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.board {
  display: flex;
  padding: 20px;
  gap: 20px;
  overflow-x: auto;
  height: 100%;
  width: 100%;
  margin: 0 auto;
  align-items: flex-start;
}
</style>