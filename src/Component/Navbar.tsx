import React, { useEffect, useState } from 'react';
import { Stack, DefaultButton, PrimaryButton, TextField, } from '@fluentui/react';
import { AppsListDetailRegular, PersonCircleRegular, SignOutRegular } from '@fluentui/react-icons';
import { Button, Dropdown, Option, } from '@fluentui/react-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import type { DropdownProps } from '@fluentui/react-components';
type UserDetailsProps = DropdownProps & {
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
  setApiEndpoint: React.Dispatch<React.SetStateAction<string>>;
}
export default function Navbar({ setSearchValue, setApiEndpoint }: UserDetailsProps) {
  const [role, setRole] = useState('');
  const [nameFilter, setNameFilter] = useState("")

  const navigate = useNavigate();
  const [isloggedIn, setIsLoggedin] = useState(false)
  useEffect(() => {
    setIsLoggedin(sessionStorage.getItem('isloggedIn') === "true")
    setRole(sessionStorage.getItem('role') || "user")
    setSearchValue(nameFilter)
  }, [role, nameFilter, setSearchValue]);


  const handleLogin = () => {
    navigate('/login')
  };

  const logout = () => {
    axios.patch('http://localhost:5028/api/UserService/logout/me', {}, { withCredentials: true })
      .then(() => {
        alert("Logged out");
        sessionStorage.clear()
        navigate('/login');
        window.location.reload()
      })
      .catch(err => console.error('Logout error:', err));
  };

  return (
    <Stack horizontal tokens={{ childrenGap: 10 }} verticalAlign="center" styles={{
      root: {
        background: '#f3f2f1',
        width: '100%',
        maxWidth: "100%",
        height: "6.5vh",
        margin: "auto",
        padding: "24px",
        backdropFilter: "blur(5px)",
        backgroundColor: "#6c757d",
        boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
      }
    }}>
      <Stack grow styles={{
        root: {
          width: '60%',
          maxWidth: "100%",
          height: "auto",
          margin: "auto",
          boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
        }
      }} />
      {!isloggedIn ? (
        <Stack horizontal horizontalAlign="end" tokens={{ childrenGap: 10 }}>
          <DefaultButton text="Register" onClick={() => { navigate('/register') }} />
          <PrimaryButton text="Login" onClick={handleLogin} />
        </Stack>
      ) : role === 'admin' ? (
        <Stack horizontal horizontalAlign="end" tokens={{ childrenGap: 10 }}>
          <Button onClick={() => { navigate('/user_details') }} className='btn bg-primary rounded-4 p-2 text-white gap-2'><PersonCircleRegular /> Profile</Button>
          <Button onClick={() => { navigate('/all_user_details') }} className='btn bg-primary rounded-4 p-1 text-white gap-2'> <AppsListDetailRegular />View List</Button>
          <TextField
            value={nameFilter}
            className='p-1'
            placeholder='search by name'
            onChange={(_, val) => setNameFilter(val || '')}
          />
          {/* <DefaultButton
            text="Sort By Desecending"
            styles={{
              root: {
                marginTop : ".2em",
                
                // minHeight: '32px',
                height: '32px',
                fontSize: 'em',
                borderRadius: '6px',
                background: '#1976d2',
                color: 'white',
                border: 'none',
              },

              rootHovered: {
                background: '#1565c0',
                color: 'white',
              }
            }}
            className='p-3'
            onClick={() => { setApiEndpoint('http://localhost:5028/api/UserService/get-all-user/descending') }}
          /> */}
          <Dropdown
            placeholder="Select Filter"
            style={{
              minWidth: 160,
              marginTop: ".2 em",
              backgroundColor: "white",
              border: "2px solid #1976d2",
              borderRadius: "6px",
              // height: "32px",
              fontSize: "0.7em",
              display: "flex",
              alignItems: "center",
            }}
            className='p-2'
            listbox={{
              style: {
                fontSize: ".95em",
                borderRadius: "8px",
              }
            }}
            onOptionSelect={(_, data) => setApiEndpoint(data.optionValue as string)}
          >
            <Stack style={{ backgroundColor: "white", color: "black", border: "2px solid #1976d2", borderRadius: "1em" }} aria-disabled="true">
              <Option value="http://localhost:5028/api/UserService/get-all-user" style={{ borderBottom: ".1rem solid", fontSize: ".8em" }}>
                Select
              </Option>
              <Option value="http://localhost:5028/api/UserService/get-all-user/ascending" style={{ borderBottom: ".1rem solid", fontSize: ".8em" }}>
                Sort By Name (Asc)
              </Option>
              <Option value="http://localhost:5028/api/UserService/get-all-user/descending" style={{ borderBottom: ".1rem solid", fontSize: ".8em" }}>
                Sort By Name (Desc)
              </Option>
              <Option value="http://localhost:5028/api/UserService/get-all-user/created/ascending" style={{ fontSize: ".8em" }}>
                Sort by Date
              </Option>
            </Stack>
          </Dropdown>

          <Button onClick={logout} title='Signout' className='bg-primary  rounded-5 text-white p-1' style={{

            // minHeight: '32px',
            // height: '32px',
            fontSize: '0.95em',
            borderRadius: '6px',
            color: 'white',
            border: 'none',

          }}>
            <SignOutRegular fontSize={"20px"} />
          </Button>
        </Stack>
      ) : (
        <Stack horizontal horizontalAlign='center' tokens={{ childrenGap: 20 }}>
          <Button onClick={() => { navigate('/user_details') }} className='btn bg-primary rounded-4 p-2 text-white gap-2'><PersonCircleRegular /> Profile</Button>
          <Button onClick={logout} title='Signout' className='bg-primary  rounded-5 text-white p-1'>
            <SignOutRegular fontSize={"20px"} />
          </Button>
        </Stack>
      )
      }
    </Stack >
  );
}