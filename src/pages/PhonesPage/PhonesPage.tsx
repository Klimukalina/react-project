import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Product } from '../../types/types';
import { useSearchParams } from 'react-router-dom';
import { ProductsContext } from '../../context/ProductsContext';
import { fetchProducts } from '../../servises/products';
import styles from './PhonesPage.module.scss';
import { Breadcrumbs } from '../../components/BradCrumbs';
import { Loader } from '../../components/Loader';
import { ProductList } from '../../components/ProductList';

export const PhonesPage: React.FC = () => {
  const [phones, setPhones] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
  const [isPerPageMenuOpen, setIsPerPageMenuOpen] = useState(false);
  const { goods, updateGoods } = useContext(ProductsContext);
  const [searchParams, setSearchParams] = useSearchParams();

  const sortBy = searchParams.get('sort') || 'age';
  const perPage = searchParams.get('perPage') || '4';

  useEffect(() => {
    if (!goods?.length) {
      setIsLoading(true);
      fetchProducts()
        .then(data => updateGoods(data as Product[]))
        .catch(e => console.error(e))
        .finally(() => setIsLoading(false));
    }
  }, [goods, updateGoods]);

  useEffect(() => {
    if (goods?.length) {
      setPhones(goods.filter(good => good.category === 'phones'));
    }
  }, [goods]);

  const phonesAmount = useMemo(() => phones.length, [phones]);

  const sortByOptions = useMemo(
    () => [
      { name: "Newest", value: "age" },
      { name: "Alphabetically", value: "title" },
      { name: "Cheapest", value: "price" },
    ],
    []
  );

  const itemsPerPageOptions = useMemo(() => ["4", "8", "16", "All"], []);

  const handleSortBySelect = (value: string) => {
    setIsSortMenuOpen(false);
    const params = new URLSearchParams(searchParams);
    params.set('sort', value);
    setSearchParams(params);
  };
  

  const handlePerPageSelect = (value: string) => {
    setIsPerPageMenuOpen(false);
    const params = new URLSearchParams(searchParams);
    if (value === 'All') {
      params.delete('perPage');
      params.delete('page');
    } else {
      params.set('perPage', value);
    }
    setSearchParams(params);
  };

  const sortedPhones = useMemo(() => {
    const sorted = [...phones];
    switch (sortBy) {
      case 'age':
        return sorted.sort((a, b) => b.year - a.year);
      case 'title':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'price':
        return sorted.sort((a, b) => a.price - b.price);
      default:
        return sorted;
    }
  }, 
  [sortBy, phones]);

  return (
    <div className={styles.pageContainer}>
      <Breadcrumbs />
      <h1 className={styles.pageTitle}>Mobile phones</h1>
      <p className={styles.productCount}>{phonesAmount} models</p>
      <div className={styles.filtersContainer}>
        <div className={styles.filterWrapper}>
          <div className={styles.dropdown}>
          <button
            className={styles.dropdownTrigger}
            onClick={() => {
              console.log('Dropdown button clicked');
              setIsSortMenuOpen(!isSortMenuOpen);
            }}
            // onBlur={() => setIsSortMenuOpen(false)} //
          >
            {sortByOptions.find(option => option.value === sortBy)?.name || 'Sort By'}
            <span
              className={`${styles.dropdownIcon} ${
                isSortMenuOpen ? styles.iconUp : styles.iconDown
              }`}
            />
          </button>

            <div className={`${styles.dropdownMenu} ${isSortMenuOpen ? styles.menuOpen : ''}`}>
              <ul className={styles.menuOptions}>
                {sortByOptions.map(option => (
                  <li
                    className={styles.menuOption}
                    key={option.value}
                    onClick={() => handleSortBySelect(option.value)}
                  >
                    {option.name}
                </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className={styles.filterWrapper}>
          <div className={styles.dropdown}>
            <button
              className={styles.dropdownTrigger}
              onClick={() => setIsPerPageMenuOpen(!isPerPageMenuOpen)}
             // onBlur={() => setIsPerPageMenuOpen(false)} //
            >
              {perPage || '4'}
              <span
                className={`${styles.dropdownIcon} ${
                  isPerPageMenuOpen ? styles.iconUp : styles.iconDown
                }`}
              />
            </button>
            <div className={`${styles.dropdownMenu} ${isPerPageMenuOpen ? styles.menuOpen : ''}`}>
              <ul className={styles.menuOptions}>
                {itemsPerPageOptions.map(option => (
                  <li
                    className={styles.menuOption}
                    key={option}
                    onClick={() => handlePerPageSelect(option)}
                  >
                    {option}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      {isLoading ? (
        <Loader />
      ) : (
        <ProductList itemsPerPage={+perPage} items={sortedPhones} />
      )}
    </div>
  );
};
