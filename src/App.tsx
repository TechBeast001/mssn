import React, { useState, useEffect } from 'react';
import { useMSSNStore } from './hooks/useMSSNStore';
import { Navbar, PublicTab } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomeView } from './components/public/HomeView';
import { AboutView } from './components/public/AboutView';
import { LeadershipView } from './components/public/LeadershipView';
import { CommitteesView } from './components/public/CommitteesView';
import { EventsView } from './components/public/EventsView';
import { GalleryView } from './components/public/GalleryView';
import { BlogView } from './components/public/BlogView';
import { DonationsView } from './components/public/DonationsView';
import { ContactView } from './components/public/ContactView';
import { FAQView } from './components/public/FAQView';
import { ELibraryView } from './components/public/ELibraryView';
import { VerifyMemberView } from './components/public/VerifyMemberView';
import { RegistrationModal } from './components/registration/RegistrationModal';
import { AdminPortal } from './components/admin/AdminPortal';
import { ErrorBoundary } from './components/common/ErrorBoundary';

export default function App() {
  const { adminUser } = useMSSNStore();
  const [viewMode, setViewMode] = useState<'public' | 'admin'>('public');
  const [activeTab, setActiveTab] = useState<PublicTab>('home');
  const [registrationOpen, setRegistrationOpen] = useState<boolean>(false);
  const [preselectedCommittee, setPreselectedCommittee] = useState<string | undefined>();
  const [verifyInitialQuery, setVerifyInitialQuery] = useState<string>('');
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);

  // Check URL query parameters for direct verification links or deep links or ?portal=admin
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const portalParam = params.get('portal');
      const verifyParam = params.get('verify');
      const eventParam = params.get('event');
      const articleParam = params.get('article');
      const tabParam = params.get('tab') as PublicTab;

      if (portalParam === 'admin') {
        setViewMode('admin');
      } else if (verifyParam) {
        setVerifyInitialQuery(verifyParam);
        setActiveTab('verify');
      } else if (eventParam) {
        setSelectedEventId(eventParam);
        setActiveTab('events');
      } else if (articleParam) {
        setSelectedArticleId(articleParam);
        setActiveTab('blog');
      } else if (tabParam) {
        setActiveTab(tabParam);
      }
    } catch {
      // safe fallback in iframe sandbox
    }
  }, []);

  // Keyboard shortcut listener (Alt + A) to toggle/open the separate admin portal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        setViewMode((prev) => (prev === 'admin' ? 'public' : 'admin'));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle open registration with optional preselected committee
  const handleOpenRegistration = (committeeName?: string) => {
    setPreselectedCommittee(committeeName);
    setRegistrationOpen(true);
  };

  // Tab switcher with scroll to top
  const handleTabChange = (tab: PublicTab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If in dedicated admin portal mode, render isolated AdminPortal (login or dashboard)
  if (viewMode === 'admin') {
    return (
      <ErrorBoundary fallbackTitle="Admin Portal Error" onReset={() => setViewMode('public')}>
        <AdminPortal onReturnToPublic={() => setViewMode('public')} />
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-emerald-800 selection:text-amber-300">
        {/* Redesigned Public Navbar */}
        <Navbar
          activeTab={activeTab}
          onTabChange={handleTabChange}
          onOpenRegistration={() => handleOpenRegistration()}
        />

        {/* Main Public Content Canvas */}
        <main className="flex-1">
          <ErrorBoundary fallbackTitle="Could not load view content" onReset={() => setActiveTab('home')}>
            {activeTab === 'home' && (
              <HomeView
                onTabChange={handleTabChange}
                onOpenRegistration={handleOpenRegistration}
                onSelectEvent={(id) => {
                  setSelectedEventId(id);
                  handleTabChange('events');
                }}
                onSelectArticle={(id) => {
                  setSelectedArticleId(id);
                  handleTabChange('blog');
                }}
              />
            )}

            {activeTab === 'about' && (
              <AboutView
                onTabChange={handleTabChange}
                onOpenRegistration={() => handleOpenRegistration()}
              />
            )}

            {activeTab === 'leadership' && <LeadershipView />}

            {activeTab === 'committees' && (
              <CommitteesView onOpenRegistration={handleOpenRegistration} />
            )}

            {activeTab === 'events' && (
              <EventsView
                initialEventId={selectedEventId}
                onClearInitialEvent={() => setSelectedEventId(null)}
              />
            )}

            {activeTab === 'gallery' && <GalleryView />}

            {activeTab === 'blog' && (
              <BlogView
                initialArticleId={selectedArticleId}
                onClearInitialArticle={() => setSelectedArticleId(null)}
              />
            )}

            {activeTab === 'donations' && <DonationsView />}

            {activeTab === 'elibrary' && (
              <ELibraryView
                onTabChange={handleTabChange}
                onOpenRegistration={() => handleOpenRegistration()}
              />
            )}

            {activeTab === 'contact' && <ContactView />}

            {activeTab === 'faq' && (
              <FAQView
                onTabChange={handleTabChange}
                onOpenRegistration={() => handleOpenRegistration()}
              />
            )}

            {activeTab === 'verify' && (
              <VerifyMemberView
                initialQuery={verifyInitialQuery}
                onOpenRegistration={() => handleOpenRegistration()}
              />
            )}
          </ErrorBoundary>
        </main>

        {/* Public Footer with subtle, discreet officer portal access */}
        <Footer
          onTabChange={handleTabChange}
          onOpenRegistration={() => handleOpenRegistration()}
          onOpenAdmin={() => setViewMode('admin')}
        />

        {/* Membership Registration Modal */}
        <RegistrationModal
          isOpen={registrationOpen}
          onClose={() => {
            setRegistrationOpen(false);
            setPreselectedCommittee(undefined);
          }}
          preselectedCommittee={preselectedCommittee}
        />
      </div>
    </ErrorBoundary>
  );
}
