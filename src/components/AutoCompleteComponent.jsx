import { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import "../styles/autoCompleteStyle.css";

const Autocomplete = ({ data, onSelect }) => {
    const [filteredData, setFilteredData] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const inputRef = useRef(null);

    const handleFilter = (e) => {
        const value = e.target.value;
        if (value) {
            const filtered = data.filter(item => item.toLowerCase().includes(value.toLowerCase()));
            setFilteredData(filtered);
            setShowDropdown(true);
        } else {
            setFilteredData([]);
            setShowDropdown(false);
        }
    };

    const handleSelect = (item) => {
        inputRef.current.value = item;
        setFilteredData([]);
        setShowDropdown(false);
        onSelect(item);
    };

    return (
        <div className="autocomplete-container">
            <input
                ref={inputRef}
                type="text"
                placeholder="Buscar..."
                onChange={handleFilter}
                className="input"
            />
            {showDropdown && (
                <div className="autocomplete-dropdown">
                    {filteredData.map((item, index) => (
                        <div
                            key={index}
                            className="autocomplete-item"
                            onClick={() => handleSelect(item)}
                        >
                            {item}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

Autocomplete.propTypes = {
    data: PropTypes.arrayOf(PropTypes.string).isRequired,
    onSelect: PropTypes.func.isRequired
};

export default Autocomplete;
