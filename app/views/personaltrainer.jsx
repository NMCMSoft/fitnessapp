'use client';
import { ApiClient, POST } from "../api/extService";
import { useState } from "react";
import { useEffect } from "react";
import PTDetail from "./subviews/ptdetail";

/*
new client anatomy
{
  "firstName": "string",
  "lastName": "string",
  "email": "user@example.com",
  "password": "string",
  "personalTrainerId": 0,
  "accountType": "string"
}
  
*/

function PTView({ personalId, jwt }) {
    const [currView, setCurrView] = useState(null);
    const [programs, setPrograms] = useState(null);
    const [clients, setClients] = useState(null); /*clients under this pt's supervision */

    const [ncfirstname, setNcfirstname] = useState(null);//new client addition
    const [nclastname, setNclastname] = useState(null);//new client addition
    const [ncemail, setNcemail] = useState(null);//new client addition
    const [ncpass, setNcpass] = useState(null);//new client addition

/*
{
  "name": "string",
  "description": "string",
  "exercises": [
    {
      "name": "string",
      "description": "string",
      "sets": 0,
      "repetitions": 0,
      "time": "string"
    }
  ],
  "clientId": 0
}
new workout anatomy
*/

    


    const setProgView = (idView) => {
        const url = new URL(window.location.href);

        if (idView == null) {
            url.searchParams.delete('viewid');
            window.history.pushState({}, '', url);
            setCurrView(null);
            return;
        }
        const normalizedId = String(idView);
        url.searchParams.set('viewid', normalizedId);
        window.history.pushState({}, '', url);
        setCurrView(normalizedId);
    };

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const id = queryParams.get('viewid');
        document.title = "Fitness App | PT";
        setCurrView(id);
    }, []);

    async function handleSubmit(e) {
        e.preventDefault();
        console.log(`registering new user to this trainerID: ${personalId}`);
        if (await POST({
            url: `https://assignment2.swafe.dk/api/Users`,
            body: {
                firstName: ncfirstname, lastName: nclastname, email: ncemail
                , password: ncpass, personalTrainerId: personalId, accountType: 'Client'
            },
            token: jwt,
        })) {
            window.location.reload();
        }
    }
    /*
    login12@mail.dk
    1234
    */

    return (
        <>
            {
                currView == null ?
                    <>
                        <div className="view-container">
                            <h2 className="admin-label">Workouts under your supervision;</h2>
                            <>{currView}</>
                            <div className="display-grid">
                                <ApiClient
                                    url={"https://assignment2.swafe.dk/api/WorkoutPrograms/trainer"}
                                    method="GET"
                                    token={jwt}
                                    autoFetch
                                    onResult={setPrograms}
                                />
                                {Array.isArray(programs) && (
                                    <>
                                        {programs.map((prog) => (
                                            <button key={prog.workoutProgramId} className="workout-card" onClick={() => setProgView(prog.workoutProgramId)}>
                                                <h3>{prog.description}</h3>
                                                <hr />
                                                <p><b>Difficulty; </b><u>{prog.name}</u></p>
                                                {
                                                    <ul>
                                                        {(prog.exercises ?? []).map((ex) => (
                                                            <li key={ex.exerciseId}>
                                                                {ex.name}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                }
                                            </button>
                                        ))}
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="view-container">
                            <h2 className="admin-label">Clients under your supervision;</h2>
                            <>{currView}</>
                            <div className="display-grid">
                                <ApiClient
                                    url={"https://assignment2.swafe.dk/api/Users/Clients"}
                                    method="GET"
                                    token={jwt}
                                    autoFetch
                                    onResult={setClients}
                                />
                                {Array.isArray(clients) && (
                                    <>
                                        {clients.map((clnt) => (
                                            <button key={clnt.userId} className="workout-card">
                                                <h3>{`${clnt.firstName} ${clnt.lastName} `}</h3>
                                                <h5>{clnt.accountType}</h5>
                                                <hr />
                                                {clnt.email}
                                            </button>
                                        ))}
                                    </>
                                )}
                            </div>
                        </div>
                        <br />
                        <div className="view-container">
                            <h2 className="admin-label">Create a new user:</h2>
                            <>{currView}</>
                            <div>
                                <div>
                                    <div className="put-form">
                                        <form onSubmit={handleSubmit} className="flex max-w-sm flex-col gap-3 rounded border p-6">
                                            <h3><i>New user registration form:</i></h3>
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
                                            <br/>
                                            <label className="flex flex-col gap-1 text-sm">
                                                <span>E-Mail: </span>
                                                <input
                                                    type="email"
                                                    required
                                                    onChange={(e) => setNcemail(e.target.value)}
                                                    className="rounded border px-3 py-2"
                                                />
                                            </label>
                                            <br/>
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
                                                Register user
                                            </button>
                                        </form>
                                        <br />
                                    </div>
                                    <br />
                                </div>
                            </div>
                        </div>
                        <br />
                        <div className="view-container">
                            <h2 className="admin-label">Create a new Workout Program (regime):</h2>
                            <>{currView}</>
                            <div>
                                <div>
                                    <div className="put-form">
                                        <form onSubmit={handleSubmit} className="flex max-w-sm flex-col gap-3 rounded border p-6">
                                            <h3><i>New user registration form:</i></h3>
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
                                            <br/>
                                            <label className="flex flex-col gap-1 text-sm">
                                                <span>E-Mail: </span>
                                                <input
                                                    type="email"
                                                    required
                                                    onChange={(e) => setNcemail(e.target.value)}
                                                    className="rounded border px-3 py-2"
                                                />
                                            </label>
                                            <br/>
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
                                                Register user
                                            </button>
                                        </form>
                                        <br />
                                    </div>
                                    <br />
                                </div>
                            </div>
                        </div>
                    </>
                    :
                    <>
                        <button onClick={() => setProgView(null)}>
                            <h1>{"< Go back"}</h1>
                        </button>
                        {<PTDetail workoutid={currView} jwt={jwt} />}
                    </>
            }
        </>
    );


} export default PTView;