"use client";

import React from 'react'
import { useState } from 'react';
import '@/styles/misclases/StudentClass.css'

type StudentClassProps = {
    name: string;
    professor: string;
    fecha: string;
    hora: string;
    toggleModal: Function;
};

const StudentClass = ({ name, professor, fecha, hora, toggleModal }: StudentClassProps) => {

    const toggleModalHandler = () => {
        toggleModal();
    }

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
                <p>{fecha}: {hora}</p>
            </div>
        </div>
    );
};

export default StudentClass;

