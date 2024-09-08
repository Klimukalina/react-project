import React, { useState, useEffect } from 'react';
import styles from './Footer.module.scss';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false); 

  const logoUrl = `${process.env.PUBLIC_URL}/img/logo.svg`;
  
  const handleScroll = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleVisibility = () => {
    if (window.scrollY > 100) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  return (
    <footer className={styles.footer}>
      <Link to="/">
        <img src={logoUrl} alt="logo" className={styles.logo} />
      </Link>

      <nav className={styles.nav}>
        <ul className={styles.navList}>
          <li className={styles.navItem}>
            <Link to="https://github.com/Klimukalina" className={styles.navLink}>
              Github
            </Link>
          </li>
          <li className={styles.navItem}>
            <a href="mailto:klimukalina4@gmail.com" className={styles.navLink}>
              Contacts
            </a>
          </li>
          <li className={styles.navItem}>
            <Link to="/" className={styles.navLink}>
              Rights
            </Link>
          </li>
        </ul>
      </nav>

      <div className={styles.goToBackBlock}>
        {isVisible && ( // Відображаємо кнопку лише коли прокручено більше ніж на 100 пікселів
          <>
            <p onClick={handleScroll} className={styles.goToBack}>
              Back to top
            </p>
            <button className={styles.goToBackButton} onClick={handleScroll}></button>
          </>
        )}
      </div>
    </footer>
  );
};
