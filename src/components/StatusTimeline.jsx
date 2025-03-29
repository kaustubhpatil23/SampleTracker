import React from "react";
import { ListGroup } from "react-bootstrap";

const StatusTimeline = ({ events }) => (
  <ListGroup>
    {events.map((event, index) => (
      <ListGroup.Item key={index}>
        <strong>{event.status}</strong> - {event.location} ({event.date})
      </ListGroup.Item>
    ))}
  </ListGroup>
);

export default StatusTimeline;
