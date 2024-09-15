"use client";

import React from 'react'
import { useState } from 'react';
import '@/styles/misclases/StudentClass.css'

type StudentClassProps = {
    student: {
        name: string;
        professor: string;
        fecha: string;
        hora: string;
    };
};

const StudentClass = ({ student }: StudentClassProps) => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const handleCardClick = () => {
        setIsModalOpen(true);
      };
    const handleCloseModal = () => {
    setIsModalOpen(false);
    };

    return (
        <div className='student-class-card' onClick={handleCardClick}>
            <div className='student-class-name-container'>
                <p>{student.name}</p>
            </div>
            <div className='student-teacher-name-container'>
                <p>Professor:&nbsp;</p>
                <p style={{fontWeight: 'bold'}}>{student.professor}</p>
            </div>
            <div className='student-date-container'>
                <p>{student.fecha}: {student.hora}</p>
            </div>

        </div>

        /* Modal to show when card is clicked */

        

    );
};

export default StudentClass;