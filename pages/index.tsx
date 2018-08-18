import * as React from 'react';
import { Layout, Button, Menu, Icon, Card, Row, Col } from 'antd';
import styled from 'styled-components';

import '../assets/styles/globals';
const contributonProjectJson = require('../contributon-project.json');

const StyledLayout = styled(Layout)`
  background: #ebeff2;
`;

const StyledLayoutContent = styled(Layout.Content)`
  border-top: 3px solid #71b6f9;
  height: 100vh;
  padding: 2vh;
`;

const PaddedCol = styled(Col as any)`
  padding: 1vh;
`;

const Project = styled.div`
  height: 22vh;
  padding: 20px;
  box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);
  border-radius: 5px;
  background-color: #ffffff;
`;

const StyledLayoutSider = styled(Layout.Sider)`
  border-top: 3px solid #71b6f9;
  background: #fff;
  box-shadow: 0 0 24px 0 rgba(0, 0, 0, 0.06), 0 1px 0 0 rgba(0, 0, 0, 0.02);
  padding: 20px;
  h2 {
    color: #3e8adb;
    text-align: center;
    font-size: 24px;
  }
`;

interface IProps {}

class App extends React.Component<IProps> {
  render() {
    return (
      <Layout>
        <Layout style={{ background: '#ebeff2' }}>
          <StyledLayoutContent>
            <Row>
              {contributonProjectJson.project.map((n, nidx) => {
                return (
                  <PaddedCol key={nidx} xs={24} lg={12} xl={6} xxl={6}>
                    <Project>
                      <h3>{n.projectName}</h3>
                      <p>{n.Repository}</p>
                    </Project>
                  </PaddedCol>
                );
              })}
            </Row>
          </StyledLayoutContent>
        </Layout>
        <StyledLayoutSider width={400}>
          <h2>2018 공개 SW 컨트리뷰톤</h2>
        </StyledLayoutSider>
      </Layout>
    );
  }
}

export default App;
