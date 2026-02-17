import { useTranslation } from "react-i18next";
import AddToDo from "../addToDo/addToDo";
import TaskList from "../taskList/taskList";
import { FaTasks } from "react-icons/fa";
import { motion } from "framer-motion";

function DashBoard() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-4 lg:px-12 py-8">
      
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto mb-10"
      >
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gray-900 text-white rounded-2xl shadow-lg">
            <FaTasks size={20} />
          </div>

          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 tracking-tight">
              {t("dashboard.title")}
            </h1>
            <p className="text-gray-500 mt-1 text-sm sm:text-base">
              {t("dashboard.subtitle")}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Add Task Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100"
        >
          <AddToDo />
        </motion.div>

        {/* Task List Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100"
        >
          <TaskList />
        </motion.div>

      </div>
    </div>
  );
}

export default DashBoard;
