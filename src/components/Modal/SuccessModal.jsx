"use client"

import { Fragment, useState } from 'react';
import './modal.scss'
import CloseIcon from '../../assets/images/svg/closeIcon.svg'
import Image from 'next/image';
import Button from '../Button';
import Typography from '../Typography';
import SuccessIcon from '../../assets/images/svg/success.svg';
import errorIcon from '../../assets/images/svg/error.svg';

const SuccessModal = ({ id, showModal, setShowModal, modalImage, modalTitle, modalText, btnPrimaryLabel, btnSecondaryLabel, className, onClose, error }) => {
    const closeModal = () => {
      setShowModal(false);
    }

    return (
        <Fragment>
            {showModal && (
              <dialog id="my_modal_2" className="modal" open={showModal}>
                  <div className="modal-box rounded-none py-10 bg-primary-content  card-frame">

                    {/* close button */}
                    {/* <Button
                        size='btn-sm'
                        variant="btn-ghost"
                        className='absolute right-2 top-2'
                        iconPosition='left'
                        icon={CloseIcon}
                        onClick={closeModal}
                    >
                    </Button> */}

                    <div className='flex justify-center'>
                       <Image src={error ? errorIcon : SuccessIcon} alt="success icon" className="cursor-pointer w-20 mb-5" />
                    </div>

                    {
                        modalTitle && 
                        <Typography
                          className="mb-1 w-full text-center"
                          size="text-xl"
                          weight="font-medium"
                          color='text-base-content mt-2'
                        >
                          {modalTitle}
                        </Typography>
                    }
                 
                    
                    <div className='flex justify-center gap-4 mt-2 pt-5'>
                     
                        <Button
                            variant="btn-primary btn-sm"
                            className='min-w-32 px-0'
                            onClick={onClose}
                        >
                            Done
                        </Button>
                      
                    </div>
                  

                  </div>
              </dialog>
            )}
        </Fragment>
    );
};

export default SuccessModal;
