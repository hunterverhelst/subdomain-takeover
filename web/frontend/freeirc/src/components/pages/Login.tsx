import React, { useState } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row'
import Container from 'react-bootstrap/Container'
import { useNavigate } from "react-router-dom";
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import AutoDismissToast from "../widgets/AutoDismissToast";



const Login = (props: any) => {
    const [username, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showLoginFail, setShowLoginFail] = useState(false)
    const navigate = useNavigate();

    const onButtonClick = (e: React.MouseEvent<HTMLFormElement, MouseEvent>) => {
        e.preventDefault()


        // Check if email has an account associated with it
        checkAccountExists((accountExists: boolean) => {
            // If yes, log in 
            if (accountExists) {
                logIn()
            }
            else
                // Else, display error
                setShowLoginFail(true)
        })

    }

    // Call the server API to check if the given email ID already exists
    const checkAccountExists = (callback: any) => {
        fetch("/api/check-account", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: username })
        })
            .then(r => r.json())
            .then(r => {
                callback(r?.userExists)
            })
    }

    // Log in a user using email and password
    const logIn = () => {
        fetch("/api/auth", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: username, password })
        })
            .then(r => r.json())
            .then(r => {
                if ('success' === r.message) {
                    localStorage.setItem("user", JSON.stringify({ email: username, token: r.token }))
                    props.setToken(r.token)
                    props.setLoggedIn(true)
                    props.setEmail(username)
                    navigate("/")
                } else {
                    setShowLoginFail(true)
                }
            })
    }

    return (

        <div className={"mainContainer"}>
            <div>

                <Container>
                    <Form onSubmit={onButtonClick}>
                        <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
                            <Form.Label>
                                Username
                            </Form.Label>
                            <Col>
                                <Form.Control required name='username' type="username" placeholder="Username" onChange={ev => setEmail(ev.target.value)} />

                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-3" controlId="formPlaintextPassword">
                            <Form.Label>
                                Password
                            </Form.Label>
                            <Col>
                                <Form.Control required name='password' type="password" placeholder="Password" onChange={ev => setPassword(ev.target.value)} />
                            </Col>
                        </Form.Group>
                        <Button type='submit' variant='primary'>Submit</Button>
                    </Form>
                </Container>

                <AutoDismissToast bg="danger" show={showLoginFail} onClose={(_: any) => setShowLoginFail(false)} header="Error">
                    Username or Password is incorrect
                </AutoDismissToast>
            </div>
        </div>
    );
}

export default Login
