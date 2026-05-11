/*
  HERO SECTION
  -------------
  The big eye-catching banner at the top of the home page.

  Features:
  - Animated gradient headline
  - Stats row (adopted pets, shelters, breeds)
  - CTA (Call To Action) button → Browse Pets
  - Floating animated paw prints as decoration
*/

import { Link } from "react-router-dom";
import { FaSearch, FaPaw } from "react-icons/fa";
import styles from "./HeroSection.module.css";

// Auth hook
import { useAuth } from "../hooks/useAuth";

// These stats will eventually come from the backend
const STATS = [
  { value: "1,200+", label: "Pets Adopted" },
  { value: "80+", label: "Shelters" },
  { value: "50+", label: "Breeds" },
];

function HeroSection() {
  // Get current logged-in user
  const { user } = useAuth();

  // Auth state
  const isLoggedIn = !!user;

  // Roles
  const isAdmin = user?.role === "Admin";
  const isShelter = user?.role === "Shelter";
  const isPetOwner = user?.role === "PetOwner";
  const isAdopter = user?.role === "Adopter";

  return (
    <section className={styles.hero}>
      {/* Decorative floating paw prints */}
      <div className={styles.hero__decor} aria-hidden="true">
        <FaPaw className={styles.paw1} />
        <FaPaw className={styles.paw2} />
        <FaPaw className={styles.paw3} />
        <FaPaw className={styles.paw4} />
      </div>

      <div className={`container ${styles.hero__content}`}>
        {/* Pill tag */}
        <div className={styles.hero__tag}>
          <FaPaw /> Find Your Forever Friend
        </div>

        {/* Main headline */}
        <h1 className={styles.hero__title}>
          Give a Pet a{" "}
          <span className="gradient-text">Loving Home</span>
          <br />
          Change a Life Forever
        </h1>

        {/* Sub-text */}
        <p className={styles.hero__subtitle}>
          Browse hundreds of pets from shelters and caring owners.
          Your perfect companion is waiting for you right now.
        </p>

        {/* CTA Buttons */}
        <div className={styles.hero__actions}>
          {/* Browse button */}
          <Link to="/browse" className="btn btn-primary btn-lg">
            <FaSearch /> Browse Pets
          </Link>

          {/* Hide button for admin */}
          {!isAdmin && (
            <Link
              to={
                !isLoggedIn
                  ? "/login"
                  : isShelter || isPetOwner
                  ? "/dashboard/shelter/"
                  : isAdopter
                  ? "/dashboard/adopted-pets"
                  : "/browse"
              }
              className="btn btn-outline btn-lg"
            >
              {!isLoggedIn
                ? "Login"
                : isShelter || isPetOwner
                ? "My Pets"
                : isAdopter
                ? "Adopted Pets"
                : "Explore"}
            </Link>
          )}
        </div>

        {/* Stats row */}
        <div className={styles.hero__stats}>
          {STATS.map((stat) => (
            <div key={stat.label} className={styles.hero__stat}>
              <span className={styles.hero__stat_value}>
                {stat.value}
              </span>
              <span className={styles.hero__stat_label}>
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HeroSection;