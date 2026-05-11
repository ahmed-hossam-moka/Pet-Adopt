/*
  ADD PET MODAL
  ─────────────
  A modal form for Shelter / PetOwner to list a new pet.

  FIELDS:
    • Name (text)
    • Animal Type (select: Dog/Cat/Bird/Rabbit/Other)
    • Breed (text)
    • Age in months (number)
    • Gender (select: Male/Female)
    • Location (text)
    • Health Status (text)
    • Description (textarea)
    • Image URL (text — single URL for simplicity)

  SUBMIT:
    Calls POST /api/pets via createPet()
    Backend returns the created pet with isApproved=false
    (Admin must approve before it shows on the Browse page)

  NOTE ON IMAGE URLS:
    The backend accepts imageUrls as an array.
    We collect one URL field and wrap it: [url]
    A more advanced version would allow multiple image uploads.
*/

import { useState, useEffect } from "react";
import { FaTimes, FaPaw, FaPlus } from "react-icons/fa";
import toast from "react-hot-toast";

import { createPet, updatePet } from "../../services/petService";
import styles from "./AddPetModal.module.css";

const ANIMAL_TYPES = ["Dog", "Cat", "Bird", "Rabbit", "Other"];
const GENDERS      = ["Male", "Female"];

const EMPTY_FORM = {
  name:         "",
  animalType:   "Dog",
  breed:        "",
  age:          "",        // months — converted to number on submit
  gender:       "Male",
  location:     "",
  healthStatus: "",
  description:  "",
  imageUrl:     "",        // single URL, wrapped into array on submit
};

function AddPetModal({ isOpen, onClose, onCreated, initialData }) {
  const [form, setForm]     = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setForm({
          name: initialData.name || "",
          animalType: initialData.animalType || "Dog",
          breed: initialData.breed || "",
          age: initialData.age || "",
          gender: initialData.gender || "Male",
          location: initialData.location || "",
          healthStatus: initialData.healthStatus || "",
          description: initialData.description || "",
          imageUrl: initialData.primaryImageUrl || "",
        });
      } else {
        setForm(EMPTY_FORM);
      }
      setErrors({});
    }
  }, [isOpen, initialData]);
  if (!isOpen) return null;

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // clear error on change
  }

  function validate() {
    const e = {};
    if (!form.name.trim())         e.name         = "Name is required.";
    if (!form.breed.trim())        e.breed        = "Breed is required.";
    if (!form.age || form.age < 0) e.age          = "Enter age in months (e.g. 24 = 2 years).";
    if (!form.location.trim())     e.location     = "Location is required.";
    if (!form.healthStatus.trim()) e.healthStatus = "Health status is required.";
    if (!form.description.trim())  e.description  = "Please add a short description.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const payload = {
        name:         form.name.trim(),
        animalType:   form.animalType,
        breed:        form.breed.trim(),
        age:          parseInt(form.age, 10),
        gender:       form.gender,
        location:     form.location.trim(),
        healthStatus: form.healthStatus.trim(),
        description:  form.description.trim(),
        imageUrls:    form.imageUrl.trim() ? [form.imageUrl.trim()] : [],
      };

      if (initialData) {
        const updated = await updatePet(initialData.petId, payload);
        toast.success(`${form.name} updated successfully!`);
        onCreated(updated); // Pass back updated pet
      } else {
        const created = await createPet(payload);
        toast.success(`${form.name} listed! ⏳ Awaiting admin approval.`);
        setForm(EMPTY_FORM);
        onCreated(created); // notify parent to refresh the pet list
      }
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to create pet.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  function handleBackdrop(e) {
    if (e.target === e.currentTarget) onClose();
  }

  return (
    <div className={styles.overlay} onClick={handleBackdrop}>
      <div className={styles.modal}>

        <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
          <FaTimes />
        </button>

        <div className={styles.header}>
          <div className={styles.iconWrap}><FaPaw /></div>
          <h2 className={styles.title}>{initialData ? "Edit Pet" : "List a New Pet"}</h2>
          <p className={styles.subtitle}>
            {initialData ? "Update your pet's details." : "Your pet will appear after Admin approval."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form} noValidate>

          {/* Row: Name + Animal Type */}
          <div className={styles.row}>
            <div className="form-group">
              <label className="form-label">Pet Name *</label>
              <input
                name="name" type="text" className="form-input"
                placeholder="e.g. Buddy"
                value={form.name} onChange={handleChange}
              />
              {errors.name && <span className="form-error">{errors.name}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Animal Type</label>
              <select name="animalType" className="form-input" value={form.animalType} onChange={handleChange}>
                {ANIMAL_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>

          {/* Row: Breed + Age */}
          <div className={styles.row}>
            <div className="form-group">
              <label className="form-label">Breed *</label>
              <input
                name="breed" type="text" className="form-input"
                placeholder="e.g. Golden Retriever"
                value={form.breed} onChange={handleChange}
              />
              {errors.breed && <span className="form-error">{errors.breed}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Age (months) *</label>
              <input
                name="age" type="number" min="0" className="form-input"
                placeholder="e.g. 18 = 1.5 years"
                value={form.age} onChange={handleChange}
              />
              {errors.age && <span className="form-error">{errors.age}</span>}
            </div>
          </div>

          {/* Row: Gender + Location */}
          <div className={styles.row}>
            <div className="form-group">
              <label className="form-label">Gender</label>
              <select name="gender" className="form-input" value={form.gender} onChange={handleChange}>
                {GENDERS.map((g) => <option key={g}>{g}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Location *</label>
              <input
                name="location" type="text" className="form-input"
                placeholder="e.g. Cairo, Egypt"
                value={form.location} onChange={handleChange}
              />
              {errors.location && <span className="form-error">{errors.location}</span>}
            </div>
          </div>

          {/* Health Status */}
          <div className="form-group">
            <label className="form-label">Health Status *</label>
            <input
              name="healthStatus" type="text" className="form-input"
              placeholder="e.g. Vaccinated, Neutered, Healthy"
              value={form.healthStatus} onChange={handleChange}
            />
            {errors.healthStatus && <span className="form-error">{errors.healthStatus}</span>}
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label">Description *</label>
            <textarea
              name="description" className={`form-input ${styles.textarea}`}
              placeholder="Tell adopters about this pet's personality, habits, needs..."
              value={form.description} onChange={handleChange} rows={3}
            />
            {errors.description && <span className="form-error">{errors.description}</span>}
          </div>

          {/* Image URL */}
          <div className="form-group">
            <label className="form-label">Image URL <span className={styles.optional}>(optional)</span></label>
            <input
              name="imageUrl" type="url" className="form-input"
              placeholder="https://example.com/pet-photo.jpg"
              value={form.imageUrl} onChange={handleChange}
            />
          </div>

          <div className={styles.actions}>
            <button type="button" className="btn btn-ghost" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (
                <><span className={styles.spinner} /> {initialData ? "Saving..." : "Listing..."}</>
              ) : (
                <><FaPlus size={12} /> {initialData ? "Save Changes" : "List Pet"}</>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default AddPetModal;
