import { LogoutButton } from "../components/logoutbtn";

function Header({ payload }) {
    if(payload==null){
        return(
            <>
            <div className="header">
                <h1>Gruppe 36 - Fitness app</h1>
                <hr />
            </div>
            </>
        );
    }
    return (
        <>
            <div className="header">
                <h1>Gruppe 36 - Fitness app</h1>
                <hr />
                <ul className="navbar">
                    <li><button className="welcome-blerb">Welcome, {payload.Name}</button></li>
                    <LogoutButton/>
                </ul>

            </div>

        </>
    );

} export default Header;