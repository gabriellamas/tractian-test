import { Space, Table, Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import axios from "axios";
import { useCallback, useContext, useEffect, useState } from "react";
import { LoadingSVG } from "../../components/LoadingSVG";
import { loadingContext } from "../../context/LoadingContext";

interface User {
  companyId: number;
  email: string;
  id: number;
  name: string;
  unitId: number;
}

const UsersPage = () => {
  const { loading, setLoading } = useContext(loadingContext);
  const [users, setUsers] = useState<User[]>([]);

  interface DataType {
    key: string;
    name: string;
    email: string;
    companyId: number;
  }

  const columns: ColumnsType<DataType> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Company ID",
      dataIndex: "companyId",
      key: "companyId",
    },
  ];

  const dataTable: DataType[] = users.map((user) => ({
    key: `${user.id}`,
    name: user.name,
    email: user.email,
    companyId: user.companyId,
  }));

  const fetchInfos = useCallback(async () => {
    try {
      const { data } = await axios.get(
        "https://my-json-server.typicode.com/tractian/fake-api/users"
      );
      setUsers(data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.message);
      } else {
        throw new Error(`${error}`);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInfos();
  }, []);

  if (loading) return <LoadingSVG />;
  return (
    <>
      <h1>Usuarios Page</h1>
      <Table dataSource={dataTable} columns={columns} />
    </>
  );
};
export default UsersPage;
