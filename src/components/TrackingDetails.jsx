import React from "react";
import { Card, ListGroup } from "react-bootstrap";

const TrackingDetails = ({ data }) => (
  <Card className="mt-4">
    <Card.Header>
      <h5>TRACKING DETAILS: {data.trackingNumber}</h5>
    </Card.Header>
    <Card.Body>
      <p>
        <strong>Status:</strong> {data.status}
      </p>
      <ListGroup>
        {data.history.map((event, index) => (
          <ListGroup.Item key={index}>
            {event.status} - {event.location} ({event.date})
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Card.Body>
  </Card>
);

export default TrackingDetails;
