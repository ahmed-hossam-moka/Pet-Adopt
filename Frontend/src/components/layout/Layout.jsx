/*
  WHAT IS A LAYOUT COMPONENT?
  ----------------------------
  The Layout component is a "wrapper" that wraps every page.
  Instead of putting <Navbar> and <Footer> in every single page,
  we put them once here, and every page gets them automatically.

  Think of it like a picture frame — the frame stays the same,
  only the picture (children) inside changes.

  HOW DOES {children} WORK?
  --------------------------
  In React, {children} refers to whatever you put BETWEEN the
  opening and closing tags of a component.

  Example:
    <Layout>
      <HomePage />     ← this is "children"
    </Layout>

  So Layout renders: Navbar + <HomePage /> + Footer
*/

import Navbar from "./Navbar";
import Footer from "./Footer";
import styles from "./Layout.module.css";


function Layout({ children }) {


  return (
    <div className={styles.layout}>
      {/* Fixed navbar at top */}
      <Navbar />

      {/* Main content area — pushes down below the navbar */}
      <main className={styles.main}>
        {children}
      </main>

      {/* Footer at the bottom */}
      <Footer />
    </div>
  );
}

export default Layout;
