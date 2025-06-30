import React, { useEffect, useState } from 'react';
import { Stack } from '@fluentui/react';
import {
  Avatar,
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
  ArrowUpRegular,
  ArrowDownRegular,
  Delete24Regular,
  EditRegular,
  NextFrameRegular,
  PreviousFrameRegular
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
};

export default function AllUserDetails({ searchValue }: SearchProps) {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [toRender, isToRender] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(8);
  const [count, setCount] = useState(0);
  const [sl, setSl] = useState(1)
  const navigate = useNavigate();
  const [apiEndpoint, setApiEndpoint] = useState('')
  const [arrowUp, setArrowUp] = useState(true);
  const sortOptions = [
    { value: 1, label: "1", },
    { value: 2, label: "2", },
    { value: 3, label: "3", },
    { value: 5, label: "5", },
    { value: 10, label: "10", },
    { value: 15, label: "15", },
  ];
  const [isloggedIn, setIsLoggedin] = useState(false)
  // Removed invalid if () block
  if (sessionStorage.length === 0) {
    navigate('/login')
  }

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

    setSl((currentPage - 1) * limit + 1)
  }, [apiEndpoint, currentPage, limit]);

  useEffect(() => {
    setIsLoggedin(sessionStorage.getItem('isloggedIn') === "true")
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

  const handleOrder = () => {
    setArrowUp((prev) => !prev);
    setApiEndpoint(
      !arrowUp
        ? 'http://localhost:5028/api/UserService/get-all-user/ascending'
        : 'http://localhost:5028/api/UserService/get-all-user/descending'
    );
  };

  const totalPages = Math.ceil(count / limit);

  if (allUsers.length === 0) {
    return (
      <Stack horizontal horizontalAlign='center'>No User Found</Stack>
    )
  }

  return (

    <>
      {isloggedIn && <Stack
      >
        <Stack
          style={{
            height: 'auto',
            marginTop: '1em',
            width: '100%',
            alignItems: 'center',
          }}
        >
          <div style={{
            width: '98%',
            background: '#fff',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            padding: '1.5em 1em',
            overflowX: 'auto',
          }}>
            <Table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
              <TableHeader>
                <TableRow style={{ borderBottom: '.12em solid #e0e0e0', background: '#f5f7fa' }}>
                  <TableHeaderCell style={{ width: '5%', textAlign: 'center', fontWeight: 600 }}> Sl No.</TableHeaderCell>
                  <TableHeaderCell style={{ width: '15%', textAlign: 'left', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span>Name</span>
                    <span style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 20 }} onClick={handleOrder}>
                      {arrowUp ? <ArrowUpRegular fontSize={16} /> : <ArrowDownRegular fontSize={16} />}
                    </span>
                    {console.log(arrowUp)}
                  </TableHeaderCell>
                  <TableHeaderCell style={{ width: '10%', textAlign: 'left', fontWeight: 600 }}>Username</TableHeaderCell>
                  <TableHeaderCell style={{ width: '15%', textAlign: 'left', fontWeight: 600 }}>Email</TableHeaderCell>
                  <TableHeaderCell style={{ width: '10%', textAlign: 'left', fontWeight: 600 }}>Phone</TableHeaderCell>
                  <TableHeaderCell style={{ width: '10%', textAlign: 'left', fontWeight: 600 }}>DOB</TableHeaderCell>
                  <TableHeaderCell style={{ width: '25%', textAlign: 'left', fontWeight: 600 }}>Qualifications</TableHeaderCell>
                  <TableHeaderCell style={{ width: '10%', textAlign: 'right', fontWeight: 600, display: "flex", justifyContent: "center", alignItems: "center", alignContent: "center" }}> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Action</TableHeaderCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {toRender.map((user, index) => (
                  <TableRow key={user.id} style={{ borderBottom: '.08em solid #e0e0e0', background: index % 2 === 0 ? '#fafbfc' : '#fff' }}>
                    <TableCell style={{ textAlign: 'center', fontWeight: 500 }}>{sl + index}</TableCell>
                    <TableCell style={{ display: 'flex', alignItems: 'center', gap: '0.7em' }}>
                      <Avatar
                        name={user.name}
                        shape='circular'
                        style={{ border: "2px solid #1976d2", borderRadius: "50%", marginRight: 0, width: 32, height: 32 }}
                      ></Avatar>
                      <span style={{ fontWeight: 500 }}>{user.name}</span>
                    </TableCell>
                    <TableCell style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{user.userName}</TableCell>
                    <TableCell style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{user.email}</TableCell>
                    <TableCell style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{user.phoneNumber}</TableCell>
                    <TableCell style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{user.dob}</TableCell>
                    <TableCell>
                      <ul style={{ margin: 0, paddingLeft: 16 }}>
                        {user.qualified[0] && (
                          <li style={{ fontSize: '.98em', lineHeight: 1.5 }}>
                            {user.qualified[0].degree} from {user.qualified[0].collegeName} ({user.qualified[0].year}) – {user.qualified[0].percentage}%
                          </li>
                        )}
                      </ul>
                    </TableCell>
                    <TableCell style={{ textAlign: 'center' }}>
                      <Stack horizontal horizontalAlign='center' tokens={{ childrenGap: 0 }}>
                        <Button appearance="primary" style={{ marginRight: 4 }}>
                          <EditRegular color="#1976d2" />
                        </Button>
                        <Button onClick={() => handleRemove(user.id)} appearance="primary" style={{ marginLeft: 4 }}>
                          <Delete24Regular color="red" />
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Stack>
        {totalPages >= 0 && (
          <Stack horizontal horizontalAlign="space-between" style={{ marginTop: 20 }}>
            <Stack horizontal horizontalAlign='center' style={{ marginLeft: "1em" }}>
              <Label>Page : &nbsp;</Label>
              <Dropdown
                placeholder={`${limit}`}
                style={{
                  minWidth: 50,
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
                size='small'

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
            </Stack>
            <Stack horizontal horizontalAlign='space-between'  >
              <Button
                disabled={currentPage === 1}

              >
                <PreviousFrameRegular onClick={() => setCurrentPage(currentPage - 1)} fontSize={24} />
              </Button>
              <Stack horizontal horizontalAlign='center'>
                {(() => {
                  let start = Math.max(0, Math.min(currentPage - 3, totalPages - 5));
                  let end = Math.min(totalPages, start + 5);
                  return (
                    <>
                      {Array.from({ length: end - start }, (_, idx) => {
                        const pageNum = start + idx + 1;
                        return (
                          <Button
                            key={pageNum}
                            appearance={currentPage === pageNum ? 'primary' : 'secondary'}
                            onClick={() => setCurrentPage(pageNum)}
                            style={{ minWidth: "18px", marginRight: ".1em" }}
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

              >
                <NextFrameRegular onClick={() => {
                  setCurrentPage(currentPage + 1)
                }} fontSize={20} />
              </Button>
            </Stack>
          </Stack>
        )}

        {allUsers.length === 0 && (
          <Text align="center" style={{ marginTop: 20 }}>
            No users found.
          </Text>
        )}
        <Stack
          horizontalAlign="end"
          horizontal
          style={{marginRight : 20}}
        >
          <Button style={{
            fontSize: '.9em', gap: '8px', border: '.1em solid',
            borderColor: 'gray',
            padding: '.5em',
            borderRadius: "1em"
          }}>
            <AddRegular fontSize={'20px'} onClick={() => navigate('/register')} /> Add User
          </Button>
        </Stack>
      </Stack>
      }
    </>
  );
}