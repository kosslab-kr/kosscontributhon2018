import * as React from 'react';
import { Layout, Button, Menu, Icon, Card, Row, Col, Timeline, Divider, Tag, Badge } from 'antd';
import styled from 'styled-components';
import { RadialBarChart, RadialBar, Legend, Tooltip } from 'recharts';

import '../assets/styles/globals';
import contributonProjectJson from '../contributon-project.json';

type TMentor = { name: string; profileUrl: string };

type TProject = {
  projectId: string;
  projectName: string;
  description: string;
  mentor: TMentor[];
  Repository: string[];
};

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
  min-height: 240px;
  padding: 10px;
  box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);
  border-radius: 5px;
  background-color: #ffffff;
  position: relative;
  overflow: hidden;
  .ranking {
    position: absolute;
    right: 10px;
    top: 20px;
  }
  .ant-divider-horizontal {
    margin: 5px 0 0 0;
  }
`;

const PointContainer = styled.div`
  display: flex;
  flex-direction: row;

  .point-board {
    padding-top: 45px;
    margin-left: -30px;
  }

  .point-commit,
  .point-issue {
    font-size: 15px;
  }
  .point-commit {
    color: #f05050;
  }
  .point-issue {
    color: #71b6f9;
  }
`;

const ProjectInfo = styled.div`
  padding: 15px 10px;
  word-break: keep-all;

  h3 {
    font-family: 'Karla', sans-serif;
    font-weight: bold;
    color: #333;
    font-size: 16px;
    max-height: 19px;
    text-overflow: ellipsis;
    overflow: hidden;
    line-height: 1.2;
    margin-bottom: 5px;
  }
  p {
    font-size: 13px;
    margin-top: 0;
    max-height: 38px;
    overflow: hidden;
  }

  .links {
    position: absolute;
    bottom: 15px;
    left: 20px;
    a {
      color: #9d9d9d;
    }
  }
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
              {(contributonProjectJson.project as TProject[]).map((n, nidx) => {
                return (
                  <PaddedCol key={nidx} xs={24} lg={12} xl={6} xxl={6}>
                    <Project>
                      {nidx < 4 ? (
                        <Tag color={'volcano'} className={'ranking'}>
                          <Icon type="heart" /> Hot
                        </Tag>
                      ) : null}

                      <PointContainer>
                        <div className={'point-chart'}>
                          <RadialBarChart
                            id={nidx + 'chart'}
                            width={100}
                            height={100}
                            innerRadius="20%"
                            outerRadius="100%"
                            data={[
                              { name: 'other', value: 100, fill: '#dddddd' },
                              { name: 'issue', value: 20, fill: '#71b6f9' },
                              { name: 'commit', value: 71, fill: '#f05050' },
                            ]}
                            startAngle={240}
                            endAngle={50}
                          >
                            <RadialBar minAngle={15} background dataKey="value" />
                          </RadialBarChart>
                        </div>
                        <div className={'point-board'}>
                          <div className={'point-commit'}>
                            <Icon type="upload" />
                            &nbsp;
                            <b>71</b>
                            &nbsp; Commit
                          </div>
                          <div className={'point-issue'}>
                            <Icon type="exclamation-circle-o" />
                            &nbsp;
                            <b>20</b>
                            &nbsp; Issue
                          </div>
                        </div>
                      </PointContainer>
                      <Divider />
                      <ProjectInfo>
                        <h3>{n.projectName}</h3>
                        <p>{n.description}</p>
                        <div className={'links'}>
                          {n.Repository.length > 0 ? (
                            <Tag
                              onClick={() => {
                                window.open(n.Repository[0]);
                              }}
                            >
                              <Icon type="github" />
                            </Tag>
                          ) : null}
                          {n.mentor.map((m, midx) => {
                            return m.name.length > 0 ? (
                              <Tag
                                key={midx}
                                onClick={() => {
                                  window.open(m.profileUrl);
                                }}
                              >
                                {m.name}
                              </Tag>
                            ) : null;
                          })}
                        </div>
                      </ProjectInfo>
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
            <b style={{ fontSize: 16 }}>Recently Events</b> (2018-08-01 ~ 2018-08-19)
          </p>
          <div style={{ height: 10 }} />
          <div>
            <Timeline>
              <Timeline.Item dot={<Icon type="upload" />}>Create a services site 2015-09-01</Timeline.Item>
              <Timeline.Item dot={<Icon type="message" />}>Solve initial network problems 2015-09-01</Timeline.Item>
              <Timeline.Item dot={<Icon type="exclamation-circle-o" />} color={'red'}>
                Technical testing 2015-09-01
              </Timeline.Item>
              <Timeline.Item dot={<Icon type="upload" />}>Network problems being solved 2015-09-01</Timeline.Item>
              <Timeline.Item dot={<Icon type="upload" />}>Create a services site 2015-09-01</Timeline.Item>
              <Timeline.Item dot={<Icon type="message" />}>Solve initial network problems 2015-09-01</Timeline.Item>
              <Timeline.Item dot={<Icon type="exclamation-circle-o" />} color={'red'}>
                Technical testing 2015-09-01
              </Timeline.Item>
              <Timeline.Item dot={<Icon type="upload" />}>Network problems being solved 2015-09-01</Timeline.Item>
              <Timeline.Item dot={<Icon type="star" />}>Create a services site 2015-09-01</Timeline.Item>
              <Timeline.Item dot={<Icon type="message" />}>Solve initial network problems 2015-09-01</Timeline.Item>
              <Timeline.Item dot={<Icon type="exclamation-circle-o" />} color={'red'}>
                Technical testing 2015-09-01
              </Timeline.Item>
              <Timeline.Item dot={<Icon type="upload" />}>Network problems being solved 2015-09-01</Timeline.Item>
              <Timeline.Item dot={<Icon type="upload" />}>Create a services site 2015-09-01</Timeline.Item>
              <Timeline.Item dot={<Icon type="message" />}>Solve initial network problems 2015-09-01</Timeline.Item>
              <Timeline.Item dot={<Icon type="exclamation-circle-o" />} color={'red'}>
                Technical testing 2015-09-01
              </Timeline.Item>
              <Timeline.Item dot={<Icon type="upload" />}>Network problems being solved 2015-09-01</Timeline.Item>
              <Timeline.Item dot={<Icon type="upload" />}>Create a services site 2015-09-01</Timeline.Item>
              <Timeline.Item dot={<Icon type="message" />}>Solve initial network problems 2015-09-01</Timeline.Item>
              <Timeline.Item dot={<Icon type="exclamation-circle-o" />} color={'red'}>
                Technical testing 2015-09-01
              </Timeline.Item>
              <Timeline.Item dot={<Icon type="upload" />}>Network problems being solved 2015-09-01</Timeline.Item>
              <Timeline.Item dot={<Icon type="upload" />}>Create a services site 2015-09-01</Timeline.Item>
              <Timeline.Item dot={<Icon type="message" />}>Solve initial network problems 2015-09-01</Timeline.Item>
              <Timeline.Item dot={<Icon type="exclamation-circle-o" />} color={'red'}>
                Technical testing 2015-09-01
              </Timeline.Item>
              <Timeline.Item dot={<Icon type="upload" />}>Network problems being solved 2015-09-01</Timeline.Item>
            </Timeline>
          </div>
        </StyledLayoutSider>
      </Layout>
    );
  }
}

export default App;
