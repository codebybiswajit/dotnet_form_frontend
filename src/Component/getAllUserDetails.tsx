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
import axios from 'axios';
import {
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
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(8);
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
  const [isloggedIn, setIsLoggedin] = useState(false)



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
  debugger;
  useEffect(() => {
    const endpoint =
      apiEndpoint && apiEndpoint.trim() !== ''
        ? `${apiEndpoint}?startPage=${currentPage}&limit=${limit}`
        : `http://localhost:5028/api/UserService/get-all-user?startPage=${currentPage}&limit=${limit}`;
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
    setIsLoggedin(localStorage.getItem('isloggedIn') === "true")
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

    <>
      {isloggedIn && <Stack
        styles={{
          root: {
            width: '80%',
            margin: '5em auto',
            padding: '20px',
            border: '1px solid #ccc'
          }
        }}
      >
        <Stack
          horizontalAlign="end"
          horizontal
        >
          <Button style={{
            fontSize: '1em', gap: '10px', border: '.1em solid',
            borderColor: 'gray',
            padding: '.5em',
            borderRadius: "1em"
          }}>
            Add User<AddRegular fontSize={'20px'} onClick={() => navigate('/register')} />
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
              <TableRow style={{ borderBottom: '.1em solid', marginTop: '.2em' , width : "100%"}}>
                <TableHeaderCell  style={{ width: '5%'}}>Sl No.</TableHeaderCell>
                <TableHeaderCell  style={{ width: '12%'}}>Name</TableHeaderCell>
                <TableHeaderCell  style={{ width: '8%'}} >Username</TableHeaderCell>
                <TableHeaderCell  style={{ width: '15%'}} >Email</TableHeaderCell>
                <TableHeaderCell  style={{ width: '8%'}}>Phone</TableHeaderCell>
                <TableHeaderCell  style={{ width: '8%'}}>DOB</TableHeaderCell>
                <TableHeaderCell  style={{ width: '9%'}}>Created At</TableHeaderCell>
                <TableHeaderCell  style={{ width: '20%'}}>Qualifications</TableHeaderCell>
                <TableHeaderCell  style={{ width: '15%'}}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Action</TableHeaderCell>
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
                    <Button onClick={() => handleRemove(user.id)} appearance="primary" >
                      <Delete24Regular color="red" />
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
            <Stack horizontal horizontalAlign='center' tokens={{ childrenGap: 10 }} >
              <Button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                style={{ marginLeft: "5em" }}
              >
                Prev
              </Button>
              <Stack horizontal horizontalAlign='center'>
                {(() => {
                  let start = Math.max(0, Math.min(currentPage - 2, totalPages - 3));
                  let end = Math.min(totalPages, start + 3);
                  return (
                    <>
                      {Array.from({ length: end - start }, (_, idx) => {
                        const pageNum = start + idx + 1;
                        return (
                          <Button
                            key={pageNum}
                            appearance={currentPage === pageNum ? 'primary' : 'secondary'}
                            onClick={() => setCurrentPage(pageNum)}
                            style={{ minWidth: "20px", marginRight: "1em" }}
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                    </>
                  );
                })()}
              </Stack>
              <Button
                disabled={currentPage >= totalPages}
                onClick={() => {
                  setCurrentPage(currentPage + 1)
                }}
                style={{ marginLeft: "1em" }}
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
      </Stack>}
    </>
  );
}