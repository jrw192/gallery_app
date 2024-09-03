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
        }, [sessionData]);

        let saveImage = async () => {
            const postcardData = {
                'id': '',
                'title': (document!.getElementById('titleInput') as HTMLInputElement).value,
                'creator': sessionData.name,
                'location': location,
                'date': new Date(),
                'message': (document.getElementById("textarea") as HTMLInputElement)?.value ?? '',
            };

            saveData(postcardData);
        }

        return (
            <div className='details-body'>
                <p className='details-title'>fill out and send your postcard</p>
                <div className='details-form'>
                    <form className='submit-form'>
                        <p className='details-text'>postcard title</p>
                        <input id="titleInput" placeholder={'untitled'} required />
                        <br />
                        <p className='details-text'>write a note</p>
                        <textarea className='textarea' id='textarea'></textarea>
                        <br />
                        <p className='details-text'>where are you sending from?</p>
                        <Location setLocation={(location: string) => setLocation(location)} />
                        <br />
                        <div className='controls'>
                            <button onClick={() => clear()}>start over</button>
                            <button id="save-button" onClick={() => saveImage()}
                                disabled={sessionData.name.length === 0}
                            >send</button>
                            {sessionData.name.length === 0 && <Tooltip
                                anchorSelect="#save-button"
                                content="log in to send"
                            />}
                        </div>
                    </form>
                </div>
            </div>
        )
    };