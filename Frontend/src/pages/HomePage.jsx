/*
  HOME PAGE — Updated for Phase 3 (Real API data)
  ─────────────────────────────────────────────────
  CHANGES:
  • getAllPets() now returns a PagedResult — we read .items
  • TypePills filtering now uses animalType (not type) from real API
  • Uses PetGrid loading prop (skeleton cards built in)
  • Fetches only 4 pets for the homepage preview
*/

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

import HeroSection from "../components/HeroSection";
import SearchBar   from "../components/SearchBar";
import TypePills   from "../components/TypePills";
import PetGrid     from "../components/pet/PetGrid";

import { getAllPets } from "../services/petService";
import styles from "./HomePage.module.css";

function HomePage() {
  const [pets, setPets]         = useState([]);
  const [activeType, setActiveType] = useState("all");
  const [loading, setLoading]   = useState(true);

  // Fetch a preview of pets (first page, 8 pets) when the page loads
  useEffect(() => {
    getAllPets(1, 8)
      .then((result) => {
        // result is PagedResult<PetResponseDto>
        // the actual array is result.items
        setPets(result.items || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Filter the preview by selected type
  // Real API uses "Dog", "Cat" etc. (Title Case)
  const filteredPets =
    activeType === "all"
      ? pets
      : pets.filter(
          (p) => p.animalType?.toLowerCase() === activeType.toLowerCase()
        );

  return (
    <div className={styles.page}>
      {/* Hero Section */}
      <HeroSection />

      {/* Search + Filter Section */}
      <section className={styles.searchSection}>
        <div className="container">
          <SearchBar />
          <TypePills onSelect={setActiveType} active={activeType} />
        </div>
      </section>

      {/* Featured Pets Section */}
      <section className={styles.featured}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Featured Pets</h2>
            <Link to="/browse" className="btn btn-outline btn-sm">
              View All <FaArrowRight size={12} />
            </Link>
          </div>

          {/* PetGrid handles loading skeletons internally */}
          <PetGrid
            pets={filteredPets.slice(0, 4)}
            loading={loading}
            skeletonCount={4}
          />
        </div>
      </section>
    </div>
  );
}

export default HomePage;