import React, { useEffect, useState } from 'react';
import { Stack, StackItem } from '@fluentui/react';
import { Button, Input, Text, Caption1, } from '@fluentui/react-components';
import axios from 'axios';
import {
    ArrowClockwise24Regular, DeleteOffRegular, DataUsageEditRegular, SaveRegular,
    CallRegular,
    MailAllReadRegular
} from '@fluentui/react-icons';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom'

import { Avatar, } from "@fluentui/react-components";

interface Qualification {
    collegeName: string;
    degree: string;
    year: number;
    percentage: string;
}

interface User {
    id: string;
    name: string;
    phoneNumber: string;
    userName: string;
    email: string;
    password: string;
    confirmPassword: string;
    dob: string;
    qualified: Qualification[];
    role: string;
}

const userSchema = yup.object().shape({
    name: yup.string().required('Name is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    phoneNumber: yup.string().matches(/^[4-9]\d{9}$/, "Enter a valid number").required(),
    dob: yup.string().matches(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/
        , "Date of Birth must be in YYYY-MM-DD format").required("Date of Birth is required"),
});

export default function UserDetails() {
    const [userData, setUserData] = useState<User | null>(null);
    const [userProfData, setUserProfData] = useState<User | null>(null);
    const [errors, setErrors] = useState<Partial<Record<keyof User, string>>>({});
    const [isEditing, setIsEditing] = useState(false);
    const navigate = useNavigate()
    const [isloggedIn, setIsLoggedin] = useState(false)
    useEffect(() => {
        fetchUserData();
        setIsLoggedin(sessionStorage.getItem('isloggedIn') === "true")
    }, []);
    if (sessionStorage.length === 0) {
        navigate("/login")
    }


    const fetchUserData = () => {
        axios.get('http://localhost:5028/api/UserService/me', { withCredentials: true })
            .then((res) => {
                setUserData(res.data)
                setUserProfData(res.data)
            })
            .catch((err) => console.error('Error fetching user data:', err));
    };

    const updateUserData = async () => {
        if (!userData) return;

        try {
            await userSchema.validate(userData, { abortEarly: false });
            setErrors({});
            await axios.put('http://localhost:5028/api/UserService/me', userData, { withCredentials: true });
            alert("User updated successfully");
            setIsEditing(false);
        } catch (err: any) {
            if (err.name === 'ValidationError') {
                const fieldErrors: any = {};
                err.inner.forEach((e: any) => {
                    fieldErrors[e.path] = e.message;
                });
                setErrors(fieldErrors);
            } else {
                console.error('Update failed:', err);
                alert("Update failed");
            }
        }
    };

    const deleteUser = () => {
        axios.delete('http://localhost:5028/api/UserService/me', { withCredentials: true })
            .then(() => {
                alert("User deleted");
                setUserData(null);
                navigate('/register');
            })
            .catch(err => console.error('Delete failed:', err));
    };

    // const logout = () => {
    //     axios.patch('http://localhost:5028/api/UserService/logout/me', {}, { withCredentials: true })
    //         .then(() => {
    //             alert("Logged out");
    //             setUserData(null);
    //             window.location.href = ('/login');
    //         })
    //         .catch(err => console.error('Logout error:', err));
    // };

    const updateField = (field: keyof User, value: string) => {
        setUserData(prev => prev ? { ...prev, [field]: value } : prev);
    };

    return (
        <>
            {isloggedIn && <Stack horizontal horizontalAlign='center' className='row container mt-5'
                style={{
                    margin: 'auto',
                    width: "100%"
                    // padding: '20px',
                    // border: '1px solid #ccc',
                    // backgroundColor: 'rgba(255,255,255,0.8)',
                    // backdropFilter: "blur(5px)",
                    // borderRadius: '1em',
                    // boxShadow: '1px 10px 30px rgba(0,0,0,0.2)'
                }}
            >


                <Stack className="col-md-4">
                    <Stack styles={{
                        root: {
                            // width: '350px',
                            // maxHeight: "650px",
                            width: "70%",
                            margin: '5em auto',
                            padding: '20px',
                            border: '1px solid #ccc',
                            backgroundColor: 'rgba(255,255,255,0.8)',
                            backdropFilter: "blur(5px)",
                            borderRadius: '1em',
                            boxShadow: '1px 10px 30px rgba(0,0,0,0.2)'
                        }
                    }}>
                        <Stack style={{ marginTop: "5em" }}>
                            <Stack horizontal horizontalAlign='center'  >
                                <Avatar
                                    shape="circular"
                                    name={userProfData?.name}
                                    color="colorful"
                                    active='active'
                                    activeAppearance='ring-shadow'
                                    size={48}
                                    style={{ backgroundColor: "#add8e6", borderRadius: "50%" }}
                                >
                                    {userProfData?.name}
                                </Avatar>
                            </Stack>
                            <Stack horizontal horizontalAlign='center'>
                                <Text style={{ fontSize: "1.5em", marginTop: ".5em" }}> {userProfData?.name}</Text>
                            </Stack>
                            <Stack horizontal horizontalAlign='center'>
                                <Text style={{ fontSize: "1em", marginTop: ".5em" }}>User Name   : <span style={{ fontWeight: "bolder" }}>{userProfData?.userName}</span></Text>
                            </Stack>
                            <Stack horizontal horizontalAlign='center'>
                                <Text style={{ fontSize: "1em", marginTop: ".5em" }}><CallRegular />+91 {userProfData?.phoneNumber}</Text>
                            </Stack>
                            <Stack horizontal horizontalAlign='center'>
                                <Text style={{ fontSize: "1em", marginTop: ".5em" }}>Role : {userProfData?.role?.toUpperCase()}</Text>
                            </Stack>
                            <Stack horizontal horizontalAlign='center'>
                                <a href={`mailto:${userProfData?.email}`} style={{ fontSize: ".9em", color: "blue", textDecoration: "none" }}><MailAllReadRegular /> {userProfData?.email}</a>
                            </Stack>

                            <Stack horizontal horizontalAlign='center' tokens={{ childrenGap: 10 }} style={{
                                marginTop: "8em"
                            }}>
                                <Button
                                    onClick={() => {
                                        if (isEditing) updateUserData();
                                        else setIsEditing(true);
                                    }}
                                    style={{ border: '1px solid black', borderRadius: '1em', padding: '.5em', gap: "20px" }}

                                >
                                    {isEditing ? 'Save' : 'Edit'}
                                    {isEditing ? <SaveRegular fontSize={"20px"} color='blue' /> : <DataUsageEditRegular fontSize={"20px"} color='blue' />}

                                </Button>
                                <Button
                                    onClick={deleteUser}
                                    style={{ border: '1px solid black', borderRadius: '1em', padding: '.5em', gap: "20px", backgroundColor: "red", color: "white" }}

                                >
                                    <DeleteOffRegular />

                                </Button>
                            </Stack>
                        </Stack>
                    </Stack>
                </Stack>
                <Stack className="col-md-5">

                    <Stack styles={{
                        root: {
                            width: '100%',
                            margin: '5em auto',
                            padding: '20px',
                            border: '1px solid #ccc',
                            backgroundColor: 'rgba(255,255,255,0.8)',
                            backdropFilter: "blur(5px)",
                            borderRadius: '1em',
                            boxShadow: '1px 10px 30px rgba(0,0,0,0.2)'
                        }
                    }}>
                        <Stack horizontal horizontalAlign='center' tokens={{ childrenGap: 10 }} style={{ border: '1px solid transparent', boxShadow: "10px 10px 10px 1px black", borderRadius: "1em", padding: ".5em" }}>
                            {/* <Button onClick={logout} title='Signout' className='bg-secondary p-2 rounded-5 text-white'>
                                <SignOutRegular fontSize={"20px"} />
                            </Button>
                            <Button className="text-danger" title="Delete Account" onClick={deleteUser}>
                                <DeleteOffRegular fontSize={"20px"} />
                            </Button> */}
                            {/* <Button>View List Of Register User<ShareRegular fontSize={"20px"} style={{ color: 'blue' }} onClick={() => window.location.href = '/all_user_details'} /></Button> */}
                            <Stack horizontal horizontalAlign="end">
                                <Button onClick={() => window.location.reload()} title='Refresh Page'>
                                    <ArrowClockwise24Regular />
                                </Button>
                            </Stack>
                        </Stack>

                        {userData ? (
                            <Stack style={{ marginTop: '1em' }}>
                                {[
                                    { label: 'Name', field: 'name' },
                                    { label: 'Email', field: 'email' },
                                    { label: 'Phone', field: 'phoneNumber' },
                                    { label: 'Date of Birth', field: 'dob' },
                                ].map(({ label, field }) => (
                                    <StackItem key={field} style={{ marginTop: ".3em", padding: ".5em" }}>
                                        {label}:
                                        <Input
                                            value={userData![field as keyof User] as string}
                                            onChange={e => updateField(field as keyof User, e.target.value)}
                                            disabled={!isEditing}
                                            style={{
                                                border: isEditing ? "1px solid gray" : '1px solid transparent',
                                                width: "100%",
                                                borderRadius: "1em",
                                                padding: isEditing ? ".5em" : ".1em"
                                            }}
                                        />
                                        {errors[field as keyof User] && (
                                            <Caption1 style={{ color: 'red' }}>{errors[field as keyof User]}</Caption1>
                                        )}
                                    </StackItem>
                                ))}

                                {/* <Stack horizontalAlign='start' style={{ marginTop: ".1em", padding: ".5em" }}>
                                    User Name:
                                    <Text>{userData.userName}</Text>
                                </Stack>
                                <Stack horizontalAlign='start' style={{ marginTop: ".1em", padding: ".5em" }}>
                                    Role:
                                    <Text>{userData.role}</Text>
                                </Stack> */}

                                <Stack style={{ marginTop: "1em" }}>
                                    <p><strong>Qualifications:</strong> (For now you can't change qualification)</p>
                                    <ul>
                                        {userData.qualified?.map((q, idx) => (
                                            <li key={idx}>
                                                {q.degree} from {q.collegeName} ({q.year}) – {q.percentage}%
                                            </li>
                                        ))}
                                    </ul>
                                </Stack>


                            </Stack>
                        ) : (
                            <Stack horizontal horizontalAlign='center'>
                                <p style={{ marginTop: '1em' }}>No user data loaded. <span className='text-center text-primary' onClick={() => { navigate('/login') }}>Login again</span></p>
                            </Stack>
                        )}
                    </Stack>
                </Stack>

            </Stack>}
        </>

    );
}