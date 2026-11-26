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
    const EMPTY_EXERCISE = {
        name: '',
        description: '',
        sets: 3,
        repetitions: 10,
        time: '',
    };

    const [draftExercise, setDraftExercise] = useState(EMPTY_EXERCISE);
    const [exercises, setExercises] = useState([]);
    const [workoutname, setWorkoutname] = useState(null);
    const [workoutdesc, setWorkoutdesc] = useState(null);
    const [workoutClient, setWorkoutClient] = useState(null);

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

    async function handleSubmitNewUser(e) {
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

async function handleSubmitNewProgram(e) {
    e.preventDefault();
    const payload = {
        name: workoutname.trim(),
        description: workoutdesc.trim(),
        exercises: exercises.map((ex) => ({
            name: ex.name.trim(),
            description: ex.description.trim(),
            sets: Number(ex.sets) || 0,
            repetitions: Number(ex.repetitions) || 0,
            time: (ex.time ?? '').trim(),
        })),
        clientId: Number(workoutClient) || 0,
    };

    console.log(`creating workout program for clientId:${payload.clientId, payload}`);

    if (await POST({
        url: 'https://assignment2.swafe.dk/api/WorkoutPrograms',
        body: payload,
        token: jwt,
    })) {
        window.location.reload();
    }
}
/*Helper functs*/
    function addExercise() {
        if (!draftExercise.name.trim()) return;

        setExercises((prev) => [
            ...prev,
            {
                name: draftExercise.name.trim(),
                description: draftExercise.description.trim(),
                sets: Number(draftExercise.sets) || 0,
                repetitions: Number(draftExercise.repetitions) || 0,
                time: draftExercise.time.trim(),
            },
        ]);
        setDraftExercise(EMPTY_EXERCISE);
    }
    function updateDraftField(field, value) {
        setDraftExercise((prev) => ({ ...prev, [field]: value }));
    }
    function removeExercise(indexToRemove) {
        setExercises((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    }
    return (
        <>
            {
                currView == null ?
                    <>
                        <div className="view-container">
                            <h2 className="admin-label">Workouts under your supervision;</h2>

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
                                                <h5>{`${clnt.accountType} ID: ${clnt.userId}`}</h5>
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
                                        <form onSubmit={handleSubmitNewUser} className="flex max-w-sm flex-col gap-3 rounded border p-6">
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
                                        <form onSubmit={handleSubmitNewProgram} className="flex max-w-sm flex-col gap-3 rounded border p-6">
                                            <h3><i>New workout program form:</i></h3>
                                            <br />
                                            <label className="flex flex-col gap-1 text-sm">
                                                <span>Workout name: </span>
                                                <input
                                                    type="text"
                                                    required
                                                    onChange={(e) => setWorkoutname(e.target.value)}
                                                    className="rounded border px-3 py-2"
                                                />
                                            </label>
                                            <br />
                                            <label className="flex flex-col gap-1 text-sm">
                                                <span>Workout description: </span>
                                                <input
                                                    type="text"
                                                    required
                                                    onChange={(e) => setWorkoutdesc(e.target.value)}
                                                    className="rounded border px-3 py-2"
                                                />
                                            </label>
                                            <br />
                                            <label className="flex flex-col gap-1 text-sm">
                                                <span>Client ID: </span>
                                                <input
                                                    type="number"
                                                    required
                                                    onChange={(e) => setWorkoutClient(e.target.value)}
                                                    className="rounded border px-3 py-2"
                                                />
                                            </label>
                                            <br/>
                                            <fieldset>
                                                <legend>Add Exercise</legend>
                                                <input
                                                    placeholder="Exercise name"
                                                    value={draftExercise.name}
                                                    onChange={(e) => updateDraftField('name', e.target.value)}
                                                />
                                                <input
                                                    placeholder="Description"
                                                    value={draftExercise.description}
                                                    onChange={(e) => updateDraftField('description', e.target.value)}
                                                />
                                                <input
                                                    type="number"
                                                    placeholder="Sets"
                                                    value={draftExercise.sets}
                                                    onChange={(e) => updateDraftField('sets', e.target.value)}
                                                />
                                                <input
                                                    type="number"
                                                    placeholder="Reps"
                                                    value={draftExercise.repetitions}
                                                    onChange={(e) => updateDraftField('repetitions', e.target.value)}
                                                />
                                                <input
                                                    placeholder="Time"
                                                    value={draftExercise.time}
                                                    onChange={(e) => updateDraftField('time', e.target.value)}
                                                />
                                                <button type="button" onClick={addExercise}>
                                                    Add Exercise
                                                </button>
                                            </fieldset>
                                            <br />
                                            <h3><i>Summary:</i></h3>
                                            <ul>
                                                {exercises.map((ex, idx) => (
                                                    <li key={`${ex.name}-${idx}`}>
                                                        {ex.name} — {ex.sets}x{ex.repetitions} {ex.time && `(${ex.time})`}
                                                        <button type="button" onClick={() => removeExercise(idx)}>
                                                            Remove
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                            <br/>
                                            <button
                                                type="submit"
                                            >
                                                Create Program
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