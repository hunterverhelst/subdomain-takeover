import React, { useState } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row'
import Container from 'react-bootstrap/Container'
import InputGroup from 'react-bootstrap/InputGroup'
import { useNavigate } from "react-router-dom";

const Login = (props: any) => {
    const [username, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [emailError, setEmailError] = useState("")
    const [passwordError, setPasswordError] = useState("")

    const navigate = useNavigate();

    const onButtonClick = (e: React.MouseEvent<HTMLFormElement, MouseEvent>) => {
        e.preventDefault()

        // Set initial error values to empty
        setEmailError("")
        setPasswordError("")

        // Check if the user has entered both fields correctly
        if ("" === username) {
            setEmailError("Please enter your username")
            return
        }

        if (!/.*/.test(username)) {
            setEmailError("Please enter a valid email")
            return
        }

        if ("" === password) {
            setPasswordError("Please enter a password")
            return
        }

        if (password.length < 7) {
            setPasswordError("The password must be 8 characters or longer")
            return
        }

        // Check if email has an account associated with it
        checkAccountExists((accountExists: boolean) => {
            // If yes, log in 
            if (accountExists) {
                logIn()
            }
            else
                // Else, ask user if they want to create a new account and if yes, then log in
                if (window.confirm("An account does not exist with this username: " + username + ". Do you want to create a new account?")) {
                    logIn()
                }
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
                    props.setLoggedIn(true)
                    props.setEmail(username)
                    navigate("/")
                } else {
                    window.alert("Wrong username or password")
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

            </div>
            {/* <div className={"titleContainer"}>
            <div>Login</div>
        </div>
        <br />
        <div className={"inputContainer"}>
            <input
                value={username}
                placeholder="Enter your username here"
                onChange={ev => setEmail(ev.target.value)}
                className={"inputBox"} />
            <label className="errorLabel">{emailError}</label>
        </div>
        <br />
        <div className={"inputContainer"}>
            <input
                value={password}
                placeholder="Enter your password here"
                onChange={ev => setPassword(ev.target.value)}
                className={"inputBox"} />
            <label className="errorLabel">{passwordError}</label>
        </div>
        <br />
        <div className={"inputContainer"}>
            <input
                className={"inputButton"}
                type="button"
                onClick={onButtonClick}
                value={"Log in"} />
        </div> */}
        </div>
    );
}

export default Login
