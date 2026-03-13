<script setup>
import { reactive, watch } from 'vue';

const props = defineProps({
  isCreating: Boolean,
  task: Object
});

const emit = defineEmits(['close', 'save']);

const localTask = reactive({ ...props.task });

watch(() => props.task, (newVal) => {
  Object.assign(localTask, newVal);
}, { deep: true });

const save = () => {
  if (!localTask.title.trim()) return alert('Заголовок обязателен');
  emit('save', { ...localTask });
};
</script>

<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal">
      <h2>{{ isCreating ? 'Новая задача' : 'Редактирование задачи' }}</h2>

      <div class="form-group">
        <label>Заголовок</label>
        <input v-model="localTask.title" type="text" placeholder="Введите заголовок" />
      </div>

      <div class="form-group">
        <label>Описание</label>
        <textarea v-model="localTask.description" rows="4" placeholder="Описание задачи"></textarea>
      </div>

      <div class="form-group">
        <label>Дедлайн</label>
        <input v-model="localTask.deadline" type="date" />
      </div>

      <div class="modal-footer">
        <button class="btn-cancel" @click="$emit('close')">Отмена</button>
        <button class="btn-save" @click="save">Сохранить</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: white;
  padding: 24px;
  border-radius: 8px;
  width: 400px;
  max-width: 90%;
  box-shadow: 0 10px 25px rgba(0,0,0,0.2);
}

h2 { margin-top: 0; color: #172b4d; }

.form-group {
  margin-bottom: 16px;
}

label {
  display: block;
  margin-bottom: 6px;
  font-weight: 600;
  font-size: 0.9rem;
  color: #5e6c84;
}

input, textarea {
  width: 100%;
  padding: 8px;
  border: 2px solid #dfe1e6;
  border-radius: 4px;
  font-family: inherit;
  box-sizing: border-box;
}

input:focus, textarea:focus {
  border-color: #0052cc;
  outline: none;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

button {
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-weight: 500;
}

.btn-cancel {
  background: transparent;
  color: #172b4d;
}
.btn-cancel:hover { background: rgba(9, 30, 66, 0.08); }

.btn-save {
  background: #0052cc;
  color: white;
}
.btn-save:hover { background: #0065ff; }
</style>