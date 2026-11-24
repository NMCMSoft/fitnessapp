'use client';
import { ApiClient } from "../../api/extService";
import { useState } from "react";
function ClientDetail({ workoutid, jwt }) {
        const [programs, setPrograms] = useState(null);
    
    return (
        <>
            <h2>Currently viewing workout #{workoutid}</h2>

            <ApiClient
                    url={"https://assignment2.swafe.dk/api/WorkoutPrograms/?id=" + workoutid}
                    method="GET"
                    token={jwt}
                    autoFetch
                    onResult={setPrograms}
                />
                {Array.isArray(programs) && (
                    <>
                        {programs.map((prog) => (
                            <a key={prog.workoutProgramId} className="workout-card">
                                <strong>{prog.name}</strong> — {prog.description}
                                {
                                    <ul>
                                        {(prog.exercises ?? []).map((ex) => (
                                            <li key={ex.exerciseId}>
                                                <h1>{ex.name}:</h1> 
                                                <b>{ex.sets}</b><i> Sets</i> & <b>{ex.repetitions}</b><i> Repetitions</i>
                                                
                                                <div>
                                                <img className="clk-ico" src={"https://raw.githubusercontent.com/NMCMSoft/static-hosted-webassets/refs/heads/main/clk.png"}/>
                                                {ex.time ? ` (${ex.time})` : 'No time limit set'} 
                                                </div>
                                                <br/>
                                                <i>How you do it:</i>
                                                <p>
                                                {ex.description}</p>
                                            <hr/>
                                            </li>
                                        ))}
                                    </ul>
                                }
                            </a>
                        ))}
                    </>
                )
            }
        </>
    );


} export default ClientDetail;