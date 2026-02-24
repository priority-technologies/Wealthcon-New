import { useState } from "react";
import Papa from "papaparse";
import { FileUploader } from "react-drag-drop-files";
import { roleObject } from "@/helpers/constant";
import "./uploader.scss";

const UploaderUser = ({ title, fileTypes, classes, onDataParsed }) => {
  const [fileData, setFileData] = useState([]);

  const handleChange = (file) => {
    Papa.parse(file, {
      header: true,
      complete: (result) => {
        const formattedData = result.data
          .map((row) => {
            const mappedRow = {
              username: row["Full name"] || null,
              email: row["Email"] || null,
              password: row["Mobile number"] || null,
              mobile: row["Mobile number"] || null,
              role: row["Role"] || null,
              district: row["District"] || null,
              state: row["State"] || null,
            };

            if (
              !mappedRow.username &&
              !mappedRow.email &&
              !mappedRow.password &&
              !mappedRow.mobile &&
              !mappedRow.role &&
              !mappedRow.district &&
              !mappedRow.state
            ) {
              return null;
            }

            return mappedRow;
          })
          .filter((row) => row !== null);

        setFileData(formattedData);
        onDataParsed(formattedData);
      },
      error: (error) => {
        console.error(error);
      },
    });
  };

  return (
    <div className={classes}>
      <FileUploader
        handleChange={handleChange}
        name="file"
        types={fileTypes}
        classes={`custom-uploader ${classes}`}
      />
      <p>{title}</p>
    </div>
  );
};

export default UploaderUser;
