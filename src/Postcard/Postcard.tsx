import { useState } from 'react';
import './Postcard.css';
import { Postcard as PostcardType } from '../types';

export const Postcard: React.FC<{
    postcard: PostcardType,
    image: { key: string, url: string }
}>
    = ({ postcard, image }) => {
        const [showBack, setShowBack] = useState(false);
        const date = new Date(postcard.date).toDateString();

        let flipPostcard = () => {
            setShowBack(!showBack);
        }

        let getPostcardContent = () => {
            return showBack ?
                <div className='postcard-back'>
                    <div className='message'>{postcard.message}</div>
                    <br />
                    <span className='byline'>- {postcard.creator}</span>
                    <br />
                    <span className='date'>{date}</span>
                </div>
                : <img className='image' src={image.url}/>;
        }

        return (
            <>
                <div className="item" key={image.key}>
                    <div className="content" onClick={() => flipPostcard()}>
                        {getPostcardContent()}
                    </div>
                    <div className="title">{postcard.title}</div>
                    <div>📌{postcard.location}</div>
                </div>
            </>
        )
    };