import { WeeklyCalendar } from "../../components";
import { add } from "date-fns";
import React from "react";

const CalendarPage = () => {
  const event = {
    eventId: "12",
    startTime: new Date(),
    endTime: add(new Date(), { hours: 1 }),
    title: "test event",
  };

  const coloredEvent = {
    eventId: "123",
    startTime: add(new Date(), { days: 1 }),
    endTime: add(new Date(), { days: 1, hours: 2 }),
    title: "another test event",
    backgroundColor: "green",
  };
  return (
    <div>
      <WeeklyCalendar
        events={[event, coloredEvent]}
        weekends={true}
        onEventClick={(event: any) => console.log(event)}
      />
    </div>
  );
};

export default CalendarPage;
