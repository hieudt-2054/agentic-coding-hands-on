interface AwardsLayoutProps {
  sidebar: React.ReactNode;
  children: React.ReactNode;
}

export default function AwardsLayout({ sidebar, children }: AwardsLayoutProps) {
  return (
    <div className="awards-layout flex flex-row" style={{ gap: 'var(--spacing-two-col-gap)' }}>
      {sidebar}
      <div style={{ flex: 1 }}>
        {children}
      </div>
    </div>
  );
}
