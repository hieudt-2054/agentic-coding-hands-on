import React from 'react';
import { render, screen } from '@testing-library/react';
import EventInfo from '@/components/homepage/EventInfo';

describe('EventInfo', () => {
  it('renders time label and value', () => {
    render(
      <EventInfo
        time="18:00 - 21:00"
        venue="Grand Hall"
        streamNote={null}
      />
    );
    expect(screen.getByText('Thời gian:')).toBeInTheDocument();
    expect(screen.getByText('18:00 - 21:00')).toBeInTheDocument();
  });

  it('renders venue label and value', () => {
    render(
      <EventInfo
        time="18:00 - 21:00"
        venue="Grand Hall"
        streamNote={null}
      />
    );
    expect(screen.getByText('Địa điểm:')).toBeInTheDocument();
    expect(screen.getByText('Grand Hall')).toBeInTheDocument();
  });

  it('renders stream note when provided', () => {
    render(
      <EventInfo
        time="18:00 - 21:00"
        venue="Grand Hall"
        streamNote="Live stream available"
      />
    );
    expect(screen.getByText('Live stream available')).toBeInTheDocument();
  });

  it('does not render stream note when null', () => {
    render(
      <EventInfo
        time="18:00 - 21:00"
        venue="Grand Hall"
        streamNote={null}
      />
    );
    expect(screen.queryByText('Live stream available')).not.toBeInTheDocument();
  });
});
