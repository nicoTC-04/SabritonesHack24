
import React from "react";
import SearchBar from "../components/landing/searchbar";
import "./..//styles/landing/landing.css";

export default function Home() {
  return (
    <div>
      <div className="Banner">
        <h1 className="header">Encuentra a tu nuevo Profesor</h1>
      </div>
      <div className="CenteredContainer">
         <SearchBar />
      </div>

      <div>
        <h2>Profesores Destacados</h2>
      </div>

      <div>
        <h2>Categorías</h2>

        <div>
          <h3>Matematicas</h3>

        </div>

    </div>
    </div>
  );
}
