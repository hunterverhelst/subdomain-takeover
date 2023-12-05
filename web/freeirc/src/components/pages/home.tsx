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
                <div>Welcome!</div>
            </div>
            <div>
                This is the home page.
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
                <Dashboard user={{username, token}}setLoggedIn={props.setLoggedIn}></Dashboard>
            </div> : <Welcome></Welcome>)}
        </div>
        <div>
            
           
        </div>


    </div>
    );
}

export default Home