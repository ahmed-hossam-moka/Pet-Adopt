/*
  SHELTER DASHBOARD
  ─────────────────
  The control center for Shelter and PetOwner roles.
  Two main tabs:
    1. My Pets: list, add, edit, delete pets.
    2. Requests: view and manage adoption requests.
*/

import { useState, useEffect } from "react";
import { FaPlus, FaTrash, FaEdit, FaHome, FaInbox, FaPaw, FaStar } from "react-icons/fa";
import toast from "react-hot-toast";

import { getMyPets, deletePet } from "../../services/petService";
import { getRequestsByPet, acceptRequest, rejectRequest } from "../../services/shelterAdoptionService";
import { getOwnerReviews } from "../../services/reviewService";
import { useAuth } from "../../hooks/useAuth";

import AddPetModal from "../../components/shelter/AddPetModal";
import RequestCard from "../../components/shelter/RequestCard";
import EmptyState from "../../components/ui/EmptyState";
import styles from "./ShelterDashboard.module.css";

function ShelterDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("pets"); // "pets" | "requests"

  // State for Pets Tab
  const [pets, setPets] = useState([]);
  const [loadingPets, setLoadingPets] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingPet, setEditingPet] = useState(null);

  // State for Requests Tab
  const [requests, setRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(false);

  // State for Reviews Tab
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);

  async function loadPets() {
    setLoadingPets(true);
    try {
      const data = await getMyPets();
      setPets(data || []);
    } catch {
      toast.error("Failed to load your pets.");
    } finally {
      setLoadingPets(false);
    }
  }

  // 1. Fetch Pets on mount
  useEffect(() => {
    loadPets();
  }, []);

  async function loadAllRequests() {
    setLoadingRequests(true);
    try {
      // We must fetch requests for EACH pet the owner has
      // A real-world app might have a specialized backend endpoint for "getAllMyRequests"
      // But based on our current API, we iterate over the pets:
      const allRequests = [];
      // Make sure we have pets loaded first
      const currentPets = pets.length > 0 ? pets : await getMyPets();
      
      for (const pet of currentPets) {
        const petReqs = await getRequestsByPet(pet.petId);
        allRequests.push(...petReqs);
      }
      
      // Sort newest first
      allRequests.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setRequests(allRequests);
    } catch {
      toast.error("Failed to load adoption requests.");
    } finally {
      setLoadingRequests(false);
    }
  }

  // 2. Fetch Requests when tab changes to "requests"
  useEffect(() => {
    if (activeTab === "requests") {
      loadAllRequests();
    } else if (activeTab === "reviews") {
      loadReviews();
    }
  }, [activeTab]);

  async function loadReviews() {
    setLoadingReviews(true);
    try {
      if (!user?.id) return;
      const data = await getOwnerReviews(user.id);
      setReviews(data.items || []);
    } catch {
      toast.error("Failed to load reviews.");
    } finally {
      setLoadingReviews(false);
    }
  }

  // ─── PET ACTIONS ────────────────────────────────────────────────

  function handlePetCreatedOrUpdated(savedPet) {
    if (editingPet) {
      setPets((prev) => prev.map((p) => p.petId === savedPet.petId ? savedPet : p));
      setEditingPet(null);
    } else {
      setPets((prev) => [savedPet, ...prev]);
    }
  }

  function handleEditClick(pet) {
    setEditingPet(pet);
    setIsAddModalOpen(true);
  }

  async function handleDeletePet(id, name) {
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) return;
    try {
      await deletePet(id);
      setPets((prev) => prev.filter((p) => p.petId !== id));
      toast.success(`${name} deleted.`);
    } catch {
      toast.error("Failed to delete pet.");
    }
  }

  // ─── REQUEST ACTIONS ─────────────────────────────────────────────

  async function handleAccept(requestId) {
    if (!window.confirm("Accept this request? Other pending requests for this pet will be canceled.")) return;
    try {
      await acceptRequest(requestId);
      toast.success("Request accepted!");
      loadAllRequests(); // reload to get updated statuses
      loadPets(); // reload to update pet statuses to "Adopted"
    } catch {
      toast.error("Failed to accept request.");
    }
  }

  async function handleReject(requestId) {
    if (!window.confirm("Reject this request?")) return;
    try {
      await rejectRequest(requestId);
      toast.success("Request rejected.");
      loadAllRequests();
    } catch {
      toast.error("Failed to reject request.");
    }
  }

  // ─── RENDER HELPERS ──────────────────────────────────────────────

  const pendingCount = requests.filter(r => r.status === "Pending").length;

  return (
    <div className={`page-wrapper container fade-in-up ${styles.page}`}>
      
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <h1 className="section-title">Dashboard</h1>
          <span className={styles.badge}>{user?.role || "Shelter"}</span>
        </div>
        {activeTab === "pets" && (
          <button className="btn btn-primary" onClick={() => { setEditingPet(null); setIsAddModalOpen(true); }}>
            <FaPlus size={12} /> List New Pet
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === "pets" ? styles.tabActive : ""}`}
          onClick={() => setActiveTab("pets")}
        >
          <FaPaw /> My Pets
        </button>
        <button
          className={`${styles.tab} ${activeTab === "requests" ? styles.tabActive : ""}`}
          onClick={() => setActiveTab("requests")}
        >
          <FaInbox /> Adoption Requests
          {pendingCount > 0 && <span className={styles.tabBadge}>{pendingCount}</span>}
        </button>
        <button
          className={`${styles.tab} ${activeTab === "reviews" ? styles.tabActive : ""}`}
          onClick={() => setActiveTab("reviews")}
        >
          <FaStar /> Reviews
        </button>
      </div>

      {/* ── TAB CONTENT: MY PETS ── */}
      {activeTab === "pets" && (
        <div className={styles.tabContent}>
          {loadingPets ? (
            <div className={styles.empty}>Loading pets...</div>
          ) : pets.length === 0 ? (
            <EmptyState
              icon={<FaHome />}
              title="No pets listed yet"
              description='Click "List New Pet" to add your first animal to the platform.'
            />
          ) : (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Pet</th>
                    <th>Type / Breed</th>
                    <th>Status</th>
                    <th style={{ textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pets.map((pet) => (
                    <tr key={pet.petId}>
                      <td>
                        <div className={styles.petCell}>
                          <img
                            src={pet.primaryImageUrl || "https://placedog.net/100/100?random"}
                            alt={pet.name}
                            className={styles.petImg}
                            onError={(e) => { e.target.src = "https://placedog.net/100/100?random"; }}
                          />
                          {pet.name}
                        </div>
                      </td>
                      <td>
                        <div>{pet.animalType}</div>
                        <div style={{ fontSize: "0.8rem", color: "var(--txt-muted)" }}>
                          {pet.breed}
                        </div>
                      </td>
                      <td>
                        <span className={`${styles.statusBadge} ${
                          pet.isApproved ? styles.statusApproved : styles.statusPending
                        }`}>
                          {pet.isApproved ? "Approved" : "Pending Admin"}
                        </span>
                      </td>
                      <td>
                        <div className={styles.actionCell} style={{ justifyContent: "flex-end" }}>
                          <button 
                            className={styles.iconBtn} 
                            title="Edit"
                            onClick={() => handleEditClick(pet)}
                          >
                            <FaEdit />
                          </button>
                          <button
                            className={`${styles.iconBtn} ${styles.deleteBtn}`}
                            title="Delete"
                            onClick={() => handleDeletePet(pet.petId, pet.name)}
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

      {/* ── TAB CONTENT: REQUESTS ── */}
      {activeTab === "requests" && (
        <div className={styles.tabContent}>
          {loadingRequests ? (
            <div className={styles.empty}>Loading requests...</div>
          ) : requests.length === 0 ? (
            <EmptyState
              icon={<FaInbox />}
              title="No adoption requests"
              description="When someone applies to adopt one of your pets, it will appear here."
            />
          ) : (
            <div className={styles.requestsGrid}>
              {requests.map((req) => (
                <RequestCard
                  key={req.requestId}
                  request={req}
                  onAccept={handleAccept}
                  onReject={handleReject}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── TAB CONTENT: REVIEWS ── */}
      {activeTab === "reviews" && (
        <div className={styles.tabContent}>
          {loadingReviews ? (
            <div className={styles.empty}>Loading reviews...</div>
          ) : reviews.length === 0 ? (
            <EmptyState
              icon={<FaStar />}
              title="No reviews yet"
              description="Adopters can leave reviews after successful adoptions."
            />
          ) : (
            <div className={styles.requestsGrid}>
              {reviews.map((rev) => (
                <div key={rev.reviewId} className={styles.reviewCard} style={{ background: "var(--bg-card)", padding: "var(--sp-4)", borderRadius: "var(--radius-lg)", border: "1px solid var(--bg-border)" }}>
                  <div style={{ display: "flex", gap: "4px", color: "#eab308", marginBottom: "8px" }}>
                    {[...Array(5)].map((_, i) => <FaStar key={i} color={i < rev.rating ? "#eab308" : "var(--bg-border)"} />)}
                  </div>
                  <p style={{ color: "var(--txt-primary)", marginBottom: "8px" }}>"{rev.comment}"</p>
                  <small style={{ color: "var(--txt-muted)" }}>By {rev.reviewerName} on {new Date(rev.createdAt).toLocaleDateString()}</small>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      <AddPetModal
        isOpen={isAddModalOpen}
        initialData={editingPet}
        onClose={() => { setIsAddModalOpen(false); setEditingPet(null); }}
        onCreated={handlePetCreatedOrUpdated}
      />
    </div>
  );
}

export default ShelterDashboard;
