import React, { useState } from "react";
import useWindowSize from "components/useWindowSize";
import { useTranslation } from "react-i18next";
import {faTrashAlt} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const ItemFields = ({ index, items, handleChange,onRemoveRow }) => {
  const size = useWindowSize();
  const { width, height } = size;
  const { t } = useTranslation();
  const[rate, setRate] = useState(items[index]?.rate)
  return (
    <div>
      <div className="d-flex flex-row justify-content-between">
        <div className="col-lg-3 m-0 p-0">
          <div className="form-group">
            <input
              type="text"
              name="itemName"
              className="form-control"
              placeholder="Type here..."
              value={items[index]?.itemName}
              onChange={(e) => handleChange(e, index)}
              required
            />
          </div>
        </div>
        <div className="col-lg-2">
          <div className="form-group">
            <input
              name="quantity"
              type="number"
              min={0}
              max={100000000}
              step="1"
              pattern="[0-9]{10}"
              onKeyDown={event => event.key==='.' && event.preventDefault()}
              onInput={event=>event.target.value = event.target.value.replace(/[^0-9]*/g,'')}
              className="form-control"
              value={items[index]?.quantity}
              onChange={(e) => handleChange(e, index)}
              required
            />
          </div>
        </div>
        <div className="col-lg-1 p-0">
            <input
              name="rate"
              type="number"
              min={0}
              max={100000000}
              step="0.01"
              className="form-control"
              value={rate}
              onChange={(e) => {
                if(e.target.value <= 100000000){
                  handleChange(e, index)
                  setRate(e.target.value)
                }
              }}
              required
            />
        </div>
        <div className="col-lg-2">
          <div className="form-group">
            <input
              name="tax"
              type="number"
              step="0.01"
              className="form-control"
              value={items[index]?.tax}
              onChange={(e) => handleChange(e, index)}
            />
          </div>
        </div>
        <div className="col-lg-2">
          <div className="form-group">
            <input
              name="amount"
              type="number"
              disabled
              value={items[index]?.amount.toFixed(2) || 0}
              className="form-control"
            />
          </div>
        </div>
        <div className="col-lg-1 d-flex align-items-center">
          <div className="form-group">
            <FontAwesomeIcon icon={faTrashAlt} className='cursor-pointer'onClick={()=>onRemoveRow(index)}/>
          </div>
        </div>
      </div>
    </div>
  );
};

ItemFields.propTypes = {};
export default ItemFields;
