import { useEffect, useRef, useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaTimes, FaSignOutAlt, FaGlobe, FaChevronDown } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";

// NavItem component outside of Header to avoid recreation during render
const NavItem = ({ children, isMobile = false }) => (
  <li>
    <button className={`w-full lg:w-auto text-left lg:text-center rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-md ${
      isMobile 
        ? 'text-purple-900 bg-white hover:bg-purple-100' 
        : 'text-white hover:bg-white/20 hover:backdrop-blur-md'
    }`}>
      {children}
    </button>
  </li>
);

function Header() {
  const [showMenu, setShowMenu] = useState(false);
  const [showLang, setShowLang] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [user, setUser] = useState(null);

  const langRef = useRef(null);
  const userRef = useRef(null);

  const { t, i18n } = useTranslation();

  /* ===================== FETCH USER ===================== */
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);
  }, []);

  /* ===================== LANGUAGE ===================== */
  useEffect(() => {
    const savedLang = localStorage.getItem("lang") || "en";
    i18n.changeLanguage(savedLang);
    document.documentElement.dir = savedLang === "ur" ? "rtl" : "ltr";
  }, [i18n]);

  /* ===================== CLICK OUTSIDE ===================== */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) setShowLang(false);
      if (userRef.current && !userRef.current.contains(e.target)) setShowUserDropdown(false);
    };
    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.reload();
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("lang", lng);
    document.documentElement.dir = lng === "ur" ? "rtl" : "ltr";
    setShowLang(false);
    setShowMenu(false);
  };

  const isRTL = i18n.language === "ur";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 shadow-lg backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-18 items-center justify-between">
          {/* BRAND */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2"
          >
            <NavLink to='/' className="text-2xl font-black text-white drop-shadow-lg hover:scale-105 transition-transform duration-200 flex items-center gap-2" aria-label="Home">
              <span className="bg-white text-purple-600 rounded-lg px-2 py-1 text-xl" aria-hidden="true">📝</span>
              {t("header.brand")}
            </NavLink>
          </motion.div>

          {/* DESKTOP NAV */}
          <nav className="hidden lg:flex items-center gap-4">
            <NavItem>{t("header.nav.home")}</NavItem>
            <NavItem>{t("header.nav.todos")}</NavItem>

            {/* LANGUAGE DROPDOWN */}
            <div ref={langRef} className="relative">
              <button
                onClick={() => setShowLang((s) => !s)}
                className="inline-flex items-center gap-2 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/30 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <FaGlobe className="text-base" />
                {i18n.language === "ur" ? t("header.urdu") : t("header.english")}
                <FaChevronDown className="text-xs" />
              </button>

              <AnimatePresence>
                {showLang && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className={`absolute top-full mt-2 w-36 rounded-xl border bg-white shadow-lg overflow-hidden z-50 ${isRTL ? "left-0" : "right-0"
                      }`}
                  >
                    <button
                      onClick={() => changeLanguage("ur")}
                      className={`w-full px-4 py-2 text-${isRTL ? "right" : "left"} hover:bg-gray-100 ${i18n.language === "ur" && "bg-gray-100 font-semibold"
                        }`}
                    >
                      {t("header.urdu")}
                    </button>
                    <button
                      onClick={() => changeLanguage("en")}
                      className={`w-full px-4 py-2 text-${isRTL ? "right" : "left"} hover:bg-gray-100 ${i18n.language === "en" && "bg-gray-100 font-semibold"
                        }`}
                    >
                      {t("header.english")}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* USER PROFILE DROPDOWN DESKTOP */}
            {user && (
              <div ref={userRef} className="relative">
                <button
                  onClick={() => setShowUserDropdown((s) => !s)}
                  className="h-11 w-11 rounded-full overflow-hidden border-3 border-white shadow-lg hover:shadow-xl flex items-center justify-center cursor-pointer hover:scale-105 transition-transform duration-200"
                >
                  {user.profileImage ? (
                    <img
                      src={user.profileImage || null} // <-- Cloudinary secure_url directly
                      alt={user.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="bg-gradient-to-br from-green-400 to-green-600 text-white font-bold text-lg h-full w-full flex items-center justify-center">
                      {user.name[0].toUpperCase() || "U"}
                    </span>
                  )}

                </button>

                <AnimatePresence>
                  {showUserDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className={`absolute top-full mt-2 w-48 rounded-xl border bg-white shadow-lg overflow-hidden z-50 ${isRTL ? "left-0" : "right-0"
                        }`}
                    >
                      <div className="px-4 py-2 border-b text-sm text-gray-700 font-semibold truncate">
                        {user.name}
                      </div>
                      <NavLink to='/myProfile' className="w-full text-left overflow-hidden px-4 py-2 hover:bg-gray-100 text-sm">
                        {t("header.my_account")}
                      </NavLink>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-red-600 font-semibold flex items-center gap-2"
                      >
                        <FaSignOutAlt /> {t("header.logout")}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </nav>

          {/* MOBILE HAMBURGER */}
          <div className="lg:hidden">
            <button
              onClick={() => setShowMenu(true)}
              className="p-2.5 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl text-white hover:bg-white/30 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <GiHamburgerMenu className="text-xl" />
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {showMenu && (
          <motion.aside
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40"
          >
            <motion.div
              initial={{ x: 300 }}
              animate={{ x: 0 }}
              exit={{ x: 300 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className={`h-full w-80 bg-gradient-to-br from-blue-50 to-purple-50 p-6 shadow-2xl ${isRTL ? "rtl" : "ltr"}`}
            >
              <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-purple-200">
                <p className="font-bold text-xl text-purple-900">{t("header.menu")}</p>
                <button 
                  onClick={() => setShowMenu(false)}
                  className="p-2 hover:bg-purple-100 rounded-lg transition-colors duration-200"
                >
                  <FaTimes className="text-purple-600 text-lg" />
                </button>
              </div>

              <ul className="space-y-3">
                <NavItem isMobile={true}>{t("header.nav.home")}</NavItem>
                <NavItem isMobile={true}>{t("header.nav.todos")}</NavItem>

                {/* LANGUAGE */}
                <li className="pt-4 border-t-2 border-purple-200">
                  <p className="text-xs font-semibold text-purple-700 mb-3 uppercase tracking-wide">{t("header.language")}</p>
                  <button
                    onClick={() => changeLanguage("ur")}
                    className={`w-full px-4 py-2.5 rounded-lg text-${isRTL ? "right" : "left"} hover:bg-purple-100 transition-colors duration-200 ${i18n.language === "ur" && "bg-purple-200 font-semibold text-purple-900"
                      }`}
                  >
                    {t("header.urdu")}
                  </button>
                  <button
                    onClick={() => changeLanguage("en")}
                    className={`w-full px-4 py-2.5 rounded-lg text-${isRTL ? "right" : "left"} hover:bg-purple-100 transition-colors duration-200 ${i18n.language === "en" && "bg-purple-200 font-semibold text-purple-900"
                      }`}
                  >
                    {t("header.english")}
                  </button>
                </li>

                {/* USER PROFILE MOBILE */}
                {user && (
                  <li className="pt-4 border-t-2 border-purple-200">
                    <div className="flex items-center gap-3 px-3 py-3 bg-white rounded-xl shadow-sm">
                      <div className="h-12 w-12 rounded-full overflow-hidden border-3 border-purple-300 flex items-center justify-center shadow-md">
                        {user.profileImage ? (
                          <img
                            src={`https://students-todo-production.up.railway.app/uploads/${user.profileImage}`}
                            alt={user.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="bg-gradient-to-br from-green-400 to-green-600 text-white font-bold text-lg h-full w-full flex items-center justify-center">
                            {user.name[0].toUpperCase() || "U"}
                          </span>
                        )}
                      </div>
                      <span className="font-semibold text-purple-900 truncate">{user.name}</span>
                    </div>
                    <button className="w-full text-left px-4 py-2.5 hover:bg-purple-100 transition-colors duration-200 text-sm rounded-lg mt-2">
                      {t("header.my_account")}
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2.5 hover:bg-red-50 transition-colors duration-200 text-sm text-red-600 font-semibold flex items-center gap-2 rounded-lg"
                    >
                      <FaSignOutAlt /> {t("header.logout")}
                    </button>
                  </li>
                )}
              </ul>
            </motion.div>
          </motion.aside>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Header;
