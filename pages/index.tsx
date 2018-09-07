import * as React from 'react';
import * as moment from 'moment';
import Router from 'next/router';
import 'isomorphic-unfetch';
import '../assets/styles/globals';

import { RadialBarChart, RadialBar, Legend, Tooltip } from 'recharts';
import { Layout, Button, Menu, Icon, Card, Row, Col, Timeline, Divider, Tag, Badge, Avatar, message } from 'antd';
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
  CommitCount?: number;
  IssuesEvent?: number;
  activeCnt?: number;
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
  const res = await fetch(
    `${process.env.BACKEND_URL}/api/events?type=IssueCommentEvent,IssuesEvent,PullRequestEvent,PushEvent`,
  );
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
      return <Icon type="book" />;
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
  const EventHeader = () => (
    <div>
      <b className={'projectName'}>{event.repo.name}</b> {moment(event.updatedAt).fromNow()}
    </div>
  );

  switch (event.type) {
    case 'IssueCommentEvent':
      return (
        <>
          <EventHeader />
          <div className={'eventBody'}>
            <Tag
              color={'#ccc'}
              onClick={() => {
                window.open(event.payload.comment.user.html_url);
              }}
            >
              {event.payload.comment.user.login}
            </Tag>{' '}
            {event.payload.comment.body.substr(0, 100)}
            ...
            <a
              className="git-link"
              onClick={() => {
                window.open(event.payload.comment.html_url);
              }}
            >
              {event.payload.comment.id}
            </a>
          </div>
        </>
      );

      break;

    case 'IssuesEvent':
      return (
        <>
          <EventHeader />
          <div className={'eventBody'}>
            <Tag
              color={'#ccc'}
              onClick={() => {
                window.open(event.payload.issue.user.html_url);
              }}
            >
              {event.payload.issue.user.login}
            </Tag>{' '}
            {event.payload.issue.body.substr(0, 100)}
            ...
            <a
              className="git-link"
              onClick={() => {
                window.open(event.payload.issue.html_url);
              }}
            >
              {event.payload.issue.id}
            </a>
          </div>
        </>
      );
      break;

    case 'PullRequestEvent':
      return (
        <>
          <EventHeader />
          <div className={'eventBody'}>
            <Tag
              color={'#ccc'}
              onClick={() => {
                window.open(event.payload.pull_request.user.html_url);
              }}
            >
              {event.payload.pull_request.user.login}
            </Tag>
            {event.payload.pull_request.body.substr(0, 100)}
            ...
            <a
              className="git-link"
              onClick={() => {
                window.open(event.payload.pull_request.html_url);
              }}
            >
              {event.payload.pull_request.id}
            </a>
          </div>
        </>
      );

      break;

    case 'PushEvent':
      return (
        <>
          <EventHeader />

          {event.payload.commits.map((commit, idx) => {
            return (
              <div className={'eventBody'} key={idx}>
                <Tag
                  color={'#ccc'}
                  onClick={() => {
                    window.open(`https://github.com/${commit.author.name}`);
                  }}
                >
                  {commit.author.name}
                </Tag>
                {commit.message.substr(0, 100)}
                ...
                <a
                  className="git-link"
                  onClick={() => {
                    window.open(
                      commit.url
                        .replace('https://api.', 'https://')
                        .replace('/repos/', '/')
                        .replace('/commits/', '/commit/'),
                    );
                  }}
                >
                  {commit.sha.substr(0, 7)}
                </a>
              </div>
            );
          })}
        </>
      );

      break;

    default:
      return null;
  }
};

class App extends React.Component<IProps, IState> {
  static async getInitialProps() {
    const data = await Promise.all([getProjects(), getEvents()]);
    return { projects: data[0], events: data[1] };
  }

  setTimeReload: any;
  setTimeoutHandler() {
    clearTimeout(this.setTimeReload);
    this.setTimeReload = setTimeout(() => {
      clearTimeout(this.setTimeReload);
      console.log('Reload App :', new Date());
      Router.push('/');
    }, 60 * 1000 * 5);
  }

  componentDidMount() {
    this.setTimeoutHandler();
  }

  componentDidUpdate() {
    this.setTimeoutHandler();
  }

  render() {
    if (typeof document !== 'undefined') {
      message.info('데이터를 동기화 하였습니다.', 2.5);
    }
    const { projects, events } = this.props;
    const mergeProjects = [...contributonProjectJson.project];
    let totMaxCnt = 0;

    mergeProjects.sort(function(a: TProject, b: TProject) {
      const aRepoLen = a.Repository ? a.Repository.length : 0;
      const bRepoLen = b.Repository ? b.Repository.length : 0;
      if (aRepoLen < bRepoLen) {
        return 1;
      } else if (aRepoLen > bRepoLen) {
        return -1;
      } else {
        return 0;
      }
    });

    for (let i = 0, l = mergeProjects.length; i < l; i++) {
      mergeProjects[i].activeCnt = 0;
      projects.forEach((p: TProject) => {
        if (mergeProjects[i].projectId === p.projectId) {
          mergeProjects[i] = { ...p };
          mergeProjects[i].activeCnt = (p.CommitCount || 0) + (p.IssuesEvent || 0);
          totMaxCnt = Math.max(p.CommitCount || 0, p.IssuesEvent || 0, totMaxCnt);
        }
      });
    }

    mergeProjects.sort(function(a: TProject, b: TProject) {
      if (a.activeCnt < b.activeCnt) {
        return 1;
      } else if (a.activeCnt > b.activeCnt) {
        return -1;
      } else {
        return 0;
      }
    });

    return (
      <Layout>
        <Layout style={{ background: '#ebeff2' }}>
          <StyledLayoutContent>
            <Row>
              {(mergeProjects as TProject[]).map((n, nidx) => {
                return (
                  <PaddedCol key={nidx} xs={24} lg={12} xl={6} xxl={6}>
                    <ProjectCard project={n} pidx={nidx} totMaxCnt={totMaxCnt} />
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
