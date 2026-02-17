import { useEffect, useState } from "react";
import { FiRefreshCw, FiCamera } from "react-icons/fi";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";


function UserProfile() {
  const { t } = useTranslation();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
console.log('user profile rendered' , user);
  const token = localStorage.getItem("token");

  /* ================= FETCH PROFILE ================= */
  const fetchProfile = async () => {
    if (!token) {
      setError(t("user_profile.not_logged_in"));
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await fetch(`https://students-todo-production.up.railway.app/api/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Unauthorized");

      const data = await res.json();
      setUser(data?.user);
    } catch (err) {
      setUser(null);
      setError(t("user_profile.session_expired"));
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UPLOAD IMAGE ================= */
  const handleImageUpload = async (file) => {
    if (!file || !token) return;

    const formData = new FormData();
    formData.append("profileImage", file);

    try {
      setUploading(true);

      const res = await fetch(
        `https://students-todo-production.up.railway.app/api/updateProfileImage`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      await fetchProfile(); // refresh profile
      setPreviewImage(null);
    } catch (error) {
      console.error("Upload failed:", error.message);
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="h-10 w-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  /* ================= ERROR ================= */
  if (error) {
    return (
      <div className="min-h-[45vh] flex items-center justify-center">
        <div className="text-red-600 text-sm">{error}</div>
      </div>
    );
  }

  /* ================= PROFILE ================= */

  const imageUrl = previewImage
    ? previewImage
    : user?.profileImage
    ? `https://students-todo-production.up.railway.app/uploads/${user.profileImage}`
    : null;

  return (
    <section className="px-4 py-8 flex justify-center">
      <div className="w-full max-w-xl">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="rounded-2xl bg-white border border-gray-200 shadow-sm overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                {/* Profile Image */}
                <div className="relative h-16 w-16 border-2 border-green-500 rounded-full">
                  <div className="h-full w-full rounded-full overflow-hidden bg-gray-100">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={user?.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-green-500 text-white font-bold text-lg">
                        {user?.name?.[0]?.toUpperCase() || "U"}
                      </div>
                    )}
                  </div>

                  {/* Camera Icon */}
                  <label className="absolute -bottom-2 -right-2 z-10 bg-black p-1.5 rounded-full cursor-pointer hover:bg-black/80 transition shadow-md">
                    {uploading ? (
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <FiCamera className="text-white text-sm" />
                    )}

                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setPreviewImage(URL.createObjectURL(file));
                          handleImageUpload(file);
                        }
                      }}
                    />
                  </label>
                </div>

                {/* User Info */}
                <div>
                  <h2 className="text-xl font-bold capitalize">
                    {user?.name}
                  </h2>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
              </div>

              <button
                onClick={fetchProfile}
                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold hover:bg-gray-50 transition"
              >
                <FiRefreshCw className="h-4 w-4" />
                {t("user_profile.refresh")}
              </button>
            </div>
          </div>

          {/* Details */}
          <div className="p-6 space-y-3">
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <p className="text-xs font-semibold text-gray-500">
                {t("user_profile.name")}
              </p>
              <p className="mt-1 text-sm font-semibold capitalize">
                {user?.name}
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <p className="text-xs font-semibold text-gray-500">
                {t("user_profile.email")}
              </p>
              <p className="mt-1 text-sm font-semibold">
                {user?.email}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default UserProfile;
