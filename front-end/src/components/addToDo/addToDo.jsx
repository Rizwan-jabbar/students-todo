import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FaPlus,
  FaTrash,
  FaCheckCircle,
  FaExclamationCircle,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

function AddToDo({ onTaskAdded }) {
  const { t } = useTranslation();

  const [task, setTask] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const maxDescLength = 150;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!task.trim()) {
      setError(t("add_todo.messages.empty_task_error"));
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError(t("add_todo.messages.not_logged_in_error"));
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        `https://students-todo-production.up.railway.app/api/task`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ title: task, description }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setSuccess(t("add_todo.messages.success_title"));

      // 🔥 IMPORTANT: Refresh task list
      if (onTaskAdded) {
        onTaskAdded();
      }

      // Clear form
      setTask("");
      setDescription("");

    } catch (err) {
      setError(err.message || t("add_todo.messages.server_error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white/70 backdrop-blur-xl border border-gray-200 shadow-xl rounded-3xl p-8 h-full flex flex-col"
      >
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {t("add_todo.title_section")}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {t("add_todo.subtitle_section")}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 flex-1">

          {/* Task Input */}
          <div>
            <label className="text-sm font-semibold text-gray-700">
              {t("add_todo.form.title_label")}
            </label>

            <input
              type="text"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder={t("add_todo.form.title_placeholder")}
              className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 transition"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-semibold text-gray-700">
              {t("add_todo.form.description_label")}
            </label>

            <textarea
              rows="3"
              value={description}
              maxLength={maxDescLength}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t("add_todo.form.description_placeholder")}
              className="mt-2 w-full resize-none rounded-2xl border border-gray-200 px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 transition"
            />

            <div className="text-xs text-gray-400 mt-1 text-right">
              {description.length}/{maxDescLength}
            </div>
          </div>

          {/* Alerts */}
          <AnimatePresence>
            {(error || success) && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`rounded-2xl px-4 py-3 text-sm flex items-start gap-3 ${
                  error
                    ? "bg-red-50 text-red-700 border border-red-200"
                    : "bg-green-50 text-green-700 border border-green-200"
                }`}
              >
                {error ? (
                  <FaExclamationCircle className="mt-1" />
                ) : (
                  <FaCheckCircle className="mt-1" />
                )}
                <span>{error || success}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Buttons */}
          <div className="flex gap-4 mt-auto">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              type="submit"
              disabled={loading}
              className="flex-1 bg-gray-900 text-white rounded-2xl py-3 text-sm font-semibold shadow-md hover:bg-gray-800 transition disabled:opacity-60"
            >
              {loading
                ? t("add_todo.buttons.loading")
                : (
                  <span className="flex justify-center items-center gap-2">
                    <FaPlus /> {t("add_todo.buttons.submit")}
                  </span>
                )}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              type="button"
              onClick={() => {
                setTask("");
                setDescription("");
                setError("");
                setSuccess("");
              }}
              className="flex-1 border border-gray-300 bg-white rounded-2xl py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
            >
              <span className="flex justify-center items-center gap-2">
                <FaTrash /> {t("add_todo.buttons.clear")}
              </span>
            </motion.button>
          </div>

        </form>
      </motion.div>
    </div>
  );
}

export default AddToDo;
