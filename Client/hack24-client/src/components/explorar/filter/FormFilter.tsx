"use client";

import { useState, useEffect } from "react";
import FilterSelect from "./FilterSelect";
import "@/styles/explorar/FormFilter.css";

type FormFilterProps = {
  categories: string[];
  grades: string[];
  onSubmitFilters: Function;
};

const FormFilter = ({ categories, grades, onSubmitFilters }: FormFilterProps) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedGrades, setSelectedGrades] = useState<string[]>([]);

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmitFilters(selectedCategories, selectedGrades);
  };

  return (
    <form className="form-filter-main-container" onSubmit={submitHandler}>
      <div className="form-filter-title-container">
        <p>Filtros</p>
      </div>
      <div className="form-filter-filters-container">
        <FilterSelect
          name="Categoria"
          selectedArray={selectedCategories}
          optionsArray={categories}
          setSelectedArray={setSelectedCategories}
        />
        <FilterSelect
          name="Grados"
          selectedArray={selectedGrades}
          optionsArray={grades}
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
