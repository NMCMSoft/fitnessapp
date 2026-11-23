import { LogoutButton } from "../components/logoutbtn";

function Content({ payload }) {
    return (
        <>
        <p>{payload.Role}</p>
            <LogoutButton/>
        </>
    );

} export default Content;