// src/renderer/components/TaskManager.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, addTask, updateTask, deleteTask } from '../store/slices/taskSlice';

// Fonction utilitaire pour formater les dates
const formatDate = (isoString) => {
  const date = new Date(isoString);
  return new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(date);
};

function TaskManager() {
  const dispatch = useDispatch();
  const { items: tasks, status, error } = useSelector(state => state.tasks);
  const [newTask, setNewTask] = useState({ title: '', description: '' });

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newTask.title.trim()) {
      await dispatch(addTask(newTask));
      setNewTask({ title: '', description: '' });
    }
  };

  const handleStatusChange = async (id, status) => {
    await dispatch(updateTask({ id, data: { status } }));
  };

  const handleDelete = async (id) => {
    await dispatch(deleteTask(id));
  };

  if (status === 'loading') return <div>Chargement...</div>;
  if (status === 'failed') return <div>Erreur: {error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="space-y-4">
          <input
            type="text"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            placeholder="Titre de la tâche"
            className="w-full p-2 border rounded"
          />
          <textarea
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            placeholder="Description (optionnel)"
            className="w-full p-2 border rounded"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Ajouter la tâche
          </button>
        </div>
      </form>

      <div className="space-y-4">
        {tasks.map(task => (
          <div key={task.id} className="border p-4 rounded shadow">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold">{task.title}</h3>
                {task.description && <p className="text-gray-600 mt-1">{task.description}</p>}
              </div>
              <span className="text-sm text-gray-500">
                {formatDate(task.createdAt)}
              </span>
            </div>
            
            <div className="mt-4 flex justify-between items-center">
              <select
                value={task.status}
                onChange={(e) => handleStatusChange(task.id, e.target.value)}
                className="border rounded p-1"
              >
                <option value="TODO">À faire</option>
                <option value="IN_PROGRESS">En cours</option>
                <option value="DONE">Terminé</option>
              </select>
              <button
                onClick={() => handleDelete(task.id)}
                className="text-red-500 hover:text-red-700"
              >
                Supprimer
              </button>
            </div>
            
            <div className="mt-2 text-xs text-gray-400">
              Dernière mise à jour : {formatDate(task.updatedAt)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TaskManager;