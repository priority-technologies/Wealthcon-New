"use client";

import Image from "next/image";
import React, { useEffect } from "react";
import { Zoom } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";
import Typography from "../Typography";
import { adminRoleObject } from "@/helpers/constant";
import axios from "axios";

const Slideshow = ({ SliderImages, clickIndex, editAble }) => {

  const handleChange = async(from, to) => {
    const imageId = SliderImages?.[to]?._id || null

    if (!imageId) {
      return;
    }
    try {
      await axios.get(`/api/gallery/${imageId}/view`);
    } catch (error) {
      if (error?.response?.status === 401) {
        return router.push("/login");
      }
      console.error(error.message);
    }

  };

  useEffect(() => {
    handleChange(null, clickIndex);
  }, [clickIndex]);

  return (
    <div className="slide-container">
      <Zoom
        defaultIndex={clickIndex}
        scale={0.4}
        autoplay={false}
        infinite={false}
        onChange={handleChange}
      >
        {SliderImages.map((each, index) => (
          <div className="sliedshowImageWrapper" key={index}>
            <Image
              alt="image"
              width={200}
              height={100}
              key={index}
              style={{ width: "100%" }}
              src={each?.image}
            />
            {each?.description && (
              <Typography
                tag="h4"
                size="text-base"
                weight="font-normal"
                color="text-primary-content"
                className="block text-left gallaryDecs pt-4"
              >
                {each.description}
                {editAble && (
                  <div className="mt-2 mb-2">
                    <b>Categories: </b>
                    {each?.studentCategory &&
                      each?.studentCategory.length > 0 && (
                        <span>
                          {each.studentCategory
                            .map((cat) => adminRoleObject[cat] || cat)
                            .join(", ")}
                        </span>
                      )}
                  </div>
                )}
              </Typography>
            )}
          </div>
        ))}
      </Zoom>
    </div>
  );
};

export default Slideshow;
