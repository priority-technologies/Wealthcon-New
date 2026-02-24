"use client";
import React, { Fragment, useState } from "react";
import LiveSessionVideo from "../../../components/LiveSessionVideos";
import Filter from "../../../components/Filter";

function AdminVideos() {
  const [view, setView] = useState("grid");
  const [filterSelect, setFilterSelect] = useState({ sortBy: null, category: null });

  return (
    <Fragment>
      <Filter
        title="Videos"
        type="liveSession"
        view={view}
        setView={setView}
        admin="true"
        filterSelect={filterSelect}
        setFilterSelect={setFilterSelect}
      />
      <LiveSessionVideo
        view={view}
        setView={setView}
        editAble="true"
        filter={filterSelect}
        typeOfVideo="videos"
      />
    </Fragment>
  );
}

export default AdminVideos;
