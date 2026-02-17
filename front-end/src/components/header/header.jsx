import { useEffect, useRef, useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaTimes, FaSignOutAlt, FaGlobe, FaChevronDown } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";

function Header() {
  const [showMenu, setShowMenu] = useState(false);
  const [showLang, setShowLang] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [user, setUser] = useState(null);

  const hamburgerRef = useRef(null);
  const langRef = useRef(null);
  const userRef = useRef(null);

  const { t, i18n } = useTranslation();
  const token = localStorage.getItem("token");

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

  const NavItem = ({ children }) => (
    <li>
      <button className="w-full lg:w-auto text-left lg:text-center rounded-xl px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 transition">
        {children}
      </button>
    </li>
  );

  const isRTL = i18n.language === "ur";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between">
          {/* BRAND */}
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="text-lg font-extrabold text-gray-900"
          >
            {t("header.brand")}
          </motion.p>

          {/* DESKTOP NAV */}
          <nav className="hidden lg:flex items-center gap-4">
            <NavItem>{t("header.nav.home")}</NavItem>
            <NavItem>{t("header.nav.todos")}</NavItem>

            {/* LANGUAGE DROPDOWN */}
            <div ref={langRef} className="relative">
              <button
                onClick={() => setShowLang((s) => !s)}
                className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold hover:bg-gray-50 transition"
              >
                <FaGlobe />
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
                    className={`absolute top-full mt-2 w-36 rounded-xl border bg-white shadow-lg overflow-hidden z-50 ${
                      isRTL ? "left-0" : "right-0"
                    }`}
                  >
                    <button
                      onClick={() => changeLanguage("ur")}
                      className={`w-full px-4 py-2 text-${isRTL ? "right" : "left"} hover:bg-gray-100 ${
                        i18n.language === "ur" && "bg-gray-100 font-semibold"
                      }`}
                    >
                      {t("header.urdu")}
                    </button>
                    <button
                      onClick={() => changeLanguage("en")}
                      className={`w-full px-4 py-2 text-${isRTL ? "right" : "left"} hover:bg-gray-100 ${
                        i18n.language === "en" && "bg-gray-100 font-semibold"
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
                  className="h-10 w-10 rounded-full overflow-hidden border-2 border-gray-300 flex items-center justify-center cursor-pointer"
                >
                  {user.profileImage ? (
                    <img
                      src={`http://localhost:3000/uploads/${user.profileImage}`}
                      alt={user.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="bg-green-500 text-white font-bold">
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
                      className={`absolute top-full mt-2 w-48 rounded-xl border bg-white shadow-lg overflow-hidden z-50 ${
                        isRTL ? "left-0" : "right-0"
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
              className="p-2 border rounded-xl hover:bg-gray-100 transition"
            >
              <GiHamburgerMenu />
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
              className={`h-full w-72 bg-white p-4 ${isRTL ? "rtl" : "ltr"}`}
            >
              <div className="flex justify-between items-center mb-4">
                <p className="font-bold">{t("header.menu")}</p>
                <button onClick={() => setShowMenu(false)}>
                  <FaTimes />
                </button>
              </div>

              <ul className="space-y-2">
                <NavItem>{t("header.nav.home")}</NavItem>
                <NavItem>{t("header.nav.todos")}</NavItem>

                {/* LANGUAGE */}
                <li className="pt-4 border-t">
                  <p className="text-xs text-gray-500 mb-2">{t("header.language")}</p>
                  <button
                    onClick={() => changeLanguage("ur")}
                    className={`w-full px-3 py-2 rounded text-${isRTL ? "right" : "left"} hover:bg-gray-100 ${
                      i18n.language === "ur" && "bg-gray-100 font-semibold"
                    }`}
                  >
                    {t("header.urdu")}
                  </button>
                  <button
                    onClick={() => changeLanguage("en")}
                    className={`w-full px-3 py-2 rounded text-${isRTL ? "right" : "left"} hover:bg-gray-100 ${
                      i18n.language === "en" && "bg-gray-100 font-semibold"
                    }`}
                  >
                    {t("header.english")}
                  </button>
                </li>

                {/* USER PROFILE MOBILE */}
                {user && (
                  <li className="pt-4 border-t">
                    <div className="flex items-center gap-3 px-3 py-2">
                      <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-gray-300 flex items-center justify-center">
                        {user.profileImage ? (
                          <img
                            src={`http://localhost:3000/uploads/${user.profileImage}`}
                            alt={user.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="bg-green-500 text-white font-bold">
                            {user.name[0].toUpperCase() || "U"}
                          </span>
                        )}
                      </div>
                      <span className="font-semibold text-gray-700 truncate">{user.name}</span>
                    </div>
                    <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm">
                      {t("header.my_account")}
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-red-600 font-semibold flex items-center gap-2"
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
