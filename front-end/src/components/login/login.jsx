import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FaGlobe, FaChevronDown } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

function Login() {
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showLang, setShowLang] = useState(false);

  const handleLoginForm = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const loginData = {
      email: e.target.email.value,
      password: e.target.password.value,
    };

    try {
      const response = await fetch(`https://students-todo-production.up.railway.app/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData)
      });


      const data = await response.json();

      if (!response.ok) {
        setError(data.message || t("login.login_failed"));
      } else {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        window.location.href = "/";
      }
    } catch (err) {
      setError(t("login.server_error"));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("lang", lng);
    document.documentElement.dir = lng === "ur" ? "rtl" : "ltr";
    setShowLang(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col items-center justify-center px-4 py-10">
      {/* ---------------- PROFESSIONAL LANGUAGE SELECTOR ---------------- */}
      <div className="mb-6">
        <div className="relative inline-block text-left">
          <button
            onClick={() => setShowLang((s) => !s)}
            className="inline-flex justify-between items-center w-28 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
          >
            <FaGlobe />
            {i18n.language === "ur" ? "اردو" : "English"}
            <FaChevronDown
              className={`ml-2 h-4 w-4 transform transition-transform ${showLang ? "rotate-180" : "rotate-0"}`}
            />
          </button>

          <AnimatePresence>
            {showLang && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="origin-top-right absolute right-0 mt-2 w-36 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-20"
              >
                <div className="py-1">
                  <button
                    onClick={() => changeLanguage("en")}
                    className={`block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition ${i18n.language === "en" ? "bg-gray-100 font-semibold" : ""
                      }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => changeLanguage("ur")}
                    className={`block w-full px-4 py-2 text-right text-sm text-gray-700 hover:bg-gray-100 transition ${i18n.language === "ur" ? "bg-gray-100 font-semibold" : ""
                      }`}
                  >
                    اردو
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <div className="w-full max-w-md relative">



        {/* ---------------- LOGIN FORM CARD ---------------- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl bg-white border border-gray-200 shadow-sm overflow-hidden"
        >
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-xl font-extrabold tracking-tight text-gray-900">
                  {t("login.welcome")}
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  {t("login.subtitle")}
                </p>
              </div>

              <span className="inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 ring-1 ring-inset ring-green-200">
                {t("login.login_tag")}
              </span>
            </div>
          </div>

          <div className="p-6">
            <form className="space-y-4" onSubmit={handleLoginForm}>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-800"
                >
                  {t("login.email_label")}
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder={t("login.email_placeholder")}
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition"
                  required
                  autoComplete="email"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-gray-800"
                >
                  {t("login.password_label")}
                </label>
                <input
                  id="password"
                  type="password"
                  name="password"
                  placeholder={t("login.password_placeholder")}
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition"
                  required
                  autoComplete="current-password"
                />
              </div>

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  <p className="font-semibold">{t("login.login_failed")}</p>
                  <p className="mt-1">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white hover:bg-green-700 active:bg-green-800 disabled:opacity-60 disabled:cursor-not-allowed transition focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500/40"
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                    {t("login.login_tag")}…
                  </span>
                ) : (
                  t("login.login_tag")
                )}
              </button>

              <Navigate to="/register" className="block text-center text-sm mt-2 text-green-600 hover:underline">
                {t("login.no_account")}
              </Navigate>

              <p className="text-center text-xs text-gray-400">
                {t("login.terms")}
              </p>
            </form>
          </div>
        </motion.div>

        <p className="mt-6 text-center text-xs text-gray-400">
          {t("login.tip")}
        </p>
      </div>
    </main>
  );
}

export default Login;
