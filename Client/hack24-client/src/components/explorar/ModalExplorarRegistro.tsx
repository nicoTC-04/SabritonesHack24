"use client";

import { useState } from "react";
import { Modal } from "../Modal";
import { IoIosCheckmarkCircle } from "react-icons/io";
import "@/styles/Explorar/ModalExplorarRegistro.css";
import axios from "axios";
import { API_BASE_URL } from "@/app/constants";

type Appointment = {
  appointment_id: number;
  appointment_timestamp: string;
  status: string;
};

type ModalExplorarRegistroProps = {
  curso_id?: number;
  toggleModal: Function;
  appointments?: Appointment[];
};

const arrayDays = ["D", "L", "M", "M", "J", "V", "S"];

const ModalExplorarRegistro = ({
  curso_id,
  appointments,
  toggleModal,
}: ModalExplorarRegistroProps) => {
  const modalToggle = () => {
    toggleModal();
  };

  const onClickSubmit = async () => {
    const user = localStorage.getItem("user");
    const userId = user ? JSON.parse(user).id : null;
    try {
      const response = await axios.post(`${API_BASE_URL}/makeAppointment`, {
        student_id: userId,
        course_id: curso_id,
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Error submitting appointment:",
          error.response?.data || error.message
        );
      } else {
        console.error("Unexpected error:", error);
      }
    }

    setOpenSubmitted(true);
  };

  const CHECKMARK_ICON_SIZE = 100;
  const [openSubmitted, setOpenSubmitted] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<number | null>(
    null
  );

  const getDayOfWeek = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.getDay();
  };

  const handleButtonClick = (index: number) => {
    setSelectedDay(index);
  };

  const handleAppointmentClick = (appointmentId: number) => {
    setSelectedAppointment(appointmentId);
  };

  return (
    <Modal width={70} height={70} modalToggle={modalToggle}>
      <div className="modal-explorar-registro-main-container">
        <p className="modal-explorar-registro-title">Reservaciones</p>
        <div className="modal-explorar-registro-days-container">
          {arrayDays.map((day, index) => (
            <button
              key={index}
              onClick={() => handleButtonClick(index)}
              className={`modal-explorar-registro-day-button ${
                selectedDay === index ? "selected" : ""
              }`}
            >
              {day}
            </button>
          ))}
        </div>
        <div className="modal-explorar-registro-appointments-container">
          {selectedDay !== null ? (
            (appointments ?? [])
              .filter(
                (appointment) =>
                  getDayOfWeek(appointment.appointment_timestamp) ===
                  selectedDay
              )
              .map((appointment) => (
                <button
                  key={appointment.appointment_id}
                  onClick={() =>
                    appointment.status === "Available" &&
                    handleAppointmentClick(appointment.appointment_id)
                  }
                  className={`modal-explorar-registro-appointment-button ${
                    appointment.status !== "Available" ? "disabled" : ""
                  } ${
                    selectedAppointment === appointment.appointment_id
                      ? "selected"
                      : ""
                  }`}
                  disabled={appointment.status !== "Available"}
                >
                  <p>
                    {new Date(
                      appointment.appointment_timestamp
                    ).toLocaleTimeString()}
                  </p>
                </button>
              ))
          ) : (
            <p>No day selected</p>
          )}
        </div>
        <div>
          <button
            className="modal-explorar-registro-button-submit"
            onClick={onClickSubmit}
          >
            Confirmar
          </button>
        </div>
      </div>
      {openSubmitted && (
        <Modal width={25} height={30} modalToggle={toggleModal}>
          <div className="modal-registered-main-container">
            <div className="modal-registered-container">
              <IoIosCheckmarkCircle
                className="modal-registered-icon"
                size={CHECKMARK_ICON_SIZE}
              />
              <p className="modal-registered-text">
                Has sido correctamente registrado
              </p>
            </div>
            <button className="modal-registered-close" onClick={modalToggle}>
              Cerrar
            </button>
          </div>
        </Modal>
      )}
    </Modal>
  );
};

export default ModalExplorarRegistro;
