import { Layout, Menu, Breadcrumb, theme } from "antd";

import TractianLogo from "../../assets/tractian-logo.svg";

import { Content, Footer, Header } from "antd/es/layout/layout";
import { Outlet, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { chart1 } from "./optionsChart";

const menuOptions = [
  { name: "Gráficos", route: "/" },
  { name: "Ativos", route: "/ativos" },
  { name: "Usuários", route: "/usuarios" },
  { name: "Unidades", route: "/unidades" },
  { name: "Empresas", route: "/empresas" },
  { name: "Ordens de serviço", route: "/ordens" },
];

const Home = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const location = useLocation();

  const navigate = useNavigate();
  return (
    <>
      <Layout>
        <Header
          style={{ position: "sticky", top: 0, zIndex: 1, width: "100%" }}
        >
          <div
            style={{
              float: "left",
              width: 120,
              height: 31,
              margin: "16px 24px 16px 0",
              background: `url(${TractianLogo}) no-repeat center center`,
            }}
          />
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={[
              `${
                menuOptions.findIndex(
                  (option) => option.route === location.pathname
                ) + 1
              }`,
            ]}
            items={menuOptions.map((option, index) => ({
              key: String(index + 1),
              label: `${option.name}`,
              onClick: () => navigate(`${option.route}`),
            }))}
          />
        </Header>
        <Content className="site-layout" style={{ padding: "0 50px" }}>
          <Breadcrumb
            style={{ margin: "16px 0px" }}
            items={[
              {
                title: `${
                  menuOptions[
                    menuOptions.findIndex(
                      (option) => option.route === location.pathname
                    )
                  ].name
                }`,
              },
            ]}
          />
          <div
            style={{
              padding: 24,
              minHeight: 380,
              background: colorBgContainer,
            }}
          >
            {location.pathname === "/" ? (
              <HighchartsReact highcharts={Highcharts} options={chart1} />
            ) : (
              <Outlet />
            )}
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Tractian test Software Engineer ©2023 Created by Gabriel Lamas
        </Footer>
      </Layout>
    </>
  );
};
export default Home;
