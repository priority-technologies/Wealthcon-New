"use client";
import React, { Fragment, useState } from "react";
import Filter from "../../../components/Filter";
import GallaryImages from "../../../components/GallaryImages";

function Gallary() {
  const [view, setView] = useState("grid");
  const [filterSelect, setFilterSelect] = useState({
    sortBy: null,
  });

  return (
    <Fragment>
      <Filter
        title="Charts"
        type="gallary"
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
        type="gallery"
      />
    </Fragment>
  );
}

export default Gallary;
