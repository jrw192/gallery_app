import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Tooltip } from 'react-tooltip'
import './Details.css';
import { SessionData, Postcard } from '../types';
import { Loader, LoaderOptions } from 'google-maps';
import { Location } from '../Location/Location';

export const Details: React.FC<{ clear: () => void, saveData: (postcardData: Postcard) => Promise<void> }>
    = ({ clear, saveData }) => {
        const { sessionData } = useOutletContext<{ sessionData: SessionData }>();
        const [location, setLocation] = useState('');

        useEffect(() => {
            console.log('sessionData:', sessionData);
        }, [sessionData]);

        let saveImage = async () => {
            let postcardId = crypto.randomUUID();
            const postcardData = {
                'id': postcardId,
                'creator': sessionData.name,
                'location': location,
                'date': new Date(),
                'message': (document.getElementById("textarea") as HTMLInputElement)?.value ?? '',
            };

            saveData(postcardData);
        }

        return (
            <div className='details-body'>

                <form className='submit-form'>
                    <p>write a note for your postcard</p>
                    <textarea className='textarea' id='textarea'></textarea>
                    <br />
                    <Location setLocation={(location: string) => setLocation(location)}/>
                    <br />
                    <span>title:  </span>
                    <input id="titleInput" placeholder={'untitled'} required />
                    <br />
                    <div>
                        <button onClick={() => clear()}>Start over</button>
                        <button id="save-button" onClick={() => saveImage()}
                            disabled={sessionData.name.length === 0}
                        >Save</button>
                        {sessionData.name.length === 0 && <Tooltip
                            anchorSelect="#save-button"
                            content="log in to save"
                        />}
                    </div>
                </form>
            </div>
        )
    };