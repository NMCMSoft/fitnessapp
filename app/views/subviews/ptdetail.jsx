'use client';
import { ApiClient, GET } from "../../api/extService";
import { useState } from "react";
import { useEffect } from "react";
function PTDetail({ workoutid, jwt }) {
    const [programs, setPrograms] = useState(null);
    const [addexcform, setAddexcform] = useState(null);

    const [curruserprog, setCurruserprog] = useState(null);


useEffect(() => {
    if (!jwt) return;

    let url = "https://assignment2.swafe.dk/api/Users/?id=126";
    GET({ url, jwt })
        .then((data) => {
            const item = Array.isArray(data) ? data[0] : data;
            setCurruserprog(item?.firstName ?? '');
        })
        .catch((err) => console.error(err));
}, []);
    return (
        <>
            <h2>Currently viewing workout #{workoutid} <b className="admin-label">as trainer</b></h2>

            <ApiClient
                url={"https://assignment2.swafe.dk/api/WorkoutPrograms/?id=" + workoutid}
                method="GET"
                token={jwt}
                autoFetch
                onResult={setPrograms}
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
                                                    {ex.time ? ` (${ex.time})` : 'No time limit set'}
                                                </div>
                                                <br />
                                                <i>How you do it:</i>
                                                <p>
                                                    {ex.description}</p>
                                                <hr />

                                                <br />
                                                <div className="put-form">
                                                    <form>
                                                        <h3><i>Add a new exercise:</i></h3>

                                                    </form>
                                                    <br />
                                                </div>
                                            </li>

                                        ))}
                                    </ul>
                                    <div className="put-form">
                                        <h3>Currently assigned to:</h3>
                                        <p>{curruserprog}</p>
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