import React, { useState, useEffect, useRef } from 'react';
import { FaBars, FaSearch, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const searchRef = useRef(null);

  const menuItems = [
    { name: 'Home', href: '/' },
    { name: 'Employee', href: '/employee/management' },
    { name: 'Attendence', href: '/employee/attendence' },
    { name: 'Setting', href: '/setting' },
    { name: 'Check In', href: '/device' },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (searchQuery.length > 0) {
      // Simulated API call for autocomplete suggestions
      const simulatedSuggestions = [
        'About our company',
        'Services we offer',
        'Portfolio projects',
        'Contact information',
      ].filter((suggestion) =>
        suggestion.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSuggestions(simulatedSuggestions);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);

  return (
    <nav className='bg-gray-800 text-white p-4 fixed w-full top-0 left-0 z-50 min-h-[70px]'>
      <div className='container mx-auto flex justify-between items-center'>
        <div className='flex items-center'>
          <button
            className='lg:hidden mr-4 focus:outline-none'
            onClick={toggleMenu}
            aria-label='Toggle menu'
          >
            {isMenuOpen ? (
              <FaTimes className='h-6 w-6' />
            ) : (
              <FaBars className='h-6 w-6' />
            )}
          </button>
          <Link to='/' className='flex items-center'>
            <img
              src='https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1469&q=80'
              alt='Logo'
              className='h-8 w-auto mr-2'
            />
            {!isSearchOpen && (
              <span className='font-bold text-xl'>PBL3 Project</span>
            )}
          </Link>
        </div>

        <div className='hidden lg:flex space-x-4'>
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className='hover:text-gray-300 transition duration-300 ease-in-out'
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className='flex items-center' ref={searchRef}>
          <button
            className='focus:outline-none mr-4'
            onClick={toggleSearch}
            aria-label='Toggle search'
          >
            <FaSearch className='h-5 w-5' />
          </button>
          <AnimatePresence>
            {isSearchOpen && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.3 }}
                className='relative'
              >
                <input
                  type='text'
                  placeholder='Search...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='bg-gray-700 text-white px-4 py-2 rounded-full focus:outline-none'
                />
                {suggestions.length > 0 && (
                  <ul className='absolute left-0 right-0 mt-2 bg-gray-700 rounded-md shadow-lg'>
                    {suggestions.map((suggestion, index) => (
                      <li
                        key={index}
                        className='px-4 py-2 hover:bg-gray-600 cursor-pointer'
                        onClick={() => {
                          setSearchQuery(suggestion);
                          setSuggestions([]);
                        }}
                      >
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className='lg:hidden mt-4'
          >
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className='block py-2 hover:bg-gray-700 transition duration-300 ease-in-out'
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
