import * as React from 'react';
import styled from 'styled-components';
import { Project, PointContainer, ProjectInfo } from '../styledComponent';
import { Tag, Icon, Divider } from 'antd';
import { RadialBarChart, RadialBar, Legend, Tooltip } from 'recharts';

interface IProps {
  project?: any;
  pidx?: number;
}

class ProjectCard extends React.Component<IProps> {
  render() {
    const { project: n, pidx: nidx } = this.props;

    return (
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
                  window.open(n.Repository);
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
    );
  }
}

export default ProjectCard;
