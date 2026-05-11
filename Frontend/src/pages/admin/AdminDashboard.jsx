/*
  ADMIN DASHBOARD
  ───────────────
  The moderation center.
  Admins review and approve/reject newly registered shelters and newly created pets.
*/

import { useState, useEffect } from "react";
import { FaUserShield, FaPaw, FaCheck, FaTimes, FaUserAlt } from "react-icons/fa";
import toast from "react-hot-toast";

import {
  getPendingUsers, approveUser, rejectUser,
  getPendingPets, approvePet, rejectPet
} from "../../services/adminService";

import PendingPetCard from "../../components/admin/PendingPetCard";
import EmptyState from "../../components/ui/EmptyState";
import styles from "./AdminDashboard.module.css";

// Format ISO date to readable string
function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric", month: "short", day: "numeric",
  });
}

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("accounts"); // "accounts" | "pets"

  // State
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const [pets, setPets] = useState([]);
  const [loadingPets, setLoadingPets] = useState(false);

  async function loadUsers() {
    setLoadingUsers(true);
    try {
      const data = await getPendingUsers();
      setUsers(data || []);
    } catch {
      toast.error("Failed to load pending accounts.");
    } finally {
      setLoadingUsers(false);
    }
  }

  // Load Users
  useEffect(() => {
    if (activeTab === "accounts") loadUsers();
  }, [activeTab]);

  async function loadPets() {
    setLoadingPets(true);
    try {
      const data = await getPendingPets();
      setPets(data || []);
    } catch {
      toast.error("Failed to load pending pets.");
    } finally {
      setLoadingPets(false);
    }
  }

  // Load Pets
  useEffect(() => {
    if (activeTab === "pets") loadPets();
  }, [activeTab]);

  

  // ─── USER ACTIONS ──────────────────────────────────────────────

  async function handleApproveUser(id, name) {
    if (!window.confirm(`Approve ${name}? They will be able to log in and post pets.`)) return;
    try {
      await approveUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      toast.success(`${name} approved!`);
    } catch {
      toast.error("Failed to approve user.");
    }
  }

  async function handleRejectUser(id, name) {
    if (!window.confirm(`Reject ${name}? Their account will be deactivated.`)) return;
    try {
      await rejectUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      toast.success(`${name} rejected.`);
    } catch {
      toast.error("Failed to reject user.");
    }
  }

  // ─── PET ACTIONS ───────────────────────────────────────────────

  async function handleApprovePet(id) {
    if (!window.confirm("Approve this pet? It will become public on the Browse page.")) return;
    try {
      await approvePet(id);
      setPets((prev) => prev.filter((p) => p.petId !== id));
      toast.success("Pet approved and is now public!");
    } catch {
      toast.error("Failed to approve pet.");
    }
  }

  async function handleRejectPet(id) {
    if (!window.confirm("Reject this pet listing?")) return;
    try {
      await rejectPet(id);
      setPets((prev) => prev.filter((p) => p.petId !== id));
      toast.success("Pet listing rejected.");
    } catch {
      toast.error("Failed to reject pet.");
    }
  }

  // ─── RENDER HELPERS ────────────────────────────────────────────

  const usersCount = users.length;
  const petsCount  = pets.length;

  return (
    <div className={`page-wrapper container fade-in-up ${styles.page}`}>
      
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <h1 className="section-title">Admin Moderation</h1>
          <span className={styles.badge}>Admin</span>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === "accounts" ? styles.tabActive : ""}`}
          onClick={() => setActiveTab("accounts")}
        >
          <FaUserShield /> Pending Accounts
          {usersCount > 0 && <span className={styles.tabBadge}>{usersCount}</span>}
        </button>
        <button
          className={`${styles.tab} ${activeTab === "pets" ? styles.tabActive : ""}`}
          onClick={() => setActiveTab("pets")}
        >
          <FaPaw /> Pending Pets
          {petsCount > 0 && <span className={styles.tabBadge}>{petsCount}</span>}
        </button>
      </div>

      {/* ── TAB CONTENT: ACCOUNTS ── */}
      {activeTab === "accounts" && (
        <div className={styles.tabContent}>
          {loadingUsers ? (
            <div className={styles.empty}>Loading accounts...</div>
          ) : usersCount === 0 ? (
            <EmptyState
              icon={<FaUserShield />}
              title="No pending accounts"
              description="All shelter and pet owner registrations have been reviewed."
            />
          ) : (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Date Registered</th>
                    <th style={{ textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <div className={styles.userCell}>
                          <div className={styles.userIcon}><FaUserAlt size={14} /></div>
                          {user.name}
                        </div>
                      </td>
                      <td>{user.email}</td>
                      <td>{formatDate(user.createdAt)}</td>
                      <td>
                        <div className={styles.actionCell} style={{ justifyContent: "flex-end" }}>
                          <button
                            className={`${styles.iconBtn} ${styles.approveBtn}`}
                            onClick={() => handleApproveUser(user.id, user.name)}
                          >
                            <FaCheck /> Approve
                          </button>
                          <button
                            className={`${styles.iconBtn} ${styles.rejectBtn}`}
                            onClick={() => handleRejectUser(user.id, user.name)}
                          >
                            <FaTimes /> Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── TAB CONTENT: PETS ── */}
      {activeTab === "pets" && (
        <div className={styles.tabContent}>
          {loadingPets ? (
            <div className={styles.empty}>Loading pets...</div>
          ) : petsCount === 0 ? (
            <EmptyState
              icon={<FaPaw />}
              title="No pending pets"
              description="All pet listings have been reviewed and are public."
            />
          ) : (
            <div className={styles.grid}>
              {pets.map((pet) => (
                <PendingPetCard
                  key={pet.petId}
                  pet={pet}
                  onApprove={handleApprovePet}
                  onReject={handleRejectPet}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
