import axios from "axios";

type AssignedUserIds = number[];

export interface Responsibles {
  name: string;
  email: string;
}

export const fetchAssignedUserIds = (users: AssignedUserIds) => {
  try {
    const response = axios
      .all(
        users.map((user) =>
          axios.get(
            `https://my-json-server.typicode.com/tractian/fake-api/users/${user}`
          )
        )
      )
      .then((data) =>
        data.map((response) => ({
          name: response.data.name,
          email: response.data.email,
        }))
      );

    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.message);
    } else {
      throw new Error(`${error}`);
    }
  }
};
