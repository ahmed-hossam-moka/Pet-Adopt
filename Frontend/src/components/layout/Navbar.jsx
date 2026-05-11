/*
  NAVBAR — Updated for Phase 2
  ──────────────────────────────
  WHAT CHANGED:
  • Removed the placeholder useAuthPlaceholder() function
  • Now uses the real useAuth() hook from AuthContext
  • User name, initials, role-based links are now REAL
  • Logout button actually clears the token
  • Dashboard link changes based on user role
*/

import { useState, useContext, useRef, useEffect } from "react";
import { NavLink, Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaPaw, FaBell, FaHeart, FaSearch, FaUser,
  FaTachometerAlt, FaSignOutAlt, FaShieldAlt,
  FaBars, FaTimes,
} from "react-icons/fa";
import toast from "react-hot-toast";

import { useAuth } from "../../hooks/useAuth";
import { SocketContext } from "../../context/SocketContext";
import styles from "./Navbar.module.css";

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const { user, isLoggedIn, isAdmin, isShelter, logout, isAdopter  } = useAuth();
  const socketCtx = useContext(SocketContext) || {};
  const { notifications = [], unreadCount = 0, markAllAsRead } = socketCtx;
  const navigate = useNavigate();
  const location = useLocation();
  const notifRef = useRef();

  useEffect(() => {
    function handleClickOutside(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotif(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    //setMobileOpen(false);
    //setShowNotif(false);
  }, [location.pathname]);

  const initials = user?.name?.charAt(0).toUpperCase() || "U";

  // Route to the correct dashboard based on role
  const dashboardPath = isAdmin
    ? "/dashboard/admin"
    : isShelter
    ? "/dashboard/shelter"
    : "/dashboard/adopter";

  function handleLogout() {
    logout();
    toast.success("Logged out. See you soon! 🐾");
    navigate("/");
    setMobileOpen(false);
  }

  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.navbar__inner}>

          {/* Logo */}
          <Link to="/" className={styles.navbar__logo}>
            <FaPaw className={styles.navbar__logo_icon} />
            <span>PetAdopt</span>
          </Link>

          {/* Desktop links */}
          <ul className={styles.navbar__links}>
            <li>
              <NavLink
                to="/browse"
                className={({ isActive }) =>
                  `${styles.navbar__link} ${isActive ? styles.active : ""}`
                }
              >
                <FaSearch size={12} /> Browse Pets
              </NavLink>
            </li>

            {/* Favorites — Adopters only */}
            {isLoggedIn && !isAdmin && !isShelter && (
              <li>
                <NavLink
                  to="/favorites"
                  className={({ isActive }) =>
                    `${styles.navbar__link} ${isActive ? styles.active : ""}`
                  }
                >
                  <FaHeart size={12} /> Favorites
                </NavLink>
              </li>
            )}

            {/* Dashboard link for all logged-in users */}
            {isLoggedIn && (
              <li>
                <NavLink
                  to={dashboardPath}
                  className={({ isActive }) =>
                    `${styles.navbar__link} ${isActive ? styles.active : ""}`
                  }
                >
                  <FaTachometerAlt size={12} /> Dashboard
                </NavLink>
              </li>
            )}
          </ul>

          {/* Right side */}
          <div className={styles.navbar__right}>
            {isLoggedIn ? (
              <>
                {/* Notification Bell */}
                <div className={styles.navbar__notifContainer} ref={notifRef} style={{ position: 'relative' }}>
                  <button
                    className={styles.navbar__notif}
                    aria-label="Notifications"
                    onClick={() => {
                      setShowNotif(!showNotif);
                      if (!showNotif && unreadCount > 0 && markAllAsRead) {
                        markAllAsRead();
                      }
                    }}
                  >
                    <FaBell />
                    {unreadCount > 0 && (
                      <span className={styles["navbar__notif-badge"]}>
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </button>

                  {showNotif && (
                    <div className={styles.navbar__notifDropdown}>
                      <div className={styles.navbar__notifHeader}>
                        Notifications
                        {notifications.length > 0 && (
                          <button onClick={() => markAllAsRead && markAllAsRead()}>
                            Mark all as read
                          </button>
                        )}
                      </div>
                      {notifications.length === 0 ? (
                        <div style={{ padding: '20px', textAlign: 'center', color: 'var(--txt-muted)', fontSize: '0.9rem' }}>
                          No notifications yet.
                        </div>
                      ) : (
                        notifications.map((n) => (
                          <div key={n.id} className={`${styles.navbar__notifItem} ${!n.isRead ? styles.unread : ''}`}>
                            <span>{n.message}</span>
                            <span className={styles.navbar__notifTime}>
                              {new Date(n.createdAt).toLocaleString()}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>

                {/* User avatar + dropdown */}
                <div className={styles.navbar__user}>
                  <div className={styles.navbar__avatar}>{initials}</div>
                  <span className={styles.navbar__user_name}>
                    {user?.name?.split(" ")[0]}
                  </span>

                  <div className={styles.navbar__dropdown}>
                    <Link to="/profile" className={styles.navbar__dropdown_item}>
                      <FaUser size={13} /> My Profile
                    </Link>
                    {
                      isShelter && (
                        <Link to={dashboardPath} className={styles.navbar__dropdown_item}>
                          <FaTachometerAlt size={13} /> Dashboard
                        </Link>
                      )
                    }
                    {
                      isShelter || isAdopter && (
                        <Link to={dashboardPath} className={styles.navbar__dropdown_item}>
                          <FaTachometerAlt size={13} /> Dashboard
                        </Link>
                      )
                    }
                    {isAdmin && (
                      <Link to="/dashboard/admin" className={styles.navbar__dropdown_item}>
                        <FaShieldAlt size={13} /> Admin Panel
                      </Link>
                  
                    )}
                    <div className={styles.navbar__dropdown_divider} />
                    <button
                      onClick={handleLogout}
                      className={`${styles.navbar__dropdown_item} ${styles.danger}`}
                    >
                      <FaSignOutAlt size={13} /> Log Out
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login"    className="btn btn-ghost btn-sm">Log In</Link>
                <Link to="/register" className="btn btn-primary btn-sm">Join Free</Link>
              </>
            )}

            <button
              className={styles.navbar__hamburger}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <div className={`${styles.navbar__mobile} ${mobileOpen ? styles.open : ""}`}>
        <NavLink to="/browse"
          className={({ isActive }) =>
            `${styles.navbar__mobile_link} ${isActive ? styles.active : ""}`
          }
          onClick={() => setMobileOpen(false)}
        >
          Browse Pets
        </NavLink>

        {isLoggedIn && !isAdmin && !isShelter && (
          <NavLink to="/favorites"
            className={({ isActive }) =>
              `${styles.navbar__mobile_link} ${isActive ? styles.active : ""}`
            }
            onClick={() => setMobileOpen(false)}
          >
            Favorites
          </NavLink>
        )}

        {isLoggedIn ? (
          <>
            <NavLink to="/profile"
              className={({ isActive }) =>
                `${styles.navbar__mobile_link} ${isActive ? styles.active : ""}`
              }
              onClick={() => setMobileOpen(false)}
            >
              My Profile
            </NavLink>
            <button
              className={`btn btn-ghost ${styles.navbar__mobile_link}`}
              onClick={handleLogout}
              style={{ textAlign: "left" }}
            >
              Log Out
            </button>
          </>
        ) : (
          <>
            <Link to="/login"    className="btn btn-ghost" onClick={() => setMobileOpen(false)}>Log In</Link>
            <Link to="/register" className="btn btn-primary" onClick={() => setMobileOpen(false)}>Join Free</Link>
          </>
        )}
      </div>
    </>
  );
}

export default Navbar;