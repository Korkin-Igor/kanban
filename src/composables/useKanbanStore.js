// src/composables/useKanbanStore.js
import {computed, reactive, ref} from 'vue';

export function useKanbanStore() {
    const tasks = reactive([]);

    const columns = [
        { id: 'planned', title: 'Запланированные задачи' },
        { id: 'in_progress', title: 'Задачи в работе' },
        { id: 'testing', title: 'Тестирование' },
        { id: 'done', title: 'Выполненные задачи' }
    ];

    const isModalOpen = ref(false);
    const currentTask = ref(null);
    const isCreating = ref(false);

    const countOverduedTasks = computed(() => {
        const now = new Date();
        return tasks.filter(task => {
            if (task.status !== 'done' || !task.deadline) return false;
            const deadline = new Date(task.deadline);
            return now > deadline;
        }).length;
    });

    // Для Drag-and-Drop
    const draggedTaskId = ref(null);

    const createTask = (taskData) => {
        const newTask = {
            id: Date.now(),
            status: 'planned',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            returnReason: '',
            ...taskData
        };
        tasks.push(newTask);
        isModalOpen.value = false;
    };

    const updateTask = (taskData) => {
        const index = tasks.findIndex(t => t.id === taskData.id);
        if (index !== -1) {
            tasks[index] = {
                ...tasks[index],
                ...taskData,
                updatedAt: new Date().toISOString()
            };
            isModalOpen.value = false;
            currentTask.value = null;
        }
    };

    const deleteTask = (id) => {
        if(confirm('Вы уверены, что хотите удалить задачу?')) {
            const index = tasks.findIndex(t => t.id === id);
            if (index !== -1) tasks.splice(index, 1);
        }
    };

    const openEditModal = (task) => {
        currentTask.value = { ...task };
        isCreating.value = false;
        isModalOpen.value = true;
    };

    const openCreateModal = () => {
        currentTask.value = { title: '', description: '', deadline: '' };
        isCreating.value = true;
        isModalOpen.value = true;
    };

    const moveTask = (taskId, newStatus, reason = '') => {
        const task = tasks.find(t => t.id === taskId);
        if (task) {
            task.status = newStatus;
            task.updatedAt = new Date().toISOString();
            if (newStatus === 'in_progress' && reason) {
                task.returnReason = reason;
            }
        }
    };

    // метод для Drag-and-Drop
    const handleDrop = (taskId, newStatus) => {
        // Проверка: нельзя перетаскивать в ту же колонку
        const task = tasks.find(t => t.id === taskId);
        if (task && task.status !== newStatus) {
            moveTask(taskId, newStatus);
        }
        draggedTaskId.value = null;
    };

    const checkDeadlineStatus = (task) => {
        if (task.status !== 'done') return null;
        const now = new Date();
        const deadline = new Date(task.deadline);
        return now > deadline ? 'overdue' : 'ontime';
    };

    return {
        tasks,
        columns,
        isModalOpen,
        currentTask,
        isCreating,
        draggedTaskId,
        countOverduedTasks,
        createTask,
        updateTask,
        deleteTask,
        openEditModal,
        openCreateModal,
        moveTask,
        handleDrop,
        checkDeadlineStatus
    };
}