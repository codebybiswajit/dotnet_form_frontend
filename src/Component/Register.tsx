import React, { useState } from "react";
import {
    Button,
    Input,
    makeStyles,
    Text,
} from "@fluentui/react-components";
import { Stack } from "@fluentui/react";
import { Box } from "@fluentui/react-northstar";
import {
    Person48Color,
    ContactCard48Regular,
    NotepadPersonRegular,
    ArrowRightRegular,
    ArrowLeftRegular,
    CheckmarkRegular,
    ArrowClockwise24Regular
}
    from "@fluentui/react-icons";
import { Formik, Form, Field, ErrorMessage, FormikHelpers, FieldProps } from "formik";

import * as Yup from "yup";
import QualificationBlock from "./QualificationBlock";
import axios from "axios";
import { useNavigate, } from 'react-router-dom';
const useStyles = makeStyles({
    card: {
        width: "600px",
        maxWidth: "100%",
        height: "auto",
        margin: "9em auto",
        padding: "24px",
        borderRadius: "16px",
        backdropFilter: "blur(5px)",
        backgroundColor: "rgba(255,255,255,0.8)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
    },
    label: {
        fontWeight: 600,
        marginBottom: "4px",
    },
    error: {
        color: "red",
        fontSize: "10px",
        marginTop: "2px",
    },
});

const initialFormData = [
    { name: "", dob: "" },
    {
        email: "",
        phoneNumber: "",
        qualifications: [{ degree: "", collegeName: "", year: "", percentage: "" }],
    },
    { userName: "", password: "", confirmPassword: "" , role : "user"},
];
const year = new Date().getFullYear();
const icons = [
    {
        name: "Personal",
        label: "Personal Information",
        component: Person48Color,
        initialValues: { name: "", dob: "" },
        validationSchema: Yup.object({
            name: Yup.string().trim().min(2, "Name must be at least 2 characters").required("Full Name is required"),
            dob: Yup.string().matches(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/
                , "Date of Birth must be in YYYY-MM-DD format").required("Date of Birth is required"),
        }),
        fields: [
            { name: "name", label: "Full Name", type: "text", placeholder: "Firstname Lastname" },
            { name: "dob", label: "Date of Birth", type: "date", placeholder: "yyyy-mm-dd" },
        ],
    },
    {
        name: "Contact",
        label: "Contact Information",
        component: ContactCard48Regular,
        initialValues: {
            email: "",
            phoneNumber: "",
            qualifications: [{ degree: "", collegeName: "", year: "", percentage: "" }],
        },
        validationSchema: Yup.object({
            email: Yup.string().email("Invalid email").required("Required"),
            phoneNumber: Yup.string()
                .matches(/^[4-9]\d{9}$/, "Enter a valid number")
                .required("Required"),
            qualifications: Yup.array().of(
                Yup.object().shape({
                    degree: Yup.string().trim().min(2, "degree must be of 2 character").required("Required"),
                    collegeName: Yup.string().trim().min(3, "College Name Must Be Greter Than 3 Character").required("Required").matches(/^[^\d]*$/, "Degree must not contain numbers"),
                    year: Yup.number()
                        .typeError("Year must be a valid number")
                        .integer("Year must be an integer")
                        .min(2006, "Year must be after 2005")
                        .max(year, `year must be smaller than ${year}`)
                        .required("Passing year is required"),

                    percentage: Yup.number()
                        .typeError("Percentage must be a number")
                        .min(0, "Percentage cannot be negative")
                        .max(100, "Percentage cannot exceed 100")
                        .required("Percentage is required"),

                })
            ),
        }),
        fields: [
            { name: "email", label: "Email", type: "email", placeholder: "example@email.com" },
            { name: "phoneNumber", label: "Phone", type: "text", placeholder: "Phone number without country code" },
        ],
    },
    {
        name: "Profile",
        label: "Profile ",
        component: NotepadPersonRegular,
        initialValues: {
            userName: "",
            password: "",
            confirmPassword: "",
        },
        validationSchema: Yup.object({
            userName: Yup.string().matches(/^[a-zA-Z0-9_]{3,16}$/, "User ID must be 3-16 characters long and can only contain letters, numbers, and underscores").required("ID is required"),
            password: Yup.string().matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{6,}$/
                , "Password must be at least 6 characters long, contain at least one uppercase letter, one lowercase letter, and one number").required("Required"),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref("password")], "Passwords must match")
                .required("Confirm your password"),

        }),
        fields: [
            { name: "userName", label: "User ID", type: "text", placeholder: "user_1" },
            { name: "password", label: "Password", type: "password", placeholder: "Password@01" },
            { name: "confirmPassword", label: "Confirm Password", type: "password", placeholder: "re-enter password" },
        ],
    },
];

const Home = () => {
    const styles = useStyles();
    const [activeIndex, setActiveIndex] = useState(0);
    const [formData, setFormData] = useState(initialFormData);
    const navigate = useNavigate()
    const currentStep = icons[activeIndex];

    const handleNav = (
        direction: "next" | "prev",
        values: any,
        setSubmitting: (val: boolean) => void
    ) => {
        const updated = [...formData];
        updated[activeIndex] = values;
        setFormData(updated);
        setActiveIndex((prev) => (direction === "next" ? prev + 1 : prev - 1));
        setSubmitting(false);
    };

    const handleSubmit = (
        values: any,
        { setSubmitting, resetForm }: FormikHelpers<any>
    ) => {
        const updated = [...formData];
        updated[activeIndex] = values;
        setFormData(updated);
        console.log("Final Form Data:", updated);
        setFormData(initialFormData);
        const userData = {
            name: updated[0].name,
            dob: updated[0].dob,
            email: updated[1].email,
            phoneNumber: updated[1].phoneNumber,
            Qualified: updated[1].qualifications,
            userName: updated[2].userName,
            password: updated[2].password,
            confirmPassword: updated[2].confirmPassword,
            role  : 'user'
        };
        console.log("Final User Data:", userData);
        axios.post("http://localhost:5028/api/UserService/create", userData, {
            headers: { "Content-Type": "application/json" },
        })
            .then((response) => {
                alert("User Registered Now");
                navigate("/login");
            })
            .catch((error) => {
                // console.log(updated)
                console.error("Submission error:", error);
                alert("Submission failed due to Server Error.");
            });
        setActiveIndex(0);
        resetForm();
        setSubmitting(false);
    };

    return (
        <Box className={styles.card}>
            <Stack horizontal >
                <Stack horizontalAlign="center" grow={1}>
                    <Text style={{fontSize : "1.3em", marginLeft: "5em"}} >Registeration Form</Text>
                </Stack>
                <Stack horizontal horizontalAlign="end">
                    <Button onClick={() => window.location.reload()}>
                        <ArrowClockwise24Regular />
                    </Button>
                </Stack>
            </Stack>
            <Stack
                horizontal
                verticalAlign="center"
                horizontalAlign="center"
                tokens={{ childrenGap: "8em" }}
                style={{ fontSize: "1.2em", marginTop: "20px", position: "relative" }}
            >
                {icons.map((item, idx) => {
                    const Icon = item.component;
                    const isActive = activeIndex === idx;
                    return (
                        <Stack
                            verticalAlign="space-between"
                            tokens={{ childrenGap: "20px" }}
                            key={item.name}
                        >
                            <Button
                                appearance={isActive ? "primary" : "secondary"}
                                className={isActive ? "primary fs-1 " : "secondary fs-2"}
                                icon={<Icon style={{ fontSize: "25px" }} />}
                                title={item.label}
                                disabled = {isActive}
                            />
                        </Stack>
                    );
                })}

                {icons.map((_, idx) => {
                    if (idx === 0) return null;
                    return (
                        <div
                            key={`progress-line-${idx}`}
                            className="position-absolute"
                            style={{
                                top: "50%",
                                transform: "translateY(-50%)",
                                left:
                                    idx === 1
                                        ? "calc(0% - 26px)"
                                        : `calc(${(100 / (icons.length - 1)) * (idx - 1)}% - 115px)`,
                                width: `calc(${100 / (icons.length - 1)}% - 170px)`,
                                height: "6px",
                                borderRadius: "5px",
                                backgroundColor: activeIndex >= idx ? "#0d6efd" : "#ccc",
                                zIndex: 1,
                                transition: "background-color 0.5s ease",
                            }}
                        />
                    );
                })}
            </Stack>

            <Formik
                enableReinitialize
                initialValues={formData[activeIndex]}
                validationSchema={currentStep.validationSchema}
                onSubmit={(values, helpers) => {
                    currentStep.validationSchema
                        .validate(values, { abortEarly: false })
                        .then(() => {
                            const updated = [...formData];
                            updated[activeIndex] = values;
                            setFormData(updated);

                            if (activeIndex === icons.length - 1) {
                                handleSubmit(values, helpers);
                            } else {
                                handleNav("next", values, helpers.setSubmitting);
                            }
                        })
                        .catch((validationErrors) => {
                            helpers.setSubmitting(false);
                        });
                }}

            >
                {({ values, setFieldValue, isSubmitting }) => (
                    <Form style={{ marginTop: "32px", padding: "20px" }}>
                        {currentStep.fields.map((field) => (
                            <Box
                                key={field.name}
                                style={{
                                    marginBottom: "16px",
                                    paddingLeft: "50px",
                                    paddingRight: "50px",
                                }}
                            >
                                <label className={styles.label}>{field.label}</label>
                                {field.type === "file" ? (
                                    <input
                                        name={field.name}
                                        type="file"
                                        onChange={(e) =>
                                            setFieldValue(field.name, e.target.files?.[0] || null)
                                        }
                                    />
                                ) : (
                                    <Field name={field.name}>
                                        {({ field: formikField }: FieldProps) => (
                                            <Input
                                                {...formikField}
                                                appearance="outline"
                                                placeholder={field.placeholder}
                                                // ={field.type}
                                                value={formikField.value ?? ""}
                                                style={{
                                                    width: "100%",
                                                    fontSize: ".9em",
                                                    padding: ".5em",
                                                    border: "1px solid black",
                                                    borderRadius: "5px",
                                                }}
                                            />
                                        )}
                                    </Field>

                                )}
                                <ErrorMessage
                                    name={field.name}
                                    component="div"
                                    className={styles.error}
                                />
                            </Box>
                        ))}

                        {activeIndex === 1 && (
                            <Box style={{ paddingLeft: "50px", paddingRight: "50px" }}>
                                <QualificationBlock />
                            </Box>
                        )}

                        <Stack
                            horizontal
                            horizontalAlign="center"
                            tokens={{ childrenGap: "20px" }}
                            style={{ marginTop: "32px" }}
                        >
                            <Button
                                type="button"
                                appearance="outline"
                                disabled={activeIndex === 0 || isSubmitting}
                                style={{ border: "1px solid black", borderRadius: "5px", padding: ".5em" }}
                                title="previous"
                                onClick={() => {
                                    const updated = [...formData];
                                    updated[activeIndex] = values;
                                    setFormData(updated);
                                    setActiveIndex((prev) => prev - 1);
                                }}
                            >
                                <Stack>
                                    <ArrowLeftRegular />
                                    <Text>Previous</Text>
                                </Stack>
                            </Button>

                            <Button type="submit" disabled={isSubmitting} style={{ border: "1px solid black", borderRadius: "5px", padding: ".5em" }}>
                                {activeIndex === icons.length - 1 ? (
                                    <Stack>
                                        <CheckmarkRegular />
                                        <Text>Submit All</Text>
                                    </Stack>
                                ) : (
                                    <Stack>
                                        <ArrowRightRegular />
                                        <Text>Next</Text>
                                    </Stack>
                                )}
                            </Button>
                        </Stack>
                    </Form>
                )}
            </Formik>
            <Stack horizontal horizontalAlign="center">
                <Text >Already Have An Account <span onClick={() => navigate("/login")
                } style={{ cursor: 'pointer', color: 'blue' }}>Login Now</span></Text>
            </Stack>
        </Box >
    );
}
export default Home;