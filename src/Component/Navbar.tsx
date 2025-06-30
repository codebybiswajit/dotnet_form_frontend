import React, { useEffect, useState } from 'react';
import { Stack, DefaultButton, PrimaryButton, TextField, } from '@fluentui/react';
import { AppsListDetailRegular, PersonCircleRegular, SignOutRegular } from '@fluentui/react-icons';
import { Button, Popover, PopoverSurface, PopoverTrigger } from '@fluentui/react-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import type { DropdownProps } from '@fluentui/react-components';
import { makeStyles } from "@fluentui/react-components"; 


type UserDetailsProps = DropdownProps & {
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
  setApiEndpoint: React.Dispatch<React.SetStateAction<string>>;
};



const useStyles = makeStyles({
  roundedInput: {
    borderRadius: "2em",
    width: "300px",
    minWidth: "120px",
    // maxWidth: "240px",
    fontSize: "1em",
    padding: "4px 12px",
  },
});


export default function Navbar({ setSearchValue, setApiEndpoint }: UserDetailsProps) {
  const [role, setRole] = useState('');
  const [nameFilter, setNameFilter] = useState("")
  const styles =  useStyles()
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
        backgroundColor: "blue",
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
          <TextField
            value={nameFilter}
            className={styles.roundedInput}
            placeholder='search by name'
            onChange={(_, val) => setNameFilter(val || '')}
          />
          <Button onClick={() => { navigate('/all_user_details') }} className='btn rounded-4 p-1 text-white gap-2'>
            <AppsListDetailRegular />View List
          </Button>
          <Popover positioning="below-end" withArrow>
            <PopoverTrigger disableButtonEnhancement>
              <Button appearance="subtle" icon={<PersonCircleRegular fontSize={"24px"} />} style={{ borderRadius: "50%", minWidth: 40, minHeight: 40, padding: 0, background: "#1976d2", color: "white" }} />
            </PopoverTrigger>
            <PopoverSurface tabIndex={-1} style={{ minWidth: 120, padding: 0 }}>
              <Stack tokens={{ childrenGap: 0 }} style={{backgroundColor  :"white"}}>
                <Button appearance="subtle" style={{ width: "100%", justifyContent: "flex-start", borderRadius: 0, padding: "10px 16px" }} onClick={() => navigate('/user_details')}>
                  <PersonCircleRegular style={{ marginRight: 8 }} /> Profile
                </Button>
                <Button appearance="subtle" style={{ width: "100%", justifyContent: "flex-start", borderRadius: 0, padding: "10px 16px" }} onClick={logout}>
                  <SignOutRegular style={{ marginRight: 8 }} /> Logout
                </Button>
              </Stack>
            </PopoverSurface>
          </Popover>
        </Stack>
      ) : (
        <Stack horizontal horizontalAlign='center' tokens={{ childrenGap: 20 }}>
           <Popover positioning="below-end" withArrow>
            <PopoverTrigger disableButtonEnhancement>
              <Button appearance="subtle" icon={<PersonCircleRegular fontSize={"24px"} />} style={{ borderRadius: "50%", minWidth: 40, minHeight: 40, padding: 0, background: "#1976d2", color: "white" }} />
            </PopoverTrigger>
            <PopoverSurface tabIndex={-1} style={{ minWidth: 120, padding: 0 }}>
              <Stack tokens={{ childrenGap: 0 }} style={{backgroundColor  :"white"}}>
                <Button appearance="subtle" style={{ width: "100%", justifyContent: "flex-start", borderRadius: 0, padding: "10px 16px" }} onClick={() => navigate('/user_details')}>
                  <PersonCircleRegular style={{ marginRight: 8 }} /> Profile
                </Button>
                <Button appearance="subtle" style={{ width: "100%", justifyContent: "flex-start", borderRadius: 0, padding: "10px 16px" }} onClick={logout}>
                  <SignOutRegular style={{ marginRight: 8 }} /> Logout
                </Button>
              </Stack>
            </PopoverSurface>
          </Popover>
        </Stack>
      )
      }
    </Stack >
  );
}