import { useState, useEffect } from 'react';
import { adminApi, reportsApi } from '../services/api';
import { LoadingState } from '../components/ui/LoadingState';
import { ReportDetailModal } from '../components/moderation/ReportDetailModal';

interface Stats {
  totalUsers: number;
  totalPosts: number;
  totalReports: number;
  pendingReports: number;
}

interface Report {
  id: string;
  reporterId: string;
  reporterUsername: string;
  targetType: 'post' | 'comment' | 'user';
  targetId: string;
  targetOwnerId?: string;
  targetOwnerUsername?: string;
  category: string;
  description?: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  createdAt: any;
}

export function DashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  const [stats, setStats] = useState<Stats | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'stats' | 'reports'>('stats');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  // Check for existing admin token on mount
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadDashboardData();
    }
  }, [isAuthenticated]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Load stats
      const statsRes = await adminApi.getStats();
      setStats(statsRes.data);

      // Load pending reports
      const reportsRes = await reportsApi.getReports({ status: 'pending', limit: 50 });
      console.log('Reports response:', reportsRes.data); // Debug log
      setReports(reportsRes.data.reports || []);
    } catch (error: any) {
      console.error('Error loading dashboard:', error);
      console.error('Error details:', error.response?.data); // Debug log
      // If unauthorized, clear token and log out
      if (error.response?.status === 403) {
        localStorage.removeItem('adminToken');
        setIsAuthenticated(false);
        alert('Session expired. Please login again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoginLoading(true);

    try {
      const response = await adminApi.login({ username, password });
      // Store admin token in localStorage
      if (response.data.token) {
        localStorage.setItem('adminToken', response.data.token);
      }
      setIsAuthenticated(true);
      setUsername('');
      setPassword('');
    } catch (error: any) {
      console.error('Login error:', error);
      setLoginError(error.response?.data?.error || 'Invalid credentials');
    } finally {
      setIsLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await adminApi.logout();
      // Remove admin token from localStorage
      localStorage.removeItem('adminToken');
      setIsAuthenticated(false);
      setStats(null);
      setReports([]);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleReportAction = async (reportId: string, action: 'resolved' | 'dismissed') => {
    try {
      await reportsApi.updateReport(reportId, { status: action });

      // Show success message
      const actionText = action === 'resolved' ? 'razrešen' : 'odbačen';
      alert(`Report uspešno ${actionText}!`);

      // Reload reports and stats
      await loadDashboardData();
    } catch (error) {
      console.error('Error updating report:', error);
      alert('Greška pri ažuriranju reporta');
    }
  };

  const handleBanUser = async (userId: string, username: string, reportId?: string) => {
    const confirmed = window.confirm(`Banovati korisnika @${username}? Ovaj korisnik neće moći da pristupa platformi.`);
    if (!confirmed) return;

    try {
      await adminApi.toggleBan(userId);
      alert(`Korisnik @${username} uspešno banovan!`);

      // If called from a report, mark it as resolved
      if (reportId) {
        await reportsApi.updateReport(reportId, { status: 'resolved' });
      }

      // Reload dashboard
      await loadDashboardData();
    } catch (error) {
      console.error('Error banning user:', error);
      alert('Greška pri banovanju korisnika');
    }
  };

  const handleDeletePost = async (postId: string, reportId?: string) => {
    const confirmed = window.confirm('Obrisati ovaj post? Ova akcija se ne može poništiti.');
    if (!confirmed) return;

    try {
      await adminApi.deletePost(postId);
      alert('Post uspešno obrisan!');

      // If called from a report, mark it as resolved
      if (reportId) {
        await reportsApi.updateReport(reportId, { status: 'resolved' });
      }

      // Reload dashboard
      await loadDashboardData();
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Greška pri brisanju posta');
    }
  };

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-tradey-white flex items-center justify-center px-6 py-12">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="mx-auto w-20 h-20 bg-tradey-red/10 rounded-full flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-tradey-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>

            <h1 className="font-fayte text-4xl md:text-5xl text-tradey-black mb-4 tracking-tight uppercase">
              Admin Dashboard
            </h1>
            <p className="font-sans text-tradey-black/60 text-sm mb-8">
              Enter your admin credentials to access the dashboard
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="username" className="block font-sans text-sm font-medium mb-2 text-tradey-black">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
                className="w-full px-4 py-3 bg-tradey-white border border-tradey-black/20 rounded-lg text-tradey-black text-base font-sans placeholder-tradey-black/40 focus:outline-none focus:ring-2 focus:ring-tradey-red focus:border-transparent transition-all"
                placeholder="admin"
              />
            </div>

            <div>
              <label htmlFor="password" className="block font-sans text-sm font-medium mb-2 text-tradey-black">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full px-4 py-3 bg-tradey-white border border-tradey-black/20 rounded-lg text-tradey-black text-base font-sans placeholder-tradey-black/40 focus:outline-none focus:ring-2 focus:ring-tradey-red focus:border-transparent transition-all"
                placeholder="••••••••"
              />
            </div>

            {loginError && (
              <div className="bg-tradey-red/10 border border-tradey-red rounded-lg p-3">
                <p className="text-tradey-red text-sm font-sans">{loginError}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoginLoading}
              className="w-full py-3.5 bg-tradey-red hover:bg-tradey-red/80 text-tradey-white font-sans text-base font-semibold rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              {isLoginLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Dashboard Screen
  return (
    <div className="min-h-screen bg-tradey-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-fayte text-4xl text-tradey-black uppercase">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="px-6 py-2 bg-tradey-black text-white font-sans text-sm hover:opacity-90 transition-opacity"
          >
            Logout
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-tradey-black/10 mb-8">
          <div className="flex gap-8">
            <button
              onClick={() => setSelectedTab('stats')}
              className={`pb-4 font-sans text-sm font-medium transition-colors ${
                selectedTab === 'stats'
                  ? 'text-tradey-red border-b-2 border-tradey-red'
                  : 'text-tradey-black/60 hover:text-tradey-black'
              }`}
            >
              Statistics
            </button>
            <button
              onClick={() => setSelectedTab('reports')}
              className={`pb-4 font-sans text-sm font-medium transition-colors ${
                selectedTab === 'reports'
                  ? 'text-tradey-red border-b-2 border-tradey-red'
                  : 'text-tradey-black/60 hover:text-tradey-black'
              }`}
            >
              Reports ({stats?.pendingReports || 0})
            </button>
          </div>
        </div>

        {loading ? (
          <LoadingState />
        ) : (
          <>
            {/* Stats Tab */}
            {selectedTab === 'stats' && stats && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white border border-tradey-black/10 p-6">
                  <p className="font-sans text-tradey-black/60 text-sm mb-2">Total Users</p>
                  <p className="font-fayte text-4xl text-tradey-black">{stats.totalUsers}</p>
                </div>
                <div className="bg-white border border-tradey-black/10 p-6">
                  <p className="font-sans text-tradey-black/60 text-sm mb-2">Total Posts</p>
                  <p className="font-fayte text-4xl text-tradey-black">{stats.totalPosts}</p>
                </div>
                <div className="bg-white border border-tradey-black/10 p-6">
                  <p className="font-sans text-tradey-black/60 text-sm mb-2">Total Reports</p>
                  <p className="font-fayte text-4xl text-tradey-black">{stats.totalReports}</p>
                </div>
                <div className="bg-white border border-tradey-black/10 p-6">
                  <p className="font-sans text-tradey-black/60 text-sm mb-2">Pending Reports</p>
                  <p className="font-fayte text-4xl text-tradey-red">{stats.pendingReports}</p>
                </div>
              </div>
            )}

            {/* Reports Tab */}
            {selectedTab === 'reports' && (
              <div className="space-y-4">
                {reports.length === 0 ? (
                  <div className="bg-white border border-tradey-black/10 p-12 text-center">
                    <p className="font-sans text-tradey-black/40 italic">No pending reports</p>
                  </div>
                ) : (
                  reports.map((report) => (
                    <div key={report.id} className="bg-white border border-tradey-black/10 p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <span className="px-3 py-1 bg-tradey-red/10 text-tradey-red font-sans text-xs uppercase font-medium rounded">
                              {report.category}
                            </span>
                            <span className="px-3 py-1 bg-tradey-black/5 text-tradey-black/60 font-sans text-xs uppercase rounded">
                              {report.targetType}
                            </span>
                          </div>
                          <p className="font-sans text-sm text-tradey-black/80">
                            Reported by <span className="font-medium">@{report.reporterUsername}</span>
                            {report.targetOwnerUsername && (
                              <> targeting <span className="font-medium">@{report.targetOwnerUsername}</span></>
                            )}
                          </p>
                          {report.description && (
                            <p className="font-sans text-sm text-tradey-black/60 mt-2 italic">
                              "{report.description}"
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() => setSelectedReport(report)}
                          className="px-6 py-2 bg-tradey-red text-white font-sans text-sm hover:bg-tradey-red/80 transition-colors font-semibold"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => handleReportAction(report.id, 'dismissed')}
                          className="px-4 py-2 bg-tradey-black/10 text-tradey-black font-sans text-sm hover:bg-tradey-black/20 transition-colors"
                        >
                          Quick Dismiss
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Report Detail Modal */}
      {selectedReport && (
        <ReportDetailModal
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
          onActionComplete={loadDashboardData}
        />
      )}
    </div>
  );
}
