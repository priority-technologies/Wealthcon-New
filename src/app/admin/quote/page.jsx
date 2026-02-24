"use client";
import React, { Fragment, useState } from "react";
import Filter from "../../../components/Filter";
import GallaryImages from "@/components/GallaryImages";

function Gallary() {
  const [view, setView] = useState("grid");
  const [filterSelect, setFilterSelect] = useState({
    sortBy: null,
  });

  return (
    <Fragment>
      <Filter
        title="Quotes"
        type="quote"
        view={view}
        setView={setView}
        admin="true"
        filterSelect={filterSelect}
        setFilterSelect={setFilterSelect}
      />

      <GallaryImages
        view={view}
        setView={setView}
        editAble={true}
        filter={filterSelect}
        type="quote"
      />
    </Fragment>
  );
}

export default Gallary;
