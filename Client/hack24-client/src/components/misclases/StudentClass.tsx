'use client';

import React from 'react';
import '@/styles/misclases/StudentClass.css';

type StudentClassProps = {
    name: string;
    professor: string;
    date: string;
    meetingId?: string; // Optional for post-class
    videoUrl?: string;   // Only for post-class
    description?: string; // Only for post-class
    toggleModal: Function;
};

const StudentClass = ({
    name,
    professor,
    date,
    meetingId,
    videoUrl, // post-class
    description, // post-class
    toggleModal,
}: StudentClassProps) => {

    const toggleModalHandler = () => {
        toggleModal({ name, professor, date, meetingId, videoUrl, description });
    };

    return (
        <div className='student-class-card' onClick={toggleModalHandler}>
            <div className='student-class-name-container'>
                <p>{name}</p>
            </div>
            <div className='student-teacher-name-container'>
                <p>Professor:&nbsp;</p>
                <p style={{fontWeight: 'bold'}}>{professor}</p>
            </div>
            <div className='student-date-container'>
                <p>{date}</p>
            </div>
        </div>
    );
};

export default StudentClass;
