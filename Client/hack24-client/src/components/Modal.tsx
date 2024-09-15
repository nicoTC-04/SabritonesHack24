import "@/styles/Modal.css";

type ModalProps = {
  modalToggle: Function;
  width: number;
  height: number;
  children: React.ReactNode;
};

export const Modal = ({
  modalToggle = () => {},
  width = 50,
  height = 75,
  children,
}: ModalProps) => {
  return (
    <div className="modal-container">
      <div className="modal-overlay" onClick={() => modalToggle()} />
      <div
        className="modal-content"
        style={{ width: `${width}%`, height: `${height}%` }}
      >
        {children}
      </div>
    </div>
  );
};
