import { LogoutButton } from "../components/logoutbtn";

function Content({ payload }) {
      const role = payload?.Role || payload?.role || 'User';
  const name = payload?.Name || 'User';
    return (
        <>
        
            <LogoutButton/>
        </>
    );

} export default Content;