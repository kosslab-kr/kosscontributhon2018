import { ParseType } from './@type';

async function getEvents(Parse: ParseType, query: { type: string }) {
  const eventQ = new Parse.Query('Event');
  eventQ.descending('created_at');
  if (query.type) {
    eventQ.containedIn('type', query.type.split(','));
  }
  const events = await eventQ.find();
  return events;
}

const exported = {
  getEvents: (req, res) => getEvents(req.Parse, req.query).then(events => res.json(events)),
};

export default exported;
