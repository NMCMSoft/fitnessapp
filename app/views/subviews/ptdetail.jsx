'use client';
import { ApiClient, GET, POST } from "../../api/extService";
import { useState } from "react";
import { useEffect } from "react";

/*
@HERE: 
Todo;
- see & inspect workouts tied to PT -- DONE
- create workouts in ptdetail (here) -- 
- add new exercise (here)
- see a list of clients (base view) --

*/


/*Workout anatomy;
{
  "name": "string",
  "description": "string",
  "sets": 0,
  "repetitions": 0,
  "time": "string"
}

*/



function PTDetail({ workoutid, jwt }) {
    const [programs, setPrograms] = useState(null);
    const [new_exc_name, setNew_exc_name] = useState(null); /*adds a new EXERCISE to a workout PLAN (regime) */
    const [new_exc_description, setNew_exc_description] = useState(null); /*adds a new EXERCISE to a workout PLAN (regime) */
    const [new_exc_sets, setNew_exc_sets] = useState(null); /*adds a new EXERCISE to a workout PLAN (regime) */
    const [new_exc_reps, setNew_exc_reps] = useState(null); /*adds a new EXERCISE to a workout PLAN (regime) */
    const [new_exc_time, setNew_exc_time] = useState(null); /*adds a new EXERCISE to a workout PLAN (regime) */

    const [curruserprog, setCurruserprog] = useState(null);

    useEffect(() => {
        if (!jwt) return;
        const url = `https://assignment2.swafe.dk/api/Users/${programs?.[0]?.clientId}`;
        console.log(`user id; ${programs?.[0]?.clientId}`);
        const token = jwt;
        GET({ url, token })
            .then((data) => {
                const item = Array.isArray(data) ? data[0] : data;
                setCurruserprog(item?.firstName + " " + item?.lastName ?? '');
            })
            .catch((err) => console.error(err));
    }, [programs]);/*It's gonna cause some errors because of race condition, shouldn't affect anything*/

    async function handleSubmit(e) {
        e.preventDefault();
        console.log(`adding new workout to ${programs?.[0].workoutProgramId} for user ${programs?.[0].clientId}`);
        if(await POST({
            url: `https://assignment2.swafe.dk/api/Exercises/Program/${programs?.[0].workoutProgramId}`,
            body: { name: new_exc_name, description:  new_exc_description, sets: new_exc_sets
                ,repetitions:new_exc_reps, time:new_exc_time
            },
            token: jwt,
            })){
                window.location.reload();
            }
    }

    return (
        <>
            <h2>Currently viewing workout #{workoutid} <b className="admin-label">as trainer</b></h2>
            {/*note 2 self; using an element INSTEAD of an async fetching from extService->GET in order to separate concerns;
            -- ApiClient element gets general information on mount - 
            -- async GET retrieves helper info on demand (readibility i guess)
            */}
            <ApiClient
                url={`https://assignment2.swafe.dk/api/WorkoutPrograms/?id=${workoutid}`}
                method="GET"
                token={jwt}
                autoFetch
                onResult={setPrograms}
                onChange={programs}
            />


            {Array.isArray(programs) && (
                <div className="workout-div">
                    {programs.map((prog) => (

                        <a key={prog.workoutProgramId} className="workout-card">
                            <strong>{prog.name}</strong> — {prog.description}
                            {
                                <>
                                    <ul>
                                        {(prog.exercises ?? []).map((ex) => (
                                            <li key={ex.exerciseId}>
                                                <h1>{ex.name}:</h1>
                                                <b>{ex.sets}</b><i> Sets</i> & <b>{ex.repetitions}</b><i> Repetitions</i>

                                                <div>
                                                    <img className="clk-ico" src={"https://raw.githubusercontent.com/NMCMSoft/static-hosted-webassets/refs/heads/main/clk.png"} />
                                                    {ex.time ? `(${ex.time})` : 'No time limit set'}
                                                </div>
                                                <br />
                                                <i>How you do it:</i>
                                                <p>
                                                    {ex.description}</p>
                                                <hr />

                                                <br />
                                            </li>

                                        ))}
                                    </ul>
                                    <div className="put-form">
                                        <form onSubmit={handleSubmit} className="flex max-w-sm flex-col gap-3 rounded border p-6">
                                            <h3><i>Add a new exercise:</i></h3>
                                            <br />
                                            <label className="flex flex-col gap-1 text-sm">
                                                <span>Exercise name: </span>
                                                <input
                                                    type="text"
                                                    required
                                                    onChange={(e) => setNew_exc_name(e.target.value)}
                                                    className="rounded border px-3 py-2"
                                                />
                                            </label>
                                            <br />
                                            <label className="flex flex-col gap-1 text-sm">
                                                <span>Exercise descirption: </span>
                                                <input
                                                    type="text"
                                                    required
                                                    onChange={(e) => setNew_exc_description(e.target.value)}
                                                    className="rounded border px-3 py-2"
                                                />
                                            </label>
                                            <br/>
                                            <label className="flex flex-col gap-1 text-sm">
                                                <span>Sets: </span>
                                                <input
                                                    type="number"
                                                    required
                                                    onChange={(e) => setNew_exc_sets(e.target.value)}
                                                    className="rounded border px-3 py-2"
                                                />
                                            </label>
                                            <br/>
                                            <label className="flex flex-col gap-1 text-sm">
                                                <span>Repetitions: </span>
                                                <input
                                                    type="number"
                                                    required
                                                    onChange={(e) => setNew_exc_reps(e.target.value)}
                                                    className="rounded border px-3 py-2"
                                                />
                                            </label>
                                            <br/>
                                            <label className="flex flex-col gap-1 text-sm">
                                                <span>Time: </span>
                                                <input
                                                    type="text"
                                                    required
                                                    onChange={(e) => setNew_exc_time(e.target.value)}
                                                    className="rounded border px-3 py-2"
                                                />
                                            </label>
                                            <br />
                                            <button
                                                type="submit"
                                            >
                                                Add Exercise
                                            </button>
                                        </form>
                                        <br />
                                    </div>
                                    <br />
                                    <div className="put-form">
                                        <h3>Workout program currently assigned to:</h3>
                                        <p><b>{curruserprog}</b></p>
                                    </div>
                                    <br />
                                </>
                            }
                        </a>

                    ))}

                </div>

            )
            }
        </>
    );


} export default PTDetail;