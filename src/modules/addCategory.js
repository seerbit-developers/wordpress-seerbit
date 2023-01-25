import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import './css/module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useForm } from "react-hook-form";

function AddCategory({
    show_category,
    close,
    process,
    save,
}) {
    const { register, errors, handleSubmit } = useForm({ mode: 'onChange' });

    return (
        <Modal show={show_category} onHide={close} centered>
            <Modal.Header className='border-none pb-0'>
                <Modal.Title className='font-20'>Add Category</Modal.Title>
                <button type='button' className='close font-24' onClick={close}>
                    <span>×</span>
                    <span className='sr-only'>Close</span>
                </button>
            </Modal.Header>
            <Modal.Body className='pt-0'>
                <form
                    className='w-100'
                    onSubmit={handleSubmit(save)}
                >
                    <div className='row'>
                        <div className='col-md-12 py-2'>
                            <label className='font-14'>Category Name <span className='badge badge-danger'>{errors.name && errors.name.message}</span></label>
                            <input
                                className='form-control mh-40'
                                type='text'
                                name='name'
                                ref={register({
                                    required: "Category name is required",
                                    maxLength: {
                                        value: 90,
                                        message: 'Max character input is 90'
                                    },
                                    minLength: {
                                        value: 2,
                                        message: 'Min character input is 2'
                                    }
                                })}
                                disabled={process}
                            />
                        </div>

                        <div className=' form-group col-md-12 py-2'>
                            <label className='font-12'>Category Description <span className='badge badge-danger'>{errors.description && errors.description.message}</span></label>
                            <textarea
                                name='description'
                                className='form-control'
                                ref={register(
                                    {
                                        required: "Category Description is required",
                                        maxLength: {
                                            value: 250,
                                            message: 'Max character input is 90'
                                        },
                                        minLength: {
                                            value: 2,
                                            message: 'Min character input is 2'
                                        }
                                    })}
                                rows='3'
                                style={{ resize: 'none' }}
                                disabled={process}
                            />
                        </div>
                        <div className='col-12'>
                            <Button
                                variant='xdh'
                                size='lg'
                                block
                                height={'40px'}
                                className='brand-btn'
                                type='submit'
                                disabled={process}
                            >
                                {process ?
                                    <FontAwesomeIcon icon={faSpinner} spin className='font-20' /> : <span>Save</span>
                                }

                            </Button>
                        </div>
                    </div>
                </form>
            </Modal.Body>
        </Modal>
    );
}

export default AddCategory;
