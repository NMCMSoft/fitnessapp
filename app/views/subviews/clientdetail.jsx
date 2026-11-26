'use client';

import { GET } from '../../api/extService';
import { useState, useEffect } from 'react';

function ClientDetail({ workoutid, jwt }) {
  const [programs, setPrograms] = useState(null);
  const [curruserprog, setCurruserprog] = useState('');

  useEffect(() => {
    if (!jwt || !workoutid) return;

    GET({
      url: `https://assignment2.swafe.dk/api/WorkoutPrograms/${workoutid}`,
      token: jwt,
    })
      .then((data) => {
        if (!data) {
          setPrograms([]);
          return;
        }
        const item = Array.isArray(data) ? data[0] : data;
        setCurruserprog(item?.clientId ?? '');
        setPrograms(Array.isArray(data) ? data : [data]);
      })
      .catch((err) => console.error('WorkoutProgram GET failed:', err));
  }, [jwt, workoutid]);

  return (
    <>
      <h2>Currently viewing workout #{workoutid}</h2>
      {curruserprog && <p>Client ID: {curruserprog}</p>}

      {Array.isArray(programs) && (
        <>
          {programs.map((prog) => (
            <a key={prog.workoutProgramId} className="workout-card">
              <strong>{prog.name}</strong> — {prog.description}
              <ul>
                {(prog.exercises ?? []).map((ex) => (
                  <li key={ex.exerciseId}>
                    <h1>{ex.name}:</h1>
                    <b>{ex.sets}</b><i> Sets</i> &amp; <b>{ex.repetitions}</b><i> Repetitions</i>

                    <div>
                      <img
                        className="clk-ico"
                        src="https://raw.githubusercontent.com/NMCMSoft/static-hosted-webassets/refs/heads/main/clk.png"
                        alt=""
                      />
                      {ex.time ? ` (${ex.time})` : 'No time limit set'}
                    </div>
                    <br />
                    <i>How you do it:</i>
                    <p>{ex.description}</p>
                    <hr />
                  </li>
                ))}
              </ul>
            </a>
          ))}
        </>
      )}
    </>
  );
}

export default ClientDetail;