import React from 'react';
import './css/style.select.css'
import { Menu } from '@headlessui/react';
import SelectContainer  from './table-dropdown.container';

const TableDropdown = ({ data=[],onChange,show,label,value, containerClass='', as='div'  })=>{
    const [ defaultValue, setDefaultValue ] = React.useState(undefined);
    const [ openInternal, setOpen ] = React.useState(false);
    const pushChange = (item)=>{
        if(onChange){
            onChange(item);
            setOpen(false)
        }
    }

    React.useEffect(()  => {
        if (value){
            if (Array.isArray(data)){
                if (data.length){
                    const getDefaultValue = data.find(item => item.value === value)
                    if (getDefaultValue) setDefaultValue(getDefaultValue.label)
                }
            }
        }else if (data){
            if (Array.isArray(data)){
                if (data.length){
                    setDefaultValue(data[ 0 ].label)
                }
            }
        }
        if (show){
            setOpen(true)
        }else{
            setOpen(false)
        }
    }, [ show,value ]);


    return(
        <Menu as={ as } className={`position-relative d-inline-block p-0 cursor-pointer ${containerClass}`}>
            {({ open }) => <SelectContainer label={ label } value={ value } defaultValue={ defaultValue } data={ data } pushChange={ pushChange } open={ open && openInternal }/>}
        </Menu>

    );
}

export default TableDropdown;
