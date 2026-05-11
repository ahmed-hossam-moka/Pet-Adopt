import { Link } from "react-router-dom";
import {
  FaPaw,
  FaHeart,
  FaGithub,
  FaInstagram,
  FaTwitter,
} from "react-icons/fa";

import styles from "./Footer.module.css";
import { useAuth } from "../../hooks/useAuth";

function Footer() {
  // Current user
  const { user } = useAuth();

  // Auth state
  const isLoggedIn = !!user;

  // Roles
  const isAdmin = user?.role === "Admin";
  const isShelter = user?.role === "Shelter";
  const isPetOwner = user?.role === "PetOwner";
  const isAdopter = user?.role === "Adopter";

  return (
    <footer className={styles.footer}>
      <div className={styles.footer__inner}>
        {/* Brand column */}
        <div className={styles.footer__brand}>
          <div className={styles.footer__logo}>
            <FaPaw className={styles.footer__paw} />
            <span>PetAdopt</span>
          </div>

          <p className={styles.footer__tagline}>
            Connecting hearts. Saving lives.
            <br />
            Finding forever homes.
          </p>

          <div className={styles.footer__social}>
            <a
              href="https://x.com/ahmedhossammoka"
              target="_blank"
              rel="noreferrer"
              aria-label="Twitter"
            >
              <FaTwitter />
            </a>

            <a
              href="https://instagram.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
            >
              <FaInstagram />
            </a>

            <a
              href="https://github.com/ahmed-hossam-moka"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
            >
              <FaGithub />
            </a>
          </div>
        </div>

        {/* Platform Links */}
        <div className={styles.footer__col}>
          <h4>Platform</h4>

          <ul>
            <li>
              <Link to="/browse">Browse Pets</Link>
            </li>

            {/* Guest only */}
            {!isLoggedIn && (
              <>
                <li>
                  <Link to="/register">Become an Adopter</Link>
                </li>

                <li>
                  <Link to="/register">Register Shelter</Link>
                </li>
              </>
            )}

            {/* Shelter */}
            {isShelter && (
              <>
                <li>
                  <Link to="/dashboard/shelter/pets">
                    My Shelter Pets
                  </Link>
                </li>

                <li>
                  <Link to="/dashboard/shelter/add-pet">
                    Add New Pet
                  </Link>
                </li>
              </>
            )}

            {/* Pet Owner */}
            {isPetOwner && (
              <>
                <li>
                  <Link to="/dashboard/shelter">
                    My Pets
                  </Link>
                </li>
              </>
            )}

            {/* Adopter */}
            {isAdopter && (
              <>

                <li>
                  <Link to="/favorites">
                    Favorites
                  </Link>
                </li>
              </>
            )}

            {/* Admin */}
            {isAdmin && (
              <>
                <li>
                  <Link to="/admin/dashboard">
                    Admin Dashboard
                  </Link>
                </li>

                <li>
                  <Link to="/admin/users">
                    Manage Users
                  </Link>
                </li>

                <li>
                  <Link to="/admin/pets">
                    Manage Pets
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>

        {/* Account Links */}
        <div className={styles.footer__col}>
          <h4>Account</h4>

          <ul>
            {!isLoggedIn ? (
              <>
                <li>
                  <Link to="/login">Log In</Link>
                </li>

                <li>
                  <Link to="/register">Register</Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/profile">My Profile</Link>
                </li>

                {isShelter && (
                  <li>
                    <Link to="/dashboard/shelter">
                      Shelter Dashboard
                    </Link>
                  </li>
                )}
                {isAdmin && (
                  <li>
                    <Link to="/admin/dashboard">
                      Admin Panel
                    </Link>
                  </li>
                )}
              </>
            )}
          </ul>
        </div>
      </div>

      {/* Bottom */}
      <div className={styles.footer__bottom}>
        <p>
          Made with{" "}
          <FaHeart className={styles.heart} /> by the
          PetAdopt Team &nbsp;·&nbsp;
          {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}

export default Footer;