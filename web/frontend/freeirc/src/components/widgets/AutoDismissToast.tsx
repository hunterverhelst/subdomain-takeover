import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';

function AutoDismissToast(props: {
  show: boolean,
  onClose: any,
  header: any,
  bg?: string,
  children?: any
}) {
  return (
    <ToastContainer position="bottom-center">
      <Toast bg={props.bg ?? 'primary'} show={props.show} onClose={props.onClose} delay={3000} autohide >
        <Toast.Header>
          <strong className="me-auto">{props.header}</strong>
        </Toast.Header>
        <Toast.Body>{props.children}</Toast.Body>
      </Toast>
    </ToastContainer>
  );
}

export default AutoDismissToast;