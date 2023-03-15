import axios from "axios";

export const fetchCompanyById = async (id: number) => {
  try {
    const { data } = await axios.get(
      `https://my-json-server.typicode.com/tractian/fake-api/companies/${id}`
    );

    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.message;
    } else {
      throw error;
    }
  }
};
