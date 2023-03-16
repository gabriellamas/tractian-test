import axios from "axios";
import { Button, Col, Modal, Table, Tag, Typography } from "antd";
import { ColumnsType } from "antd/es/table";
import { useCallback, useContext, useEffect, useState } from "react";
import { loadingContext } from "../../context/LoadingContext";
import {
  fetchAssignedUserById,
  Responsibles,
} from "../../utils/fetchAssignedUserById";

interface Order {
  assetId: number;
  assignedUserIds: [number, number, number];
  checklist: [
    {
      completed: true;
      task: string;
    },
    {
      completed: string;
      task: string;
    },
    {
      completed: boolean;
      task: string;
    }
  ];
  description: string;
  id: number;
  priority: "high" | "Low";
  status: "completed" | "in progress";
  title: string;
}

interface DataType {
  priority: string;
  title: string;
  description: string;
  status: string;
  responsible: () => void;
}

interface OrdersDescription {
  [key: string]: string;
}

const OrdersDescription: OrdersDescription = {
  "The Fan is not working properly and needs to be repaired.":
    "O ventilador não está funcionando corretamente e precisa ser consertado.",
  "The motor is running hot and we must inspect.":
    "O motor está esquentando e devemos inspecionar.",
};

const OrdersPage = () => {
  const { Text } = Typography;
  const [orders, setOrders] = useState<Order[]>([]);
  const { messageApi } = useContext(loadingContext);
  const [isModalOpenResponsible, setIsModalOpenResponsible] = useState(false);
  const [responsiblesSelected, setResponsiblesSelected] = useState<
    Responsibles[]
  >([]);

  const handleShowModalResposibles = async (index: number) => {
    messageApi.open({
      type: "loading",
      content: "Trazendo dados...",
      duration: 0,
    });
    const responsibles = await fetchAssignedUserById(
      orders[index].assignedUserIds
    );
    setResponsiblesSelected(responsibles);
    setIsModalOpenResponsible(true);
    messageApi.destroy();
  };

  const handleOkorCancel = () => {
    setIsModalOpenResponsible(false);
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "Prioridade",
      dataIndex: "priority",
      render: (_, { priority }) => (
        <Tag color={priority === "high" ? "red" : "gold"} key={priority}>
          {priority === "high" ? "ALTA" : "NORMAL"}
        </Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (_, { status }) => (
        <Tag color={status === "completed" ? "green" : "gold"}>
          {status === "completed" ? "COMPLETO" : "EM PROGRESSO"}
        </Tag>
      ),
    },
    {
      title: "Título",
      dataIndex: "title",
    },
    {
      title: "Descrição",
      dataIndex: "description",
    },
    {
      title: "Responsável",
      dataIndex: "responsible",
      render: (_, { responsible }) => (
        <Button onClick={responsible}>Visualizar responsáveis</Button>
      ),
    },
  ];

  const dataTable: DataType[] = orders
    .map((order, index) => ({
      priority: order.priority,
      title: order.title
        .replace("Repair Fan", "Reparar Ventilador")
        .replace("Repair Motor", "Reparar Motor"),
      description: OrdersDescription[order.description],
      status: order.status,
      responsible: () => handleShowModalResposibles(index),
    }))
    .sort((order) =>
      order.priority === "high" && order.status === "in progress" ? -1 : 0
    );

  const fetchInfos = useCallback(async () => {
    try {
      messageApi.open({
        type: "loading",
        content: "Trazendo dados...",
        duration: 0,
      });
      const { data } = await axios.get(
        "https://my-json-server.typicode.com/tractian/fake-api/workorders"
      );
      setOrders(data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        await messageApi.open({
          type: "error",
          content: `Error: ${error.message}. Tente novamente mais tarde..`,
        });
      } else {
        await messageApi.open({
          type: "error",
          content: `Error: ${error}. Tente novamente mais tarde..`,
        });
      }
    } finally {
      messageApi.destroy();
    }
  }, []);

  useEffect(() => {
    fetchInfos();
  }, []);

  return (
    <>
      <Col style={{ marginBottom: "24px" }}>
        <h1>Ordens de Serviço</h1>
      </Col>
      <Table
        dataSource={dataTable}
        columns={columns}
        style={{ border: "1px solid rgba(0,0,0,0.1)", borderRadius: "8px" }}
      />
      <Modal
        title="Responsáveis"
        open={isModalOpenResponsible}
        onOk={() => handleOkorCancel()}
        onCancel={() => handleOkorCancel()}
      >
        <div style={{ marginTop: "32px" }}>
          {responsiblesSelected.map((responsible) => (
            <div key={responsible.name} style={{ marginBottom: "16px" }}>
              <Text>{responsible.name}</Text> <br />
              <Text>{responsible.email}</Text>
            </div>
          ))}
        </div>
      </Modal>
    </>
  );
};
export default OrdersPage;
