import { ParseType } from './@type';

async function getEvents(Parse: ParseType) {
  const eventQ = new Parse.Query('Event');
  eventQ.descending('created_at');
  const events = await eventQ.find();
  return events;
}

const exported = {
  getEvents: (req, res) => getEvents(req.Parse).then(events => res.json(events)),
};

export default exported;
