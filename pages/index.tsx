import * as React from 'react';
import { Layout, Button, Menu, Icon, Card, Row, Col, Timeline, Divider } from 'antd';
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
  overflow: auto;
  height: 100vh;
  h2 {
    color: #3576bb;
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

                      <div>
                        <Icon type="upload" /> 10 &nbsp;
                        <Icon type="exclamation-circle-o" /> 10
                      </div>
                    </Project>
                  </PaddedCol>
                );
              })}
            </Row>
          </StyledLayoutContent>
        </Layout>
        <StyledLayoutSider width={400}>
          <h2>2018 OSS Contributon</h2>
          <Divider />
          <p>
            <b>Recently Events</b>
          </p>
          <div>
            <Timeline>
              <Timeline.Item dot={<Icon type="upload" />}>Create a services site 2015-09-01</Timeline.Item>
              <Timeline.Item dot={<Icon type="message" />}>Solve initial network problems 2015-09-01</Timeline.Item>
              <Timeline.Item dot={<Icon type="exclamation-circle-o" />}>Technical testing 2015-09-01</Timeline.Item>
              <Timeline.Item dot={<Icon type="upload" />}>Network problems being solved 2015-09-01</Timeline.Item>
              <Timeline.Item dot={<Icon type="upload" />}>Create a services site 2015-09-01</Timeline.Item>
              <Timeline.Item dot={<Icon type="message" />}>Solve initial network problems 2015-09-01</Timeline.Item>
              <Timeline.Item dot={<Icon type="exclamation-circle-o" />}>Technical testing 2015-09-01</Timeline.Item>
              <Timeline.Item dot={<Icon type="upload" />}>Network problems being solved 2015-09-01</Timeline.Item>
              <Timeline.Item dot={<Icon type="star" />}>Create a services site 2015-09-01</Timeline.Item>
              <Timeline.Item dot={<Icon type="message" />}>Solve initial network problems 2015-09-01</Timeline.Item>
              <Timeline.Item dot={<Icon type="exclamation-circle-o" />}>Technical testing 2015-09-01</Timeline.Item>
              <Timeline.Item dot={<Icon type="upload" />}>Network problems being solved 2015-09-01</Timeline.Item>
              <Timeline.Item dot={<Icon type="upload" />}>Create a services site 2015-09-01</Timeline.Item>
              <Timeline.Item dot={<Icon type="message" />}>Solve initial network problems 2015-09-01</Timeline.Item>
              <Timeline.Item dot={<Icon type="exclamation-circle-o" />}>Technical testing 2015-09-01</Timeline.Item>
              <Timeline.Item dot={<Icon type="upload" />}>Network problems being solved 2015-09-01</Timeline.Item>
              <Timeline.Item dot={<Icon type="upload" />}>Create a services site 2015-09-01</Timeline.Item>
              <Timeline.Item dot={<Icon type="message" />}>Solve initial network problems 2015-09-01</Timeline.Item>
              <Timeline.Item dot={<Icon type="exclamation-circle-o" />}>Technical testing 2015-09-01</Timeline.Item>
              <Timeline.Item dot={<Icon type="upload" />}>Network problems being solved 2015-09-01</Timeline.Item>
              <Timeline.Item dot={<Icon type="upload" />}>Create a services site 2015-09-01</Timeline.Item>
              <Timeline.Item dot={<Icon type="message" />}>Solve initial network problems 2015-09-01</Timeline.Item>
              <Timeline.Item dot={<Icon type="exclamation-circle-o" />}>Technical testing 2015-09-01</Timeline.Item>
              <Timeline.Item dot={<Icon type="upload" />}>Network problems being solved 2015-09-01</Timeline.Item>
            </Timeline>
          </div>
        </StyledLayoutSider>
      </Layout>
    );
  }
}

export default App;
