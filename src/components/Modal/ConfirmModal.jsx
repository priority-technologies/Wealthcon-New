"use client";

import { Fragment, useState } from "react";
import "./modal.scss";
import CloseIcon from "../../assets/images/svg/closeIcon.svg";
import Button from "../Button";
import Typography from "../Typography";
import SuccessModal from "../Modal/SuccessModal";
import { useRouter } from "next/navigation";

const ConfirmModal = ({
  onClick,
  showModal,
  setShowModal,
  modalTitle,
  modalText,
}) => {
  const router = useRouter();
  const [successModal, setSuccessModal] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [error, setError] = useState(false);
  const [msg, setMsg] = useState("");

  const closeModal = () => {
    setShowModal(false);
  };
  const handleClick = async () => {
    try {
      setBtnLoading(true);
      await onClick();
      setSuccessModal(true);
      setBtnLoading(false);
      setError(false);
      setMsg("Delete successfully!");
    } catch (error) {
      if (error?.response?.status === 401) {
        return router.push("/login");
      }
      console.error(error.message);
      setSuccessModal(true);
      setError(true);
      setMsg(error?.response?.data?.error || "Somthing want wrong!");
      setBtnLoading(false);
    }
  };

  return (
    <Fragment>
      {showModal && (
        <dialog id="my_modal_2" className="modal" open={showModal}>
          <div className="modal-box rounded-none py-10 bg-primary-content  card-frame">
            {/* close button */}
            <Button
              size="btn-sm"
              variant="btn-ghost"
              className="absolute right-2 top-2"
              iconPosition="left"
              icon={CloseIcon}
              onClick={closeModal}
            ></Button>

            {modalTitle && (
              <Typography
                className="mb-1 w-full text-center"
                size="text-xl"
                weight="font-medium"
                color="text-base-content"
              >
                {modalTitle}
              </Typography>
            )}

            {modalText && (
              <Typography
                className="mb-1 w-full text-center px-8"
                size="text-base"
                weight="font-normal"
                color="text-base-content"
              >
                {modalText}
              </Typography>
            )}

            <div className="flex justify-center gap-4 mt-5 pt-5">
              <Button
                variant="btn-primary btn-sm"
                className="min-w-32 px-0"
                onClick={handleClick}
                loading={btnLoading}
              >
                Delete
              </Button>
              <Button
                variant="btn-base-300 btn-sm"
                className="min-w-32 px-0"
                onClick={closeModal}
              >
                Cancel
              </Button>
            </div>
          </div>
        </dialog>
      )}

      {successModal && (
        <SuccessModal
          showModal={successModal}
          setShowModal={setSuccessModal}
          onClose={() => {
            setShowModal(false);
            setSuccessModal(false);
          }}
          error={error}
          modalTitle={msg}
        />
      )}
    </Fragment>
  );
};

export default ConfirmModal;
