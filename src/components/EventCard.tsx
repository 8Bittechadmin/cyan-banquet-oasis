
import React from 'react';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import EventStatusBadge from './EventStatusBadge';

export type EventStatus = 'setup' | 'ongoing' | 'completed' | 'cancelled' | 'pending';

interface EventCardProps {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  clientName: string;
  eventType: string;
  status: EventStatus;
  guestCount?: number;
  className?: string;
}

const EventCard: React.FC<EventCardProps> = ({ 
  id, 
  title,
  date, 
  time, 
  venue, 
  clientName, 
  eventType,
  status,
  guestCount,
  className = '' 
}) => {
  return (
    <div className={`event-card ${className}`}>
      <div className="flex justify-between items-start">
        <h3 className="font-semibold">{title}</h3>
        <EventStatusBadge status={status} />
      </div>
      
      <div className="text-sm text-muted-foreground mb-2">
        Client: <span className="font-medium text-foreground">{clientName}</span> · 
        Type: <span className="font-medium text-foreground">{eventType}</span>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 text-sm">
        <div className="flex items-center text-muted-foreground">
          <Calendar size={14} className="mr-1" />
          <span>{date}</span>
        </div>
        <div className="flex items-center text-muted-foreground">
          <Clock size={14} className="mr-1" />
          <span>{time}</span>
        </div>
        <div className="flex items-center text-muted-foreground">
          <MapPin size={14} className="mr-1" />
          <span>{venue}</span>
        </div>
        {guestCount && (
          <div className="flex items-center text-muted-foreground">
            <Users size={14} className="mr-1" />
            <span>{guestCount} guests</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventCard;
