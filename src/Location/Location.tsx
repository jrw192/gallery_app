import React from 'react';
import { useState, useEffect, useRef } from 'react';
import './Location.css';

export const Location: React.FC<{ setLocation: (location: string) => void }>
    = ({ setLocation }) => {
        const [options, setOptions] = useState<string[]>([]);
        const [filteredOptions, setFilteredOptions] = useState<string[]>([]);
        const [searchText, setSearchText] = React.useState('');
        const [isOpen, setIsOpen] = useState(false);
        const dropdownRef = useRef<HTMLInputElement | null>(null);

        useEffect(() => {
            getCities().then((cities) => {
                setOptions(cities);
                setFilteredOptions(cities);
            });
        }, []);

        useEffect(() => {
            const handleClickOutside = (event: MouseEvent) => {
                if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                    setIsOpen(false);
                }
            };

            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }, []);

        useEffect(() => {
            getFilteredOptions();
        }, [searchText]);

        let toggleDropdown = () => {
            setIsOpen(!isOpen);
        };

        const handleOptionClick = (option: string) => {
            setLocation(option);
            setSearchText(option);
            setIsOpen(false);
        };

        let getCities = () => {
            return fetch(`${process.env.REACT_APP_SERVER_HOSTNAME}/getcities`)
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    return data;
                })
                .catch(error => console.error('Error:', error));
        }

        let getFilteredOptions = () => {
            if (searchText.length === 0) {
                setFilteredOptions(options);
            } else {
                const filtered = options.filter(option => option.toLowerCase().startsWith(searchText)
                );
                setFilteredOptions(filtered);
            }
        };

        let updateSearchText = (e: React.ChangeEvent<HTMLInputElement>) => {
            setSearchText(e.target.value);
        }

        return (
            <>
                <div className="dropdown" ref={dropdownRef}>
                    <input
                        type="text"
                        value={searchText}
                        placeholder="location"
                        onClick={toggleDropdown}
                        onChange={updateSearchText}
                    />
                    {isOpen && (
                        <div className="dropdown-menu">
                            {
                                filteredOptions.map(el =>
                                    <div className="dropdown-item" key={el} onClick={() => handleOptionClick(el)}>{el}</div>
                                )
                            }
                        </div>
                    )}
                </div>
            </>


        )
    };