import React, { memo } from 'react';
import DropdownTreeSelect from 'react-dropdown-tree-select';
import 'react-dropdown-tree-select/dist/styles.css'

export const MultilevelSelect = memo(({ data, onChange }) => {
    return (
        <DropdownTreeSelect 
            key="category-select"
            data={data} 
            keepTreeOnSearch 
            onChange={onChange}
        />
    )
});