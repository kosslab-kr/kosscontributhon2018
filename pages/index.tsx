import * as React from 'react';
import 'isomorphic-unfetch';
import '../assets/styles/globals';

import { RadialBarChart, RadialBar, Legend, Tooltip } from 'recharts';
import { Layout, Button, Menu, Icon, Card, Row, Col, Timeline, Divider, Tag, Badge } from 'antd';
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

type TEvent = {
  projectId: string;
  eventId: string;
  [k: string]: any;
};

interface IProps {
  projects: TProject[];
  events: TEvent[];
}

interface IState {}

async function getEvents() {
  const res = await fetch(`${process.env.BACKEND_URL}/api/events`);
  const json = await res.json();
  return json;
}

async function getProjects() {
  const res = await fetch(`${process.env.BACKEND_URL}/api/projects`);
  const json = await res.json();
  return json;
}

const getEventIcon = function(eventType: string) {
  switch (eventType) {
    case 'PullRequestEvent':
    case 'PullRequestReviewEvent':
    case 'PullRequestReviewCommentEvent':
      return <Icon type="cloud-upload-o" />;
      break;
    case 'PushEvent':
    case 'CommitCommentEvent':
      return <Icon type="upload" />;
      break;
    case 'IssueCommentEvent':
      return <Icon type="message" />;
      break;
    case 'IssuesEvent':
      return <Icon type="exclamation-circle-o" />;
      break;
    case 'CheckRunEvent':
    case 'CheckSuiteEvent':
    case 'CreateEvent':
    case 'DeleteEvent':
    case 'DeploymentEvent':
    case 'DeploymentStatusEvent':
    case 'DownloadEvent':
    case 'FollowEvent':
    case 'ForkEvent':
    case 'ForkApplyEvent':
    case 'GitHubAppAuthorizationEvent':
    case 'GistEvent':
    case 'GollumEvent':
    case 'InstallationEvent':
    case 'InstallationRepositoriesEvent':
    case 'LabelEvent':
    case 'MarketplacePurchaseEvent':
    case 'MemberEvent':
    case 'MembershipEvent':
    case 'MilestoneEvent':
    case 'OrganizationEvent':
    case 'OrgBlockEvent':
    case 'PageBuildEvent':
    case 'ProjectCardEvent':
    case 'ProjectColumnEvent':
    case 'ProjectEvent':
    case 'PublicEvent':
    case 'ReleaseEvent':
    case 'RepositoryEvent':
    case 'RepositoryImportEvent':
    case 'RepositoryVulnerabilityAlertEvent':
    case 'StatusEvent':
    case 'TeamEvent':
    case 'TeamAddEvent':
    case 'WatchEvent':
      return null;
      break;
    default:
      return null;
  }
};
const getEventString = function(event: TEvent) {
  let strs = [];

  strs.push(<Tag color={'red'}>{event.projectId}</Tag>);
  strs.push(event.updatedAt);
  strs.push(<div style={{ height: 3 }} />);

  switch (event.type) {
    case 'IssueCommentEvent':
      strs.push(
        <div>
          <Tag>{event.payload.comment.user.login}</Tag> {event.payload.comment.body.substr(0, 100)}
        </div>,
      );

      break;

    case 'IssuesEvent':
      strs.push(
        <div>
          <Tag>{event.payload.issue.user.login}</Tag>
          {event.payload.issue.body.substr(0, 100)}
        </div>,
      );

      break;

    case 'PullRequestEvent':
      strs.push(
        <div>
          <Tag>{event.payload.pull_request.user.login}</Tag>
          {event.payload.pull_request.body.substr(0, 100)}
        </div>,
      );

      break;

    case 'PushEvent':
      event.payload.commits.forEach((commit, idx) => {
        strs.push(
          <div>
            <Tag>{commit.author.name}</Tag>
            {commit.message.substr(0, 100)}
          </div>,
        );
      });

      break;

    case 'ForkEvent':
      break;

    default:
  }

  return strs;
};

class App extends React.Component<IProps, IState> {
  static async getInitialProps() {
    const data = await Promise.all([getProjects(), getEvents()]);
    return { projects: data[0], events: data[1] };
  }

  render() {
    const { projects, events } = this.props;

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
            <b style={{ fontSize: 16 }}>Recently Events</b>
          </p>
          <div style={{ height: 10 }} />
          <div>
            <Timeline>
              {events.map((event: TEvent, eventIdx: number) => {
                if (
                  event.type !== 'IssueCommentEvent' &&
                  event.type !== 'IssuesEvent' &&
                  event.type !== 'PullRequestEvent'
                ) {
                  console.log(event);
                }

                if (
                  event.type === 'IssueCommentEvent' ||
                  event.type === 'IssuesEvent' ||
                  event.type === 'PullRequestEvent' ||
                  event.type === 'PushEvent'
                ) {
                  return (
                    <Timeline.Item key={eventIdx} dot={getEventIcon(event.type)}>
                      {getEventString(event)}
                    </Timeline.Item>
                  );
                } else {
                  return null;
                }
              })}
            </Timeline>
          </div>
        </StyledLayoutSider>
      </Layout>
    );
  }
}

export default App;
