import { useState, useMemo } from "react";
import {
  FaTrash,
  FaEdit,
  FaCheckCircle,
  FaRegCircle,
  FaSearch,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

function TaskList({ tasks, setTasks }) {
  const { t } = useTranslation();

  const [selectedTask, setSelectedTask] = useState(null);
  const [search, setSearch] = useState("");

  const token = localStorage.getItem("token");

  const handleDelete = async (id) => {
    await fetch(
      `https://students-todo-production.up.railway.app/api/task/${id}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    setTasks((prev) => prev.filter((t) => t._id !== id));
    if (selectedTask?._id === id) setSelectedTask(null);
  };

  const handleToggle = async (task) => {
    try {
      const res = await fetch(
        `https://students-todo-production.up.railway.app/api/task/${task._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ completed: !task.completed }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Update failed");
      }

      setTasks((prev) =>
        prev.map((t) =>
          t._id === task._id ? data.task : t
        )
      );

      if (selectedTask?._id === task._id) {
        setSelectedTask(data.task);
      }

    } catch (err) {
      console.error("Toggle error:", err.message);
    }
  };

  // 🔍 Filtered tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) =>
      task.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [tasks, search]);

  // 📊 Stats
  const completedCount = tasks.filter((t) => t.completed).length;
  const pendingCount = tasks.length - completedCount;

  return (
    <div className="h-full flex flex-col">

      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {t("tasksList.your_tasks")}
        </h2>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-100 rounded-2xl p-4 text-center">
          <p className="text-sm text-gray-500">Total</p>
          <p className="text-xl font-bold">{tasks.length}</p>
        </div>
        <div className="bg-green-50 rounded-2xl p-4 text-center">
          <p className="text-sm text-green-600">Completed</p>
          <p className="text-xl font-bold text-green-700">{completedCount}</p>
        </div>
        <div className="bg-yellow-50 rounded-2xl p-4 text-center">
          <p className="text-sm text-yellow-600">Pending</p>
          <p className="text-xl font-bold text-yellow-700">{pendingCount}</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <FaSearch className="absolute left-3 top-3 text-gray-400 text-sm" />
        <input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-gray-900/20 outline-none"
        />
      </div>

      {/* Task List */}
      <div className="flex-1 overflow-y-auto pr-2">
        {filteredTasks.length === 0 ? (
          <div className="text-center text-gray-400 mt-10">
            No matching tasks
          </div>
        ) : (
          <ul className="space-y-4">
            <AnimatePresence>
              {filteredTasks.map((task) => (
                <motion.li
                  key={task._id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  whileHover={{ scale: 1.01 }}
                  className="bg-white border rounded-2xl p-4 shadow-sm hover:shadow-md transition cursor-pointer"
                  onClick={() => setSelectedTask(task)}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggle(task);
                        }}
                      >
                        {task.completed ? (
                          <FaCheckCircle className="text-green-500" />
                        ) : (
                          <FaRegCircle className="text-gray-400" />
                        )}
                      </button>

                      <h4
                        className={`font-semibold ${
                          task.completed
                            ? "line-through text-gray-400"
                            : "text-gray-800"
                        }`}
                      >
                        {task.title}
                      </h4>
                    </div>

                    <div className="flex gap-3">
                      <FaEdit
                        className="text-blue-500 hover:text-blue-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTask(task);
                        }}
                      />
                      <FaTrash
                        className="text-red-500 hover:text-red-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(task._id);
                        }}
                      />
                    </div>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
      </div>

      {/* Modal same as before */}
    </div>
  );
}

export default TaskList;
