import React, { useState, useEffect, useCallback } from 'react';
import { getTasks, createTask, updateTask, deleteTask } from '../services/api';
import TaskModal from '../components/TaskModal';
import toast from 'react-hot-toast';
import { format, isPast, parseISO } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';

const DashboardPage = () => {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt:desc');

  const fetchTasks = useCallback(async () => {
    try {
      let query = `?sortBy=${sortBy}`;
      if (filter === 'completed') query += '&completed=true';
      if (filter === 'incomplete') query += '&completed=false';
      const response = await getTasks(query);
      setTasks(response.data);
    } catch (error) {
      toast.error("Failed to fetch tasks.");
    }
  }, [filter, sortBy]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const openModalForCreate = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const openModalForEdit = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const handleSaveTask = async (taskData) => {
    const action = editingTask ? updateTask(editingTask._id, taskData) : createTask(taskData);
    const toastId = toast.loading(editingTask ? 'Updating task...' : 'Creating task...');
    try {
      await action;
      toast.success(`Task ${editingTask ? 'updated' : 'created'} successfully!`, { id: toastId });
      fetchTasks();
      closeModal();
    } catch (error) {
      toast.error(`Failed to ${editingTask ? 'update' : 'create'} task.`, { id: toastId });
    }
  };

  const handleToggleComplete = async (task) => {
    try {
      await updateTask(task._id, { completed: !task.completed });
      toast.success(`Task marked as ${!task.completed ? 'complete' : 'incomplete'}`);
      fetchTasks();
    } catch (error) {
      toast.error("Failed to update task status.");
    }
  };

  const handleDeleteTask = async (id) => {
    toast((t) => (
      <span className="flex flex-col items-center gap-2">
        Are you sure you want to delete this task?
        <div className="flex gap-2">
          <button
            className="px-3 py-1 text-sm text-white bg-red-500 rounded-md"
            onClick={async () => {
              toast.dismiss(t.id);
              const toastId = toast.loading('Deleting task...');
              try {
                await deleteTask(id);
                toast.success('Task deleted!', { id: toastId });
                fetchTasks();
              } catch {
                toast.error('Failed to delete task.', { id: toastId });
              }
            }}>
            Delete
          </button>
          <button className="px-3 py-1 text-sm text-gray-700 bg-gray-200 rounded-md" onClick={() => toast.dismiss(t.id)}>
            Cancel
          </button>
        </div>
      </span>
    ));
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* This header is now part of the page content */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-slate-500 mt-1">Here's your current list of tasks.</p>
        </div>
        <button
          onClick={openModalForCreate}
          className="px-5 py-2.5 font-semibold text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-colors"
        >
          + Add New Task
        </button>
      </div>

      <div className="p-4 mb-6 bg-white rounded-xl shadow-sm">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-600">Filter by:</span>
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
            <option value="all">All</option>
            <option value="completed">Completed</option>
            <option value="incomplete">Incomplete</option>
          </select>
          <span className="text-sm font-medium text-gray-600">Sort by:</span>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
            <option value="createdAt:desc">Newest</option>
            <option value="dueDate:asc">Due Date</option>
            <option value="priority:desc">Priority</option>
          </select>
        </div>
      </div>

      <motion.div layout className="space-y-4">
        <AnimatePresence>
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <TaskItem
                key={task._id}
                task={task}
                onToggleComplete={handleToggleComplete}
                onDelete={handleDeleteTask}
                onEdit={openModalForEdit}
              />
            ))
          ) : (
            <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-10 text-center bg-white rounded-xl shadow-sm">
              <p className="text-gray-500">No tasks yet. Create one to get started!</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {isModalOpen && (
          <TaskModal
            task={editingTask}
            onSave={handleSaveTask}
            onClose={closeModal}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const priorityClasses = {
  High: 'bg-red-100 text-red-800',
  Medium: 'bg-yellow-100 text-yellow-800',
  Low: 'bg-green-100 text-green-800',
};

const TaskItem = ({ task, onToggleComplete, onDelete, onEdit }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, x: -50 }}
    transition={{ type: "spring", stiffness: 120 }}
    className="flex items-center p-4 bg-white rounded-lg shadow-sm transition-shadow hover:shadow-md"
  >
    <input
      type="checkbox"
      checked={task.completed}
      onChange={() => onToggleComplete(task)}
      className="w-5 h-5 mr-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
    />
    <div className="flex-grow">
      <p className={`font-medium text-gray-800 ${task.completed ? 'line-through text-gray-400' : ''}`}>
        {task.description}
      </p>
      <div className="flex items-center mt-1 space-x-3 text-sm text-gray-500">
        {task.dueDate && (
          <span className={`${isPast(parseISO(task.dueDate)) && !task.completed ? 'text-red-500 font-semibold' : ''}`}>
            Due: {format(parseISO(task.dueDate), 'MMM dd')}
          </span>
        )}
        {task.priority && (
          <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${priorityClasses[task.priority]}`}>
            {task.priority}
          </span>
        )}
      </div>
    </div>
    <div className="flex items-center space-x-2">
      <button onClick={() => onEdit(task)} className="p-2 text-gray-500 rounded-full hover:bg-gray-100 hover:text-blue-500">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.732 3.732z" /></svg>
      </button>
      <button onClick={() => onDelete(task._id)} className="p-2 text-gray-500 rounded-full hover:bg-gray-100 hover:text-red-500">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
      </button>
    </div>
  </motion.div>
);

export default DashboardPage;