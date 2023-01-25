import React from 'react';
import { Menu } from '@headlessui/react';
import DropdownIcon from './dropdownIcon';
import {useTranslation} from "react-i18next";

const SelectContainer = ({ label, value, data, defaultValue, pushChange, open })=>{
    const containerNode = React.useRef();
    const {t} = useTranslation()
    React.useEffect(()  => {
        if (open)
        {
            //positioning author: https://medium.com/carwow-product-engineering/building-a-simple-tooltip-component-that-never-goes-off-screen-c7039dcab5f9
            const dropdown = containerNode.current.children[ 1 ];
            const placeholderRect = containerNode.current.getBoundingClientRect();
            const dropdownRect = dropdown.getBoundingClientRect();
            const screenPadding = 5;
            const dropdownRightX = dropdownRect.x + dropdownRect.width;
            const placeholderRightX = placeholderRect.x + placeholderRect.width;
            if (dropdownRect.x < 0) {
                dropdown.style.left = '0';
                dropdown.style.right = 'auto';
                dropdown.style.transform = `translateX(${-placeholderRect.x + screenPadding}px)`;
            } else if (dropdownRightX > window.outerWidth) {
                dropdown.style.left = 'auto';
                dropdown.style.right = '0';
                dropdown.style.transform = `translateX( ${ (window.outerWidth - placeholderRightX) - screenPadding }px)`;
            }
        }else{

        }
    }, [ open ]);

    return <>
        <div ref={ containerNode }>
            <Menu.Button as="div">
                <DropdownIcon />
            </Menu.Button>

            {
                data && Array.isArray(data) && data.length > 0 ?
                <Menu.Items as="div" className="dropdown--select-table-parent">
                    {
                        data && Array.isArray(data) && data.length > 0 && data.map( (item, i)=>
                            <Menu.Item className={`dropdown--select-table-item ${item.value === value && 'dropdown--select-table-item-active'}`} key={ i } onClick={ ()=>pushChange(item) } >
                                {({ active }) => (
                                    <span>{item.label}</span>
                                )}

                            </Menu.Item>
                        )
                    }

                </Menu.Items>
                    :
                    <Menu.Items as="div" className="dropdown--select-table-parent">
                                <Menu.Item className='dropdown--select-table-item'>
                                    {({ active }) => (
                                        <span>{t('No Actions')}</span>
                                    )}

                                </Menu.Item>
                    </Menu.Items>
            }

        </div>
    </>
}

export default SelectContainer;
