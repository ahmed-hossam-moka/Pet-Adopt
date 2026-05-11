import { useState, useEffect } from "react";
import { FaHistory, FaInbox, FaPlus, FaTrash, FaPaw } from "react-icons/fa";
import toast from "react-hot-toast";

import { getMyAdoptionRequests, getMyHistory, deleteHistory } from "../../services/adoptionService";
import { useAuth } from "../../hooks/useAuth";

import AddHistoryModal from "../../components/adopter/AddHistoryModal";
import styles from "./AdopterDashboard.module.css";

// Format ISO date to readable string
function formatDate(iso) {
  if (!iso) return "N/A";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric", month: "short", day: "numeric",
  });
}

function AdopterDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("requests"); // "requests" | "history"

  // Requests State
  const [requests, setRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(false);

  // History State
  const [historyItems, setHistoryItems] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [isAddHistoryModalOpen, setIsAddHistoryModalOpen] = useState(false);

  // ─── LOAD DATA ──────────────────────────────────────────────────

  async function loadRequests() {
    setLoadingRequests(true);
    try {
      const data = await getMyAdoptionRequests();
      // Sort newest first
      data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setRequests(data || []);
    } catch {
      toast.error("Failed to load your adoption requests.");
    } finally {
      setLoadingRequests(false);
    }
  }

  useEffect(() => {
    if (activeTab === "requests") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      loadRequests();
    }
  }, [activeTab]);

  async function loadHistory() {
    setLoadingHistory(true);
    try {
      const data = await getMyHistory();
      // Sort newest year first
      data.sort((a, b) => (b.yearOfAdoption || 0) - (a.yearOfAdoption || 0));
      setHistoryItems(data || []);
    } catch {
      toast.error("Failed to load your adoption history.");
    } finally {
      setLoadingHistory(false);
    }
  }

  useEffect(() => {
    if (activeTab === "history") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      loadHistory();
    }
  }, [activeTab]);

  // ─── ACTIONS ────────────────────────────────────────────────────

  function handleHistoryCreated(newItem) {
    setHistoryItems((prev) => [newItem, ...prev]);
  }

  async function handleDeleteHistory(id, name) {
    if (!window.confirm(`Are you sure you want to delete history for ${name}?`)) return;
    try {
      await deleteHistory(id);
      setHistoryItems((prev) => prev.filter((h) => h.historyId !== id));
      toast.success("History deleted.");
    } catch {
      toast.error("Failed to delete history.");
    }
  }

  // ─── RENDER HELPERS ──────────────────────────────────────────────

  const requestsCount = requests.length;

  return (
    <div className={`page-wrapper container fade-in-up ${styles.page}`}>
      
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <h1 className="section-title">Dashboard</h1>
          <span className={styles.badge}>{user?.role || "Adopter"}</span>
        </div>
        {activeTab === "history" && (
          <button className="btn btn-primary" onClick={() => setIsAddHistoryModalOpen(true)}>
            <FaPlus size={12} /> Add History
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === "requests" ? styles.tabActive : ""}`}
          onClick={() => setActiveTab("requests")}
        >
          <FaInbox /> My Requests
          {requestsCount > 0 && <span className={styles.tabBadge}>{requestsCount}</span>}
        </button>
        <button
          className={`${styles.tab} ${activeTab === "history" ? styles.tabActive : ""}`}
          onClick={() => setActiveTab("history")}
        >
          <FaHistory /> Adoption History
        </button>
      </div>

      {/* ── TAB CONTENT: REQUESTS ── */}
      {activeTab === "requests" && (
        <div className={styles.tabContent}>
          {loadingRequests ? (
            <div className={styles.empty}>Loading requests...</div>
          ) : requests.length === 0 ? (
            <div className={styles.empty}>
              <FaInbox className={styles.emptyIcon} />
              <h3>No adoption requests</h3>
              <p>You haven't sent any adoption requests yet. Browse our pets and find your new best friend!</p>
            </div>
          ) : (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Pet Name</th>
                    <th>Shelter / Owner</th>
                    <th>Message Sent</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((req) => (
                    <tr key={req.requestId}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}>
                          <FaPaw style={{ color: 'var(--clr-primary)' }} />
                          {req.petName}
                        </div>
                      </td>
                      <td>{req.shelterName}</td>
                      <td>
                        <span className={styles.subText}>
                          {req.message ? (req.message.length > 50 ? req.message.substring(0, 50) + "..." : req.message) : "No message provided"}
                        </span>
                      </td>
                      <td>{formatDate(req.createdAt)}</td>
                      <td>
                        <span className={`${styles.statusBadge} ${
                          req.status === "Pending" ? styles.statusPending : 
                          req.status === "Accepted" ? styles.statusAccepted : styles.statusRejected
                        }`}>
                          {req.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── TAB CONTENT: HISTORY ── */}
      {activeTab === "history" && (
        <div className={styles.tabContent}>
          {loadingHistory ? (
            <div className={styles.empty}>Loading history...</div>
          ) : historyItems.length === 0 ? (
            <div className={styles.empty}>
              <FaHistory className={styles.emptyIcon} />
              <h3>No history added</h3>
              <p>Add your previous pet experience to increase your chances of adoption approval.</p>
            </div>
          ) : (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Pet Type & Name</th>
                    <th>Year</th>
                    <th>Veterinary Reference</th>
                    <th>Experience</th>
                    <th style={{ textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {historyItems.map((item) => (
                    <tr key={item.historyId}>
                      <td>
                        <div className={styles.flexCol}>
                          <strong>{item.previousPetType}</strong>
                          <span className={styles.subText}>{item.previousPetName || "Unnamed"}</span>
                        </div>
                      </td>
                      <td>{item.yearOfAdoption || "N/A"}</td>
                      <td>
                        <span className={styles.subText}>
                          {item.veterinaryReference || "None provided"}
                        </span>
                      </td>
                      <td>
                        <span className={styles.subText} style={{ display: 'block', maxWidth: '300px' }}>
                          {item.experience || "No details provided"}
                        </span>
                      </td>
                      <td>
                        <div className={styles.actionCell} style={{ justifyContent: "flex-end" }}>
                          <button
                            className={`${styles.iconBtn} ${styles.deleteBtn}`}
                            title="Delete"
                            onClick={() => handleDeleteHistory(item.historyId, item.previousPetName || item.previousPetType)}
                          >
                            <FaTrash />
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

      {/* Modals */}
      <AddHistoryModal
        isOpen={isAddHistoryModalOpen}
        onClose={() => setIsAddHistoryModalOpen(false)}
        onCreated={handleHistoryCreated}
      />
    </div>
  );
}

export default AdopterDashboard;
