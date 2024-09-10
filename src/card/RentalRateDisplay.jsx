import React from "react";
import { Modal, ModalBody, ModalHeader, Button } from "reactstrap";
import { FaDollarSign } from "react-icons/fa"; // For the dollar icon

export default function RentalRateDisplayModal(props) {
  const { rentalRate, isOpen, toggle } = props; // `isOpen` controls modal visibility, `toggle` closes it

  return (
    <Modal
      isOpen={isOpen}
      toggle={toggle}
      centered
      size="lg"
      className="slide-down"
    >
      <ModalHeader toggle={toggle}>
        <FaDollarSign size={30} />
      </ModalHeader>
      <ModalBody
        className="text-center"
        style={{
          background: "linear-gradient(135deg, #f7941d, #f94d6a)",
          color: "white",
        }}
      >
        <h1 className="display-3">${rentalRate.toFixed(2)}</h1>
        <Button color="light" onClick={toggle} className="mt-3">
          Close
        </Button>
      </ModalBody>
    </Modal>
  );
}
