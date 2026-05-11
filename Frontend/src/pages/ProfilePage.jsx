/*
  PROFILE PAGE
  ─────────────
  Shows the logged-in user's info with two tabs:
  • Tab 1: Edit Profile (name)
  • Tab 2: Change Password

  WHAT IS OPTIMISTIC UI?
  ───────────────────────
  "Optimistic" means we update the UI immediately when the user
  saves, BEFORE the server confirms. This makes the app feel fast.
  If the server returns an error, we revert. We use this for
  the name change in the Navbar.

  LOCAL STATE vs CONTEXT STATE:
  ──────────────────────────────
  • The form input values live in LOCAL state (useState inside this component)
  • The "current user" in the Navbar lives in CONTEXT state
  After save: we call updateUser() from AuthContext to sync the Navbar.
*/

import { useState } from "react";
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaShieldAlt, FaEdit } from "react-icons/fa";
import toast from "react-hot-toast";

import { useAuth } from "../hooks/useAuth";
import { updateMyProfile, changePassword } from "../services/authService";
import styles from "./ProfilePage.module.css";

// Role → badge color mapping
const ROLE_BADGE = {
  Admin:    "badge-purple",
  Shelter:  "badge-orange",
  PetOwner: "badge-orange",
  Adopter:  "badge-green",
};

function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab]     = useState("profile");
  const [loading, setLoading]         = useState(false);

  // Profile form state
  const [profileForm, setProfileForm] = useState({ name: user?.name || "" });
  const [profileError, setProfileError] = useState("");

  // Password form state
  // const [pwdForm, setPwdForm]   = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  // const [showPwd, setShowPwd]   = useState({ current: false, new: false, confirm: false });
  // const [pwdError, setPwdError] = useState("");

  // ── Profile update ──────────────────────────────────────────
  async function handleProfileSave(e) {
    e.preventDefault();
    if (!profileForm.name.trim()) {
      setProfileError("Name cannot be empty."); return;
    }
    setLoading(true);
    setProfileError("");
    try {
      await updateMyProfile({ name: profileForm.name.trim() });
      updateUser({ name: profileForm.name.trim() }); // update Navbar instantly
      toast.success("Profile updated!");
    } catch (err) {
      setProfileError(err.response?.data?.message || "Update failed.");
    } finally {
      setLoading(false);
    }
  }

  // ── Password change ─────────────────────────────────────────
  // async function handlePasswordSave(e) {
  //   e.preventDefault();
  //   if (pwdForm.newPassword !== pwdForm.confirmPassword) {
  //     setPwdError("New passwords do not match."); return;
  //   }
  //   if (pwdForm.newPassword.length < 8) {
  //     setPwdError("Password must be at least 8 characters."); return;
  //   }
  //   setLoading(true);
  //   setPwdError("");
  //   try {
  //     await changePassword({
  //       currentPassword: pwdForm.currentPassword,
  //       newPassword:     pwdForm.newPassword,
  //     });
  //     toast.success("Password changed successfully!");
  //     setPwdForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
  //   } catch (err) {
  //     setPwdError(err.response?.data?.message || "Password change failed. Check your current password.");
  //   } finally {
  //     setLoading(false);
  //   }
  // }

  // function togglePwd(field) {
  //   setShowPwd((prev) => ({ ...prev, [field]: !prev[field] }));
  // }

  return (
    <div className="page-wrapper container fade-in-up">
      <div className={styles.layout}>

        {/* ── LEFT: User summary card ── */}
        <aside className={styles.sidebar}>
          <div className={styles.avatarCard}>
            {/* Avatar circle */}
            <div className={styles.avatar}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <h2 className={styles.userName}>{user?.name}</h2>
            <p className={styles.userEmail}>{user?.email}</p>
            <span className={`badge ${ROLE_BADGE[user?.role] || "badge-gray"}`}>
              {user?.role === "Admin" && <FaShieldAlt size={10} />}
              {user?.role}
            </span>
          </div>

        
        </aside>

        {/* ── RIGHT: Tabs + Forms ── */}
        <main className={styles.content}>
          {/* Tab bar */}
          <div className="tab-bar" style={{ marginBottom: "var(--sp-5)" }}>
            <button
              className={`tab-btn ${activeTab === "profile" ? "active" : ""}`}
              onClick={() => setActiveTab("profile")}
            >
              <FaEdit size={13} /> Edit Profile
            </button>


            {/* <button
              className={`tab-btn ${activeTab === "password" ? "active" : ""}`}
              onClick={() => setActiveTab("password")}
            >
              <FaLock size={13} /> Change Password
            </button> */}
          </div>

          {/* ── TAB 1: Profile ── */}
          {activeTab === "profile" && (
            <div className={`card ${styles.formCard}`}>
              <h3 className={styles.formTitle}>Profile Information</h3>
              {profileError && <div className={styles.errorBox}>{profileError}</div>}
              <form onSubmit={handleProfileSave} className={styles.form}>
                <div className="form-group">
                  <label className="form-label" htmlFor="name">Full Name</label>
                  <div className={styles.inputWrap}>
                    <FaUser className={styles.inputIcon} />
                    <input
                      id="name"
                      type="text"
                      className="form-input"
                      style={{ paddingLeft: 40 }}
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ name: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <div className={styles.inputWrap}>
                    <FaEnvelope className={styles.inputIcon} />
                    <input
                      type="email"
                      className="form-input"
                      style={{ paddingLeft: 40 }}
                      value={user?.email || ""}
                      readOnly
                      title="Email cannot be changed"
                    />
                  </div>
                  <span className="form-error" style={{ color: "var(--txt-muted)" }}>
                    Email address cannot be changed
                  </span>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                  style={{ alignSelf: "flex-start", marginTop: "var(--sp-2)" }}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </form>
            </div>
          )}

          {/* ── TAB 2: Password ── */}
          {/* {activeTab === "password" && (
            <div className={`card ${styles.formCard}`}>
              <h3 className={styles.formTitle}>Change Password</h3>
              {pwdError && <div className={styles.errorBox}>{pwdError}</div>}
              <form onSubmit={handlePasswordSave} className={styles.form}>

                {[
                  { id: "currentPassword", label: "Current Password", field: "current" },
                  { id: "newPassword",     label: "New Password",     field: "new" },
                  { id: "confirmPassword", label: "Confirm New Password", field: "confirm" },
                ].map(({ id, label, field }) => (
                  <div className="form-group" key={id}>
                    <label className="form-label" htmlFor={id}>{label}</label>
                    <div className={styles.inputWrap}>
                      <FaLock className={styles.inputIcon} />
                      <input
                        id={id}
                        name={id}
                        type={showPwd[field] ? "text" : "password"}
                        className="form-input"
                        style={{ paddingLeft: 40, paddingRight: 44 }}
                        value={pwdForm[id]}
                        onChange={(e) =>
                          setPwdForm((p) => ({ ...p, [id]: e.target.value }))
                        }
                      />
                      <button
                        type="button"
                        className={styles.eyeBtn}
                        onClick={() => togglePwd(field)}
                      >
                        {showPwd[field] ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                  style={{ alignSelf: "flex-start", marginTop: "var(--sp-2)" }}
                >
                  {loading ? "Changing..." : "Change Password"}
                </button>
              </form>
            </div>
          )} */}
        </main>
      </div>
    </div>
  );
}

export default ProfilePage;
