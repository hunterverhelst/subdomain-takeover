import React from 'react'
import { useState, useEffect } from 'react'

import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row'
import Container from 'react-bootstrap/Container'
import { useNavigate } from "react-router-dom";
import ChangeDomainToast from '../widgets/prefixUpdateToast';

const Dashboard = (props: any) => {

    const [domainPrefix, setDomainPrefix] = useState("")
    const [newPrefix, setNewPrefix] = useState("")
    const [showToast, setShowToast] = useState(false)
    useEffect(() => {
        fetch('http://localhost:3080/domainprefix', {
            method: "GET",
            headers: {
                'jwt-token': props.user.token
            }
        }).then((res) => res.json()).then((res:any) => {setDomainPrefix(res.prefix); setNewPrefix(res.prefix)})
    }, [])

    
    const handleChangePrefixClick = (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (e.currentTarget.checkValidity()) {
        fetch('http://localhost:3080/domainprefix', {
                method: "POST",
                headers: {
                    'jwt-token': props.user.token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    prefix: newPrefix
                })
            }).then(res => {
                if (res.status === 201) {
                    setDomainPrefix(newPrefix)
                    setShowToast(true);
                }
            })
        }
    }
    const logOut = (e: any) => {
        localStorage.removeItem("user")
        props.setLoggedIn(false)
    }

    return (
        <>
        <Navbar expand="lg" className="bg-body-tertiary">
        <Container>
            <Navbar.Brand href="">Free IRC</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
                <Nav.Link onClick={logOut}>Log Out</Nav.Link>
            </Nav>
            </Navbar.Collapse>
        </Container>
        </Navbar>
        <h1>Manage Your FreeIRC Server</h1>
        <h2>Try It Out!</h2>
        <p>Your FreeIRC server is hosted at {domainPrefix}.freeirc.io</p>
        <h2>Change your FreeIRC Domain</h2>
        <Form onSubmit={handleChangePrefixClick}>
            <Form.Control required type="text" name="newPrefix" placeholder={domainPrefix} onChange={e => setNewPrefix(e.target.value)}></Form.Control>
            <Button type='submit' variant='primary'>Save</Button>
        </Form>
        <ChangeDomainToast show={{show: showToast, setShow: setShowToast}}></ChangeDomainToast>
        </>
    );
}

export default Dashboard