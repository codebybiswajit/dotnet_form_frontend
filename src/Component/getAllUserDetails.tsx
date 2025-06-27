import React, { useEffect, useState } from 'react';
import { Stack } from '@fluentui/react';
import {
  Button,
  Label,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
  Text
} from '@fluentui/react-components';
import axios, { all } from 'axios';
import {
  ArrowEnterLeftFilled,
  AddRegular,
  Delete24Regular
} from '@fluentui/react-icons';
import { useNavigate } from 'react-router-dom';
import { Dropdown, Option, } from '@fluentui/react-components';


interface Qualification {
  collegeName: string;
  degree: string;
  year: number;
  percentage: string;
}

interface User {
  id: string;
  name: string;
  userName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  dob: string;
  qualified: Qualification[];
  createdAt: string;
  role: string;

}

type SearchProps = {
  searchValue: string;
  apiEndpoint: string;
};

export default function AllUserDetails({ searchValue, apiEndpoint }: SearchProps) {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [toRender, isToRender] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [limit, setLimit] = useState(3);
  const [count, setCount] = useState(0);
  const navigate = useNavigate();
  const sortOptions = [
    { value: 1, label: "1", },
    { value: 2, label: "2", },
    { value: 3, label: "3", },
    { value: 5, label: "5", },
    { value: 10, label: "10", },
    { value: 15, label: "15", },
  ];



  const handleRemove = (_id: string) => {
    axios
      .delete(`http://localhost:5028/api/UserService/${_id}`)
      .then((res) => {
        alert(res.data.message);
        setAllUsers((prev) => prev.filter((user) => user.id !== _id));
        setCount((prev) => prev - 1);
      })
      .catch((err) => {
        alert(`Error  : ${err}`);
      });
  };

  useEffect(() => {
    const endpoint =
      apiEndpoint && apiEndpoint.trim() !== ''
        ? `${apiEndpoint}?pageNumber=${currentPage}&limit=${limit}`
        : `http://localhost:5028/api/UserService/get-all-user?pageNumber=${currentPage}&limit=${limit}`;

    axios
      .get(endpoint, { withCredentials: true })
      .then((res) => {
        const usersArray = Array.isArray(res.data.user)
          ? res.data.user
          : Array.isArray(res.data.users)
            ? res.data.users
            : [];
        setAllUsers(usersArray);
        setCount(res.data.totalCount);
      })
      .catch((err) => {
        console.error('Error fetching user data:', err);
      });
  }, [apiEndpoint, currentPage, limit]);

  useEffect(() => {

    const filteredUsers = searchValue.length !== 0
      ? allUsers.filter(user =>
        user.name.toLowerCase().includes(searchValue.toLowerCase())
      )
      : null;
    if (filteredUsers && filteredUsers.length !== 0) {
      isToRender(filteredUsers);
    }
    else {
      isToRender(allUsers);
    }
  }, [searchValue, allUsers])

  const totalPages = Math.ceil(count / limit);

  if (allUsers.length === 0) {
    return (
      <Stack horizontal horizontalAlign='center'>No User Found</Stack>
    )
  }

  return (
    <Stack
      styles={{
        root: {
          width: '90%',
          margin: '5em auto',
          padding: '20px',
          border: '1px solid #ccc'
        }
      }}
    >
      <Stack
        horizontalAlign="center"
        horizontal
        style={{
          borderBottom: '.1em solid',
          borderColor: 'gray',
          padding: '.5em'
        }}
      >
        <Button style={{ fontSize: '1em', gap: '10px' }}>
          <ArrowEnterLeftFilled
            fontSize={'2em'}
            style={{
              color: 'blue',
              border: '1px solid blue',
              borderRadius: '.2em'
            }}
            onClick={() => navigate('/user_details')}
          />
          Profile
        </Button>
        <Button style={{ fontSize: '1em', gap: '10px' }}>
          <AddRegular fontSize={'20px'} onClick={() => navigate('/register')} />
        </Button>
      </Stack>

      <Stack
        style={{
          height: 'auto',
          marginTop: '1em'
        }}
      >
        <Table>
          <TableHeader>
            <TableRow style={{ borderBottom: '.1em solid', marginTop: '.2em' }}>
              <TableHeaderCell >Sl No.</TableHeaderCell>
              <TableHeaderCell >Name</TableHeaderCell>
              <TableHeaderCell >Username</TableHeaderCell>
              <TableHeaderCell >Email</TableHeaderCell>
              <TableHeaderCell >Phone</TableHeaderCell>
              <TableHeaderCell >DOB</TableHeaderCell>
              <TableHeaderCell >Created At</TableHeaderCell>
              <TableHeaderCell >Qualifications</TableHeaderCell>
              <TableHeaderCell >Action</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {toRender.map((user, index) => (
              <TableRow key={user.id} style={{ borderBottom: '.1em solid', marginTop: '.2em' }}>
                <TableCell >{index + 1}</TableCell>
                <TableCell >{user.name}</TableCell>
                <TableCell >{user.userName}</TableCell>
                <TableCell >{user.email || 'N/A'}</TableCell>
                <TableCell >{user.phoneNumber}</TableCell>
                <TableCell >{user.dob || 'N/A'}</TableCell>
                <TableCell >{user.createdAt || 'N/A'}</TableCell>
                <TableCell >
                  <ul style={{ margin: 0, paddingLeft: 16 }}>
                    {user.qualified.map((q, idx) => (
                      <li key={idx}>
                        {q.degree} from {q.collegeName} ({q.year}) – {q.percentage}%
                      </li>
                    ))}
                  </ul>
                </TableCell>
                <TableCell>
                  <Button onClick={() => handleRemove(user.id)} appearance="primary" style={{ background: "#dc3545", color: "white" }}>
                    <Delete24Regular color="white" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Stack>
      {totalPages >= 0 && (
        <Stack horizontal horizontalAlign="center" style={{ marginTop: 20 }}>
          <Label>Users Per Page : &nbsp;</Label>
          <Dropdown
            placeholder={`${limit}`}
            style={{
              minWidth: 160,
              backgroundColor: "white",
              border: "2px solid #1976d2",
              borderRadius: "6px",
              height: "32px",
              padding: "0 8px",
              fontSize: "0.7em",
              display: "flex",
              alignItems: "center",
            }}
            listbox={{
              style: {
                fontSize: ".95em",
                borderRadius: "8px",
              }
            }}
            onOptionSelect={(_, data) => setLimit(Number(data.optionValue))}
          >
            <Stack style={{ backgroundColor: "white", color: "black", border: "2px solid #1976d2", borderRadius: "1em" }} aria-disabled="true">
              {sortOptions.map((option) => (
                <Option
                  key={option.value}
                  value={option.value.toString()} 
                  style={{ fontSize: ".8em", borderBottom: ".1rem solid" }}
                >
                  {option.label}
                </Option>
              ))}

            </Stack>
          </Dropdown>
          <Stack horizontal tokens={{ childrenGap: "20px" }}>
            <Button
              disabled={currentPage === 0}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Prev
            </Button>
            {[...Array(totalPages)].map((_, idx) => (
              <Button
                key={idx}
                appearance={currentPage === idx ? 'primary' : 'secondary'}
                onClick={() => setCurrentPage(idx)}
              >
                {idx + 1}
              </Button>
            ))}
            <Button
              disabled={currentPage >= totalPages - 1}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </Button>
          </Stack>
        </Stack>
      )}

      {allUsers.length === 0 && (
        <Text align="center" style={{ marginTop: 20 }}>
          No users found.
        </Text>
      )}
    </Stack>
  );
}