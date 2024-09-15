import { Modal } from "../Modal"

type ModalExplorarProfesorProps = {
    toggleModal: Function;
}

const ModalExplorarProfesor = ({toggleModal}: ModalExplorarProfesorProps) => {
  return (
    <Modal width={80} height={90} modalToggle={toggleModal}>
      <div>hola</div>
    </Modal>
  )
}

export default ModalExplorarProfesor