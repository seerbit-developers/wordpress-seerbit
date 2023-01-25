import React, {Fragment} from 'react';
import { Listbox } from '@headlessui/react';

const SelectContainer = ({
  data,
                           containerClass,
                           itemClass,
                             bottomComponent
}) => {
  return <Listbox.Options className={`headlessui-listbox-options ${containerClass}`}>
    {
          data && Array.isArray(data) && data.length > 0 && data.map( (item, i)=>
              <Listbox.Option
                  key={ item.value }
                  value={ item }
                  as={Fragment}
              >
                {
                  ({ active, selected }) => (
               <li
                   className={`${
                       selected ? 'active' : ''
                   } ${itemClass} headlessui-listbox-option`}
                   style={{borderRadius:0}}
               > {item.label}</li>
                  )}
              </Listbox.Option>
        )
    }
    {
        bottomComponent &&
        <Listbox.Options className={`headlessui-listbox-options ${containerClass}`}>
    {bottomComponent}
        </Listbox.Options>
    }


  </Listbox.Options>
    // return <>
    //     {label && <label htmlFor="">{label}</label>}
    //     <div className='dropdown--select-box-container' ref={ containerNode }>
    //         <Menu.Button as="div" className={`w-100 text-capitalize ${bold ? 'font-weight-bold' : ''}`}>
    //             {defaultValue}
    //             <DropdownIcon style={ {
    //                 position:'absolute',
    //                 top: '16px',
    //                 right: '7px'
    //             } } />
    //         </Menu.Button>
    //         {
    //             !data &&
    //             <Menu.Items as="div" className="dropdown--select-parent">
    //                 <Menu.Item as="div" className='dropdown--select-item'>
    //                     <p>Select</p>
    //                 </Menu.Item>
    //             </Menu.Items>
    //         }
    //
    //         {
    //
    //             data && Array.isArray(data) && data.length > 0 ?
    //             <Menu.Items as="div" className="dropdown--select-parent">
    //                 <Menu.Item disabled className="dropdown--select-item">
    //                     <p className="opacity-75">Select</p>
    //                 </Menu.Item>
    //                 {
    //                     data && Array.isArray(data) && data.length > 0 && data.map( (item, i)=>
    //                         <Menu.Item as="div" className={`dropdown--select-item ${item.value === value && 'dropdown--select-item-active'}`} key={ i } onClick={ ()=>pushChange(item) } >
    //                             <p>{item.label}</p>
    //                         </Menu.Item>
    //                     )
    //                 }
    //
    //             </Menu.Items>
    //                 :
    //                 (data && Array.isArray(data) && data.length === 0) &&
    //                 <Menu.Items as="div" className="dropdown--select-parent">
    //                             <Menu.Item as="div" className='dropdown--select-item'>
    //                                 <p>Select</p>
    //                             </Menu.Item>
    //                 </Menu.Items>
    //         }
    //
    //     </div>
    // </>
}

export default SelectContainer;
