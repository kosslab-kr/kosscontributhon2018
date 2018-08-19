import { ParseType } from './@type';

async function getProjects(Parse: ParseType) {
  const projectQ = new Parse.Query('Project');
  projectQ.descending('updatedAt');
  const projects = await projectQ.find();
  return projects;
}

const exported = {
  getProjects: (req, res) => getProjects(req.Parse).then(events => res.json(events)),
};

export default exported;
