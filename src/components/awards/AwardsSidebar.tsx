'use client';

import { useState, useEffect } from 'react';
import SidebarNavItem from '@/components/awards/SidebarNavItem';

interface AwardsSidebarProps {
  slugs: { slug: string; label: string }[];
}

export default function AwardsSidebar({ slugs }: AwardsSidebarProps) {
  const [activeSlug, setActiveSlug] = useState<string>(slugs[0]?.slug ?? '');

  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash && slugs.some(s => s.slug === hash)) {
      setActiveSlug(hash);
      const element = document.getElementById(hash);
      element?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [slugs]);

  useEffect(() => {
    const elements = slugs
      .map(s => document.getElementById(s.slug))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSlug(entry.target.id);
          }
        }
      },
      { rootMargin: '-96px 0px -60% 0px' }
    );

    elements.forEach(el => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, [slugs]);

  const handleClick = (slug: string) => {
    setActiveSlug(slug);
    document.getElementById(slug)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav
      aria-label={'Danh m\u1ee5c gi\u1ea3i th\u01b0\u1edfng'}
      className="awards-sidebar"
      style={{
        position: 'sticky',
        top: 96,
        width: 'var(--spacing-sidebar-width)',
        alignSelf: 'flex-start',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {slugs.map(({ slug, label }) => (
        <SidebarNavItem
          key={slug}
          slug={slug}
          label={label}
          isActive={activeSlug === slug}
          onClick={handleClick}
        />
      ))}
    </nav>
  );
}
