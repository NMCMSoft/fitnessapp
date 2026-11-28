'use client';

import { useEffect,useState } from "react";
import { ApiClient, POST } from "../api/extService";
function ManagerView({ jwt }) {


    async function handleSubmitNewUser(e) {
        e.preventDefault();
        if (await POST({
            url: `https://assignment2.swafe.dk/api/Users`,
            body: {
                firstName: ncfirstname, lastName: nclastname, email: ncemail
                , password: ncpass, accountType: 'PersonalTrainer'
            },
            token: jwt,
        })) {
            //window.location.reload();
            document.getElementById('status-show').innerHTML = 'User Registered.';
        }
    }


    useEffect(() => {
        document.title = "Fitness App | Manager";
    }, []);


    const [ncfirstname, setNcfirstname] = useState(null);//new pt addition
    const [nclastname, setNclastname] = useState(null);//new pt addition
    const [ncemail, setNcemail] = useState(null);//new pt addition
    const [ncpass, setNcpass] = useState(null);//new pt addition
    return (
        <>
            <h1 className="admin-label">Viewing as manager</h1>
            <hr />
            <div className="put-form">
                <form onSubmit={handleSubmitNewUser} className="flex max-w-sm flex-col gap-3 rounded border p-6">
                    <h3><i>Add a new Personal Trainer:</i></h3>
                    <br />
                    <label className="flex flex-col gap-1 text-sm">
                        <span>First name: </span>
                        <input
                            type="text"
                            required
                            onChange={(e) => setNcfirstname(e.target.value)}
                            className="rounded border px-3 py-2"
                        />
                    </label>
                    <br />
                    <label className="flex flex-col gap-1 text-sm">
                        <span>Last name: </span>
                        <input
                            type="text"
                            required
                            onChange={(e) => setNclastname(e.target.value)}
                            className="rounded border px-3 py-2"
                        />
                    </label>
                    <br />
                    <label className="flex flex-col gap-1 text-sm">
                        <span>E-Mail: </span>
                        <input
                            type="email"
                            required
                            onChange={(e) => setNcemail(e.target.value)}
                            className="rounded border px-3 py-2"
                        />
                    </label>
                    <br />
                    <label className="flex flex-col gap-1 text-sm">
                        <span>Password: </span>
                        <input
                            type="password"
                            required
                            onChange={(e) => setNcpass(e.target.value)}
                            className="rounded border px-3 py-2"
                        />
                    </label>
                    <br />
                    <button
                        type="submit"
                    >
                        Register Trainer
                    </button>
                </form>
            </div>

            <h3 id="status-show"></h3>

        </>
    );
} export default ManagerView;