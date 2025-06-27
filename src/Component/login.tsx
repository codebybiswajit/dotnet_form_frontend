import React, { useState } from 'react';
import { Stack, Text } from '@fluentui/react';
import axios from 'axios';
import {
  Button,
} from "@fluentui/react-components";
import { makeStyles } from "@fluentui/react-components";
import { ArrowClockwise24Regular } from '@fluentui/react-icons';
import { useNavigate } from 'react-router-dom';
const useStyles = makeStyles({
  greenHoverButton: {
    width: "30%",
    border: "1px solid black",
    borderRadius: "1em",
    padding: ".5em",
    backgroundColor: "rgba(255,255,255,0.8)",
    transition: "background-color 0.3s ease",
    ":hover": {
      backgroundColor: "green",
      color: "white",
    },
  },
  card: {
    borderRadius: "16px",
    backdropFilter: "blur(5px)",
    backgroundColor: "rgba(255,255,255,0.8)",
    boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
  }
});

// type LoginProps = {
//   setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>
// }

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const styles = useStyles();
  const navigate = useNavigate()
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    axios.post(
      'http://localhost:5028/api/UserService/login',
      {
        userName: username,
        password: password
      },
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
      .then(response => {
        // console.log('Login successful:', response.data.user);
        alert(response.data.message);
        setUsername('');
        setPassword('');
        window.localStorage.setItem("role", response.data.user.role);
        window.localStorage.setItem("isloggedIn", "true");
        if (response.data.user.role === 'admin') {
          navigate('/all_user_details')
        } else { navigate('/user_details') }
        window.location.reload()
      })
      .catch(error => {
        window.localStorage.setItem("isloggedIn", "false");
        // console.error('Login failed:', error);
        alert('User Not Found');
      });
  };

  return (
    <form onSubmit={handleLogin}>
      <Stack className={styles.card}
        styles={{
          root: {
            width: '500px',
            margin: '8em auto auto',
            padding: '20px',
            border: '1px solid #ccc',
            borderRadius: '8px',
            backgroundColor: "#fcfcfc",
            boxShadow: "1px 10px 30px black"
          }
        }}
      >
        <Stack horizontal >
          <Stack horizontalAlign="center" grow={1}>
            <Text style={{ fontSize: "1.3em", marginLeft: "5em" }} >Login Form</Text>
          </Stack>
          <Stack horizontal horizontalAlign="end">
            <Button onClick={() => window.location.reload()}>
              <ArrowClockwise24Regular />
            </Button>
          </Stack>
        </Stack>

        <Stack>
          <label htmlFor="username" className='fs-5 mt-3'>Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername((e.target as HTMLInputElement).value)}
            style={{ border: "1px solid gray", padding: ".5em", borderRadius: "1em" }}
            required
          />
        </Stack>

        <Stack>
          <label htmlFor="password" className='fs-5 mt-3'>Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword((e.target as HTMLInputElement).value)}
            style={{ border: "1px solid gray", padding: ".5em", borderRadius: "1em" }}
            required
          />
        </Stack>

        <Stack horizontal horizontalAlign="center" style={{ marginTop: ".5em" }}>
          <Button type="submit" className={styles.greenHoverButton}>
            Login
          </Button>
        </Stack>

        <Stack horizontal horizontalAlign="center" style={{ marginTop: ".5em" }}>
          <Text >Don't Have An Account <span onClick={() => navigate("/register")
          } style={{ cursor: 'pointer', color: 'blue' }}>Register Now</span></Text>
        </Stack>
      </Stack>
    </form>
  );
}
