<template>
  <div
      class="card"
      draggable="true"
      @dragstart="onDragStart"
      @dragend="onDragEnd"
  >
    <div class="card-header">
      <span class="card-id">#{{ task.id.toString().slice(-4) }}</span>
      <div class="actions">
        <button class="icon-btn" @click.stop="$emit('edit')" title="Редактировать">✏️</button>
        <button class="icon-btn delete" v-if="columnId === 'planned'" @click.stop="$emit('delete')" title="Удалить">🗑️</button>
      </div>
    </div>

    <h4 class="card-title">{{ task.title }}</h4>
    <p class="card-desc">{{ task.description }}</p>

    <div class="card-meta">
      <div class="meta-item" v-if="task.deadline">
        📅 {{ formatDate(task.deadline) }}
      </div>
      <div class="meta-item updated">
        🕒 {{ formatRelativeTime(task.updatedAt) }}
      </div>
    </div>

    <div class="card-actions">
      <button v-if="columnId === 'planned'" class="action-btn primary" @click="move('in_progress')">
        В работу ▶
      </button>

      <button v-if="columnId === 'in_progress'" class="action-btn primary" @click="move('testing')">
        На тестирование ▶
      </button>

      <div v-if="columnId === 'testing'" class="testing-actions">
        <button class="action-btn success" @click="move('done')">
          Готово ✔
        </button>
        <button class="action-btn warning" @click="returnToWork">
          ◀ Вернуть
        </button>
      </div>

      <div v-if="columnId === 'done'" class="done-status" :class="deadlineStatus">
        {{ deadlineStatus === 'overdue' ? '⚠️ Просрочено' : '✅ В срок' }}
      </div>
    </div>

    <div v-if="task.returnReason" class="return-reason">
      <small>Причина возврата: {{ task.returnReason }}</small>
    </div>
  </div>
</template>

<script setup>
import { computed, inject } from 'vue';

const props = defineProps({
  task: Object,
  columnId: String
});

const emit = defineEmits(['move', 'edit', 'delete']);

// Получаем store через provide/inject или props
const store = inject('kanbanStore');

const deadlineStatus = computed(() => {
  if (props.columnId !== 'done') return null;
  const now = new Date();
  const deadline = new Date(props.task.deadline);
  return now > deadline ? 'overdue' : 'ontime';
});

const move = (newStatus) => {
  emit('move', { status: newStatus, reason: '' });
};

const returnToWork = () => {
  const reason = prompt("Укажите причину возврата задачи в работу:");
  if (reason) {
    emit('move', { status: 'in_progress', reason: reason });
  }
};

// Drag-and-Drop обработчики
const onDragStart = (e) => {
  store.draggedTaskId.value = props.task.id;
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/plain', props.task.id);
  // Добавляем класс для визуализации
  setTimeout(() => {
    e.target.classList.add('dragging');
  }, 0);
};

const onDragEnd = (e) => {
  store.draggedTaskId.value = null;
  e.target.classList.remove('dragging');
};

const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('ru-RU');
const formatRelativeTime = (dateStr) => new Date(dateStr).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
</script>

<style scoped>
.card {
  background: white;
  border-radius: 6px;
  padding: 12px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
  cursor: grab;
  transition: all 0.2s;
  position: relative;
  user-select: none; /* Чтобы текст не выделялся при драге */
}

.card:hover {
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

.card:active {
  cursor: grabbing;
}

.card.dragging {
  opacity: 0.5;
  transform: rotate(3deg);
  box-shadow: 0 10px 20px rgba(0,0,0,0.2);
}

/* Остальные стили карточки без изменений... */
.card-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 0.75rem;
  color: #5e6c84;
}

.actions button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  opacity: 0.6;
}
.actions button:hover { opacity: 1; }
.actions button.delete:hover { color: red; }

.card-title {
  margin: 0 0 8px 0;
  font-size: 1rem;
  color: #172b4d;
}

.card-desc {
  margin: 0 0 12px 0;
  font-size: 0.9rem;
  color: #42526e;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: #5e6c84;
  margin-bottom: 12px;
  border-top: 1px solid #ebecf0;
  padding-top: 8px;
}

.card-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.action-btn {
  width: 100%;
  padding: 6px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
}

.primary { background-color: #0052cc; color: white; }
.primary:hover { background-color: #0065ff; }

.success { background-color: #36b37e; color: white; }
.warning { background-color: #ffab00; color: #172b4d; }

.done-status {
  text-align: center;
  padding: 6px;
  border-radius: 4px;
  font-weight: bold;
  font-size: 0.85rem;
}
.done-status.overdue { background-color: #ffebe6; color: #de350b; }
.done-status.ontime { background-color: #e3fcef; color: #006644; }

.return-reason {
  margin-top: 8px;
  padding: 6px;
  background: #fffae6;
  border-left: 3px solid #ffab00;
  font-size: 0.75rem;
  color: #172b4d;
}
</style>