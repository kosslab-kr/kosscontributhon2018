import moment from 'moment';
import contributonProjectJson from '../contributon-project.json';

const dateAfter = new Date('2018-08-15T15:00:00Z');

type TMentor = { name: string; profileUrl: string };

type TProject = {
  projectId: string;
  projectName: string;
  description: string;
  mentor: TMentor[];
  Repository: string[];
};

export async function cacheAllPojectEvents() {
  const projects: TProject[] = contributonProjectJson.project;
  for (let i = 0; i < projects.length; i++) {
    const project = projects[i];
    console.log('cacheProjectEvent start : ', project.projectId);
    try {
      await cacheProjectEvent(project);
    } catch (error) {
      console.log('cacheProjectEvent project:', project, 'error:', error);
    }
    console.log('cacheProjectEvent end : ', project.projectId);
  }
}

export async function cacheProjectEvent(project: TProject) {
  if (!project.Repository || !project.Repository.length) {
    return;
  }

  const repositories = project.Repository;
  for (let i = 0; i < repositories.length; i++) {
    const repoUrl = repositories[i];
    // github
    if (repoUrl.indexOf('github.com') > -1) {
      await cacheGithubEvents(project, repositories[i]);
    }
  }
}

async function cacheGithubEvents(project: TProject, repository: string) {
  // project init check
  const projectQ = new Parse.Query('Project');
  projectQ.equalTo('projectId', project.projectId);
  const projectM = await projectQ.first();
  const maxPage = projectM ? 1 : 10;

  for (let page = 1; page <= maxPage; page++) {
    // get event
    const events = await getGithubEvents(repository, page);
    // save event
    for (let i = 0; i < events.length; i++) {
      await saveEvent(project, events[i]);
    }
  }
}

async function getGithubEvents(_url: string, page: number = 1) {
  const url = `${_url.replace('github.com', 'api.github.com/repos')}/events?page=${page}`.replace(
    '//events?',
    '/events?',
  );
  console.log('url', url);
  const httpResponse = await Parse.Cloud.httpRequest({
    url,
    method: 'GET',
    headers: {
      'User-Agent': 'request',
      Authorization: `token ${process.env.GITHUB_TOKEN}`,
    },
  });
  const responseData = httpResponse.data || JSON.parse(httpResponse.text);
  return responseData;
}

async function saveEvent(project: TProject, event: any) {
  const eventId = event.id;
  delete event.id;

  // date check
  const createdAt = new Date(event.created_at);
  if (createdAt < dateAfter) {
    return;
  }
  event.created_at = createdAt;

  // check exist
  const eventQ = new Parse.Query('Event');
  eventQ.equalTo('eventId', eventId);
  let eventM = await eventQ.first();
  if (eventM) {
    return;
  }

  // save
  eventM = new Parse.Object('Event');
  await eventM.save({
    projectId: project.projectId,
    eventId,
    ...event,
  });

  // type count save
  const projectQ = new Parse.Query('Project');
  projectQ.equalTo('projectId', project.projectId);
  let projectM = await projectQ.first();
  if (!projectM) {
    projectM = new Parse.Object('Project');
  }
  projectM.set({ ...project });
  projectM.increment(event.type, 1);
  // for commit count
  if (event.type === 'PushEvent' && event.payload) {
    projectM.increment('CommitCount', event.payload.distinct_size);
  }
  await projectM.save();

  // project pointer
  await eventM.save('Project', projectM);
}
