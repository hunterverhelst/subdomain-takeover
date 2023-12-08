import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
function ChangeDomainToast(props: any) {
  const {show, setShow} = props.show;

  return (
    <ToastContainer position="bottom-center">
    <Toast show={show} onClose={_ => setShow(false)} delay={3000} autohide >
        <Toast.Header>
        <strong className="me-auto">Success!</strong>
        </Toast.Header>
        <Toast.Body>Your subdomain has been successfully updated. It may take a few minutes for the DNS servers to reflect your changes</Toast.Body>
    </Toast>
    </ToastContainer>
  );
}

export default ChangeDomainToast;