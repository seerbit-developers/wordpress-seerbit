import React from 'react';
import './css/style.select.css'
import { Transition, Listbox } from '@headlessui/react';
import SelectContainer from './dropdown.select.container';
import PropTypes from "prop-types";
import DropdownIcon from './dropdownIcon';
const DropdownSelect = ({
                            data = [],
                            onChange,
                            label,
                            value,
                            disabled,
                            containerClass = '',
                            buttonClass = '',
                            itemClass = '',
                            as = 'div',
                            defaultValue = { label: label || `Select`, value: null, name: label || 'Select' },
                            id = '',
                            bold,
    bottomComponent=null
}) => {
    const pushChange = (item) => {
        onChange && onChange(item);
    }

    const getDefaultValue = ()=>{
        if (defaultValue && typeof defaultValue !== 'object'){
            return  data.find(u=>u.value === defaultValue || u.label === defaultValue ) || null;
        }
        return defaultValue;
    }

    const getValue = ()=>{
        if (value && typeof value !== 'object'){
            return  data.find(u=>u.value === value || u.label === value ) || null;
        }
        return value;
    }


    return (

            <Listbox
                value={getValue() || getDefaultValue()}
                onChange={pushChange}
            >
                <Listbox.Button className={`headlessui-listbox-button ${buttonClass} ${disabled ? 'disabledBackground' : ''}`}>
                    <span>{getValue() ? getValue().label : getDefaultValue() ? getDefaultValue().label : 'Select'}</span>
                    <DropdownIcon/>
                </Listbox.Button>
                <Transition
                    enter="anim_show"
                    enterFrom="anim_hide"
                    enterTo="anim_show"
                    leave="anim_hide"
                    leaveFrom="anim_show"
                    leaveTo="anim_hide"
                    as='div'
                    className='position-relative'
                >
                    <SelectContainer
                        data={data}
                        containerClass={containerClass}
                        itemClass={itemClass}
                        bottomComponent={bottomComponent}
                    />
                </Transition>
            </Listbox>

    );
}

DropdownSelect.propTypes = {
    data: PropTypes.any,
    onChange: PropTypes.func,
    label: PropTypes.string,
    containerClass: PropTypes.string,
    as: PropTypes.string,
    value: PropTypes.any,
    defaultValue: PropTypes.any,
    id: PropTypes.any,
    bold: PropTypes.any,
    bottomComponent: PropTypes.any,
}
export default DropdownSelect;
