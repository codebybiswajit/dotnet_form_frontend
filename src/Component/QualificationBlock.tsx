import React from "react";
import { FieldArray, useFormikContext, ErrorMessage } from "formik";
import { AddRegular, DismissRegular } from "@fluentui/react-icons";

interface Qualification {
  degree: string;
  collegeName: string;
  year: string;
  percentage: string;
}

const QualificationBlock = () => {
  const { values, setFieldValue } = useFormikContext<{ qualifications?: Qualification[] }>();
  const qualifications = values.qualifications ?? [];

  return (
    <FieldArray name="qualifications">
      {({ push, remove }) => (
        <>
          <label style={{ fontWeight: "bold", fontSize: "1rem" }}>Qualifications</label>
          <p style={{ fontSize: '12px', color: "red" }}>* In case you have <span style={{ color: "blue" }}>CGPA</span> convert it into <span style={{ color: "blue" }}> % </span></p>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              marginTop: "10px",
            }}
          >
            {qualifications.map((q, idx) => (
              <div key={idx} style={{ display: "flex", flexDirection: "column", gap: "4px", borderBottom: "1px solid #ccc", paddingBottom: "12px" }}>
                <div style={{ display: "flex", gap: "8px" }}>
                  <input
                    style={{ width: "25%", fontSize: "0.8em" }}
                    type="text"
                    placeholder="Highest qualification"
                    value={q.degree}
                    onChange={(e) =>
                      setFieldValue(`qualifications[${idx}].degree`, e.target.value)
                    }
                  />
                  <input
                    style={{ width: "25%", fontSize: "0.8em" }}
                    type="text"
                    placeholder="College/University"
                    value={q.collegeName}
                    onChange={(e) =>
                      setFieldValue(`qualifications[${idx}].collegeName`, e.target.value)
                    }
                  />
                  <input
                    style={{ width: "20%", fontSize: "0.8em" }}
                    type="text"
                    placeholder="Passing Year"
                    value={q.year}
                    onChange={(e) =>
                      setFieldValue(`qualifications[${idx}].year`, e.target.value)
                    }
                  />
                  <input
                    style={{ width: "20%", fontSize: "0.8em" }}
                    type="text"
                    placeholder="Enter in %"
                    value={q.percentage}
                    onChange={(e) =>
                      setFieldValue(`qualifications[${idx}].percentage`, e.target.value)
                    }
                  />
                  <div
                    style={{
                      width: "10%",
                      display: "flex",
                      justifyContent: "space-around",
                      alignItems: "center",
                    }}
                  >
                    <AddRegular
                      onClick={() =>
                        push({
                          degree: "",
                          collegeName: "",
                          year: "",
                          percentage: "",
                        })
                      }
                      style={{ cursor: "pointer", color: "#0d6efd" }}
                    />
                    <DismissRegular
                      onClick={() => remove(idx)}
                      style={{ cursor: "pointer", color: "red" }}
                    />
                  </div>
                </div>

                <div style={{ display: "flex", gap: "8px", fontSize: "0.8em", color: "red" }}>
                  <div style={{ width: "25%" }}>
                    <ErrorMessage name={`qualifications[${idx}].degree`} component="div" />
                  </div>
                  <div style={{ width: "25%" }}>
                    <ErrorMessage name={`qualifications[${idx}].collegeName`} component="div" />
                  </div>
                  <div style={{ width: "20%" }}>
                    <ErrorMessage name={`qualifications[${idx}].year`} component="div" />
                  </div>
                  <div style={{ width: "20%" }}>
                    <ErrorMessage name={`qualifications[${idx}].percentage`} component="div" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </FieldArray>
  );
};

export default QualificationBlock;
