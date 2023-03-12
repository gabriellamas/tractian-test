import { LoadingSVG } from "../../components/LoadingSVG";
import { AssetImage } from "../../components/AssetImage";
import { Col, Empty, Button, Modal, Timeline, Typography } from "antd";
import { useCallback, useContext, useEffect, useState } from "react";

import axios from "axios";

import styles from "./style.module.css";
import {
  fetchAssignedUserIds,
  Responsibles,
} from "../../utils/fetchAssignedUserIds";
import { dateFormat } from "../../utils/dateFormat";
import { loadingContext } from "../../context/LoadingContext";

interface HealthStatusTimeStamp {
  status: string;
  timestamp: string;
}

interface Status {
  [key: string]: string;
}

interface itemsHistory {
  children: JSX.Element;
}

interface Assets {
  assignedUserIds: number[];
  companyId: number;
  healthHistory: HealthStatusTimeStamp[];
  healthscore: number;
  id: number;
  image: string;
  metrics: {
    lastUptimeAt: string;
    totalCollectsUptime: number;
    totalUptime: number;
  };
  model: string;
  name: string;
  sensors: string[];
  specifications: {
    maxTemp: number;
    power: number;
    rpm: number | null;
  };
  status: string;
  unitId: number;
}

const Status: Status = {
  inAlert: "Em Alerta",
  inOperation: "Em Operação",
  inDowntime: "Em Parada",
  unplannedStop: "Parada inesperada",
};

export const AssetsPage = () => {
  const { loading, setLoading } = useContext(loadingContext);

  const { Text } = Typography;
  const [assets, setAssets] = useState<Assets[]>([]);

  const [isModalOpenHistory, setIsModalOpenHistory] = useState(false);
  const [historySelected, setHistorySelected] = useState<itemsHistory[]>([]);

  const [isModalOpenResponsible, setIsModalOpenResponsible] = useState(false);
  const [responsiblesSelected, setResponsiblesSelected] = useState<
    Responsibles[]
  >([]);

  const handleShowModalHistory = (index: number) => {
    const itemsHistory = assets[index].healthHistory.map((health) => ({
      children: (
        <>
          <Text>{Status[health.status]}</Text>
          <Text>{dateFormat(health.timestamp)}</Text>
        </>
      ),
    }));

    setHistorySelected(itemsHistory);
    setIsModalOpenHistory(true);
  };

  const handleShowModalResposibles = async (index: number) => {
    setLoading(true);
    const responsibles = await fetchAssignedUserIds(
      assets[index].assignedUserIds
    );
    setResponsiblesSelected(responsibles);
    setIsModalOpenResponsible(true);
    setLoading(false);
  };

  const handleOkorCancel = (name: string) => {
    if (name === "history") {
      setIsModalOpenHistory(false);
    }
    if (name === "responsible") {
      setIsModalOpenResponsible(false);
    }
  };

  const fetchInfos = useCallback(async () => {
    try {
      const { data } = await axios.get(
        "https://my-json-server.typicode.com/tractian/fake-api/assets"
      );
      setAssets(data);
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

  return (
    <>
      {loading && <LoadingSVG />}
      <Col>
        <h1>Ativos</h1>
      </Col>
      {assets ? (
        assets.map((asset, index) => (
          <Col
            style={{ padding: "16px 24px" }}
            key={asset.id}
            className={styles.ColAssetInfo}
            span={24}
          >
            <div style={{ display: "flex", flexWrap: "wrap" }}>
              <AssetImage image={asset.image} />

              <div className={styles.BodyInfoAsset}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <strong>Status</strong>
                  <Text>{Status[asset.status]}</Text>
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <strong>Performance:</strong>
                  <Text>{asset.healthscore}%</Text>
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <strong>Métricas</strong>
                  <Text>
                    Data da Ultima Coleta:{" "}
                    {dateFormat(asset.metrics.lastUptimeAt)}
                  </Text>
                  <Text>
                    Total de Coletas: {asset.metrics.totalCollectsUptime}
                  </Text>
                  <Text>
                    Total de Horas de Coletas:{" "}
                    {asset.metrics.totalUptime.toFixed(0)}
                  </Text>
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <strong>Especificações</strong>
                  <Text>
                    Temperatura máxima: {asset.specifications.maxTemp} ºC
                  </Text>
                  <Text>Power: {asset.specifications.power} kWh</Text>
                  <Text>
                    RPM:{" "}
                    {asset.specifications.rpm
                      ? asset.specifications.rpm
                      : "Sem informação"}
                  </Text>
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <strong>Informações</strong>
                  <Text>Modelo: {asset.model}</Text>
                  <Text>Name: {asset.name}</Text>
                  <Text>Sensores: {asset.sensors.map((sensor) => sensor)}</Text>
                </div>
              </div>
            </div>
            <footer
              style={{
                display: "flex",
                gap: "24px",
                justifyContent: "flex-end",
                flexWrap: "wrap",
              }}
            >
              <Button
                type="default"
                onClick={() => handleShowModalHistory(index)}
              >
                Histórico funcionamento
              </Button>

              <Button
                type="default"
                onClick={() => handleShowModalResposibles(index)}
              >
                Visualizar responsáveis
              </Button>
            </footer>
          </Col>
        ))
      ) : (
        <Empty />
      )}

      <Modal
        title="Historico de funcionamento"
        open={isModalOpenHistory}
        onOk={() => handleOkorCancel("history")}
        onCancel={() => handleOkorCancel("history")}
      >
        <div style={{ marginTop: "32px" }}>
          <Timeline items={historySelected} />
        </div>
      </Modal>

      <Modal
        title="Responsáveis"
        open={isModalOpenResponsible}
        onOk={() => handleOkorCancel("responsible")}
        onCancel={() => handleOkorCancel("responsible")}
      >
        <div style={{ marginTop: "32px" }}>
          {responsiblesSelected.map((responsible) => (
            <div key={responsible.name} style={{ marginBottom: "32px" }}>
              <Text>{responsible.name}</Text> <Text>{responsible.email}</Text>
            </div>
          ))}
        </div>
      </Modal>
    </>
  );
};
