import { useState } from "react";
import { FaTimes, FaHistory, FaSpinner } from "react-icons/fa";
import toast from "react-hot-toast";

import { addHistory } from "../../services/adoptionService";
import styles from "./AddHistoryModal.module.css";

const EMPTY_FORM = {
  previousPetName: "",
  previousPetType: "",
  veterinaryReference: "",
  experience: "",
  yearOfAdoption: ""
};

function AddHistoryModal({ isOpen, onClose, onCreated }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  }

  function validate() {
    const newErrors = {};
    if (!form.previousPetType.trim()) {
      newErrors.previousPetType = "Pet Type is required.";
    }
    
    // Year validation (optional but if provided must be valid)
    if (form.yearOfAdoption) {
      const year = parseInt(form.yearOfAdoption, 10);
      const currentYear = new Date().getFullYear();
      if (isNaN(year) || year < 1900 || year > currentYear) {
        newErrors.yearOfAdoption = "Enter a valid year.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const payload = {
        previousPetName: form.previousPetName.trim() || null,
        previousPetType: form.previousPetType.trim(),
        veterinaryReference: form.veterinaryReference.trim() || null,
        experience: form.experience.trim() || null,
        yearOfAdoption: form.yearOfAdoption ? parseInt(form.yearOfAdoption, 10) : null
      };

      const result = await addHistory(payload);
      toast.success("Adoption history added!");
      setForm(EMPTY_FORM);
      if (onCreated) onCreated(result.data || result); // Pass back the new history
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to add history.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  function handleBackdropClick(e) {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }

  return (
    <div className={styles.overlay} onClick={handleBackdropClick}>
      <div className={styles.modal}>
        
        <button className={styles.closeBtn} onClick={onClose} disabled={loading}>
          <FaTimes />
        </button>

        <div className={styles.header}>
          <div className={styles.iconWrap}>
            <FaHistory />
          </div>
          <h2 className={styles.title}>Add Adoption History</h2>
          <p className={styles.subtitle}>
            Share your past experience with pets to strengthen your future adoption requests.
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          
          <div className={styles.row}>
            <div className="form-group">
              <label className="form-label">Previous Pet Type *</label>
              <input
                type="text"
                name="previousPetType"
                className={`form-input ${errors.previousPetType ? "input-error" : ""}`}
                placeholder="e.g. Dog, Cat, Bird"
                value={form.previousPetType}
                onChange={handleChange}
                disabled={loading}
              />
              {errors.previousPetType && <span className="form-error">{errors.previousPetType}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Previous Pet Name</label>
              <input
                type="text"
                name="previousPetName"
                className="form-input"
                placeholder="e.g. Buddy"
                value={form.previousPetName}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
          </div>

          <div className={styles.row}>
            <div className="form-group">
              <label className="form-label">Year of Adoption</label>
              <input
                type="number"
                name="yearOfAdoption"
                className={`form-input ${errors.yearOfAdoption ? "input-error" : ""}`}
                placeholder="e.g. 2019"
                value={form.yearOfAdoption}
                onChange={handleChange}
                disabled={loading}
              />
              {errors.yearOfAdoption && <span className="form-error">{errors.yearOfAdoption}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Veterinary Reference</label>
              <input
                type="text"
                name="veterinaryReference"
                className="form-input"
                placeholder="Dr. Smith - 555-0123"
                value={form.veterinaryReference}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Experience Details</label>
            <textarea
              name="experience"
              className="form-input"
              rows="3"
              placeholder="Describe your experience caring for this pet or any special needs you managed..."
              value={form.experience}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <FaSpinner className={styles.spinner} /> Saving...
                </>
              ) : (
                "Save History"
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

export default AddHistoryModal;
