'use client';
import { ApiClient } from "../api/extService";
import { useState } from "react";
import { useEffect } from "react";
import PTDetail from "./subviews/ptdetail";

function PTView({jwt}) {
    const [currView, setCurrView] = useState(null);
    const [programs, setPrograms] = useState(null);

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

    return (
        <>
        {
                currView == null ?
                <>
                    <div className="view-container">
                        <h2>Workouts under your supervision;</h2>
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