"use client";

import { Fragment } from "react";
import "./modal.scss";
import CloseIcon from "../../assets/images/svg/closeIcon.svg";
import Button from "../Button";
import Slideshow from "../SlideShow";

const Modal = ({ id, data, showModal, setShowModal, clickIndex, editAble}) => {

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <Fragment>
      {showModal && (
        <dialog id="my_modal_2" className="modal" open={showModal}>
          <div className="modal-box rounded-none py-10 bg-primary-content card-frame gallarySlider">
            {/* close button */}
            <Button
              size="btn-sm"
              variant="btn-ghost"
              className="bg-primary hover:bg-base-200 z-[10] absolute right-2 top-2"
              iconPosition="left"
              icon={CloseIcon}
              onClick={closeModal}
            ></Button>
            <Slideshow SliderImages={data} clickIndex={clickIndex} editAble={editAble}/>
          </div>
        </dialog>
      )}
    </Fragment>
  );
};

export default Modal;
