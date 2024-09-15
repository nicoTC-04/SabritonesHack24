"use client";

import { useState, useEffect } from "react";
import FilterSelect from "./FilterSelect";
import "@/styles/explorar/FormFilter.css";

const categorias = [
  "Matematicas",
  "Fisica",
  "Quimica",
  "Biologia",
  "Historia",
  "Geografia",
  "Español",
];

const grados = ["Primaria", "Secundaria", "Preparatoria", "Profesional"];

const FormFilter = () => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedGrades, setSelectedGrades] = useState<string[]>([]);

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // LOGICA DE REQUEST CON FILTRO ACTUALIZAR ESTADO DE TEACHERS
    console.log(selectedCategories, selectedGrades);
  }

  return (
    <form className="form-filter-main-container" onSubmit={submitHandler}>
      <div className="form-filter-title-container">
        <p>Filtros</p>
      </div>
      <div className="form-filter-filters-container">
        <FilterSelect
          name="Categoria"
          selectedArray={selectedCategories}
          optionsArray={categorias}
          setSelectedArray={setSelectedCategories}
        />
        <FilterSelect
          name="Grados"
          selectedArray={selectedGrades}
          optionsArray={grados}
          setSelectedArray={setSelectedGrades}
        />
      </div>
      <div className="form-filter-submit-containter">
        <button className="form-filter-submit-button" type="submit">
          Filtrar
        </button>
      </div>
    </form>
  );
};

export default FormFilter;
