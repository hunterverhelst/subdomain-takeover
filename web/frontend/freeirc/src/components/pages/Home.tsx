import React from "react"
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import Dashboard from "./Dashboard";



const Home = (props: any) => {
    const { loggedIn, email: username, token } = props
    const navigate = useNavigate();
    const Welcome = (props: any) => {
        const onButtonClick = () => {
            if (loggedIn) {
                localStorage.removeItem("user")
                props.setLoggedIn(false)
            } else {
                navigate("/login")
            }
        }
        return (
            <div>
                <div>
                    <div>
                        <h1>FreeIRC</h1>
                    </div>
                </div>
                <div>
                    Free IRC server hosting for all!<br />
                    FreeIRC is currently in Beta development and is not accepting new users. Current users can log in below.
                </div>
                <Button
                    variant="primary"
                    onClick={_ => onButtonClick()}
                >
                    {loggedIn ? "Log out" : "Log in"}
                </Button>
            </div>
        )
    }



    return (
        <div>
            <div>
                {(loggedIn ? <div>
                    <Dashboard user={{ username, token }} setLoggedIn={props.setLoggedIn}></Dashboard>
                </div> : <Welcome></Welcome>)}
            </div>
            <div>


            </div>


        </div>
    );
}

export default Home