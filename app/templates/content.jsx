import PTView from "../views/personaltrainer";
import ClientView from "../views/client";
import ManagerView from "../views/manager";
import { cookies } from "next/headers";
async function Content({ payload }) {

      const cookieStore = await cookies();
      const jwt = cookieStore.get('fitness_jwt')?.value ?? null;
    if(payload==null){
        return(<>
        <p>Not Logged in !</p>
        </>);
    }
    return (
        <>
        <div className="content-body">
        {
            payload.Role == "Manager"? <ManagerView/>  : payload.Role == "PersonalTrainer"? <PTView personalId={payload.UserId} jwt={jwt}/> : <ClientView clientID={payload.ClientId} jwt={jwt}/>
        }
        </div>
        </>
    );

} export default Content;