import * as React from 'react';
import { Layout, Button, Menu, Icon, Card, Row, Col, Timeline, Divider, Tag, Badge } from 'antd';
import { RadialBarChart, RadialBar, Legend, Tooltip } from 'recharts';

import '../assets/styles/globals';
import { StyledLayoutContent, PaddedCol, StyledLayoutSider } from '../styledComponent';
import { ProjectCard } from '../component';
import contributonProjectJson from '../contributon-project.json';

type TMentor = { name: string; profileUrl: string };

type TProject = {
  projectId: string;
  projectName: string;
  description: string;
  mentor: TMentor[];
  Repository: string[];
};

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
                    <ProjectCard project={n} pidx={nidx} />
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
