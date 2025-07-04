import React from 'react';
import Select from 'react-select';

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  options: Option[];
  value: Option[];
  onChange: (newValue: Option[]) => void;
  placeholder: string;
  isMulti?: boolean;
  error?: string;
}

const CustomSelector: React.FC<CustomSelectProps> = ({
  options,
  value,
  onChange,
  placeholder,
  isMulti = true,
  error
}) => {
  return (
    <div className="relative">
      <Select
        isMulti={isMulti}
        options={options}
        value={value}
        onChange={(newValue) => onChange(newValue as Option[])}
        placeholder={placeholder}
        className="react-select-container"
        classNamePrefix="react-select"
        styles={{
          control: (base, _state) => ({
            ...base,
            backgroundColor: 'rgba(38, 38, 38, 0.5)',
            borderColor: error ? '#ef4444' : 'rgba(255, 255, 255, 0.1)',
            borderRadius: '0.75rem',
            padding: '0.25rem',
            boxShadow: 'none',
            '&:hover': {
              borderColor: '#a855f7'
            },
            '&:focus-within': {
              borderColor: '#a855f7',
              boxShadow: '0 0 0 2px rgba(168, 85, 247, 0.2)'
            }
          }),
          menu: (base) => ({
            ...base,
            backgroundColor: '#1a1a1a',
            backdropFilter: 'blur(8px)',
            borderRadius: '0.75rem',
            overflow: 'hidden',
            zIndex: 50,
            position: 'absolute',
            width: '100%',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.3)'
          }),
          menuPortal: (base) => ({
            ...base,
            zIndex: 9999
          }),
          container: (base) => ({
            ...base,
            zIndex: 40
          }),
          option: (base, state) => ({
            ...base,
            backgroundColor: state.isFocused 
              ? 'rgba(168, 85, 247, 0.2)' 
              : state.isSelected 
                ? 'rgba(168, 85, 247, 0.3)'
                : 'transparent',
            color: 'white',
            cursor: 'pointer',
            '&:active': {
              backgroundColor: 'rgba(168, 85, 247, 0.3)'
            }
          }),
          multiValue: (base) => ({
            ...base,
            backgroundColor: 'rgba(168, 85, 247, 0.2)',
            borderRadius: '0.5rem',
            padding: '0.1rem'
          }),
          multiValueLabel: (base) => ({
            ...base,
            color: '#e9d5ff'
          }),
          multiValueRemove: (base) => ({
            ...base,
            color: '#e9d5ff',
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: 'rgba(168, 85, 247, 0.4)',
              color: 'white'
            }
          }),
          input: (base) => ({
            ...base,
            color: 'white'
          }),
          placeholder: (base) => ({
            ...base,
            color: 'rgba(156, 163, 175, 0.8)'
          }),
          singleValue: (base) => ({
            ...base,
            color: 'white'
          }),
          dropdownIndicator: (base) => ({
            ...base,
            color: 'rgba(156, 163, 175, 0.8)',
            '&:hover': {
              color: 'white'
            }
          }),
          clearIndicator: (base) => ({
            ...base,
            color: 'rgba(156, 163, 175, 0.8)',
            '&:hover': {
              color: 'white'
            }
          }),
          menuList: (base) => ({
            ...base,
            padding: '4px',
            backgroundColor: '#1a1a1a',
            '::-webkit-scrollbar': {
              width: '8px',
              height: '0px',
            },
            '::-webkit-scrollbar-track': {
              background: '#1a1a1a'
            },
            '::-webkit-scrollbar-thumb': {
              background: '#4b4b4b',
              borderRadius: '4px'
            },
            '::-webkit-scrollbar-thumb:hover': {
              background: '#5b5b5b'
            }
          })
        }}
        menuPortalTarget={document.body}
        menuPosition="fixed"
      />
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

export default CustomSelector;