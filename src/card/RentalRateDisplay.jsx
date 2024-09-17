import React from "react";
import { Modal, ModalBody, ModalHeader, Button } from "reactstrap";
import { FaDollarSign } from "react-icons/fa"; // For the dollar icon

export default function RentalRateDisplayModal(props) {
  const { rentalRate, isOpen, toggle } = props; // `isOpen` controls modal visibility, `toggle` closes it

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered size="md">
      <ModalHeader toggle={toggle} className="model-header">
        <FaDollarSign size={30} />
      </ModalHeader>
      <ModalBody className="text-center">
        <h1 className="display-3">${rentalRate.toFixed(2)}</h1>
        <Button onClick={toggle} className="mt-3 custom-button">
          Close
        </Button>
      </ModalBody>
    </Modal>
  );
}
