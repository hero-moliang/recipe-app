import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useRecipes } from '../hooks/useRecipes';
import { useCollections } from '../hooks/useCollections';

export default function Layout() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();
  const recipes = useRecipes();
  const collections = useCollections();

  const navItems = [
    { to: '/', label: '全部菜谱', icon: '📖', count: recipes.length },
    { to: '/collections', label: '菜谱合集', icon: '📚', count: collections.length },
    { to: '/settings', label: '设置', icon: '⚙️' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center h-12 px-4">
          <button
            onClick={() => setDrawerOpen(true)}
            className="p-2 -ml-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="ml-2 text-lg font-semibold text-gray-900">我的菜谱</h1>
        </div>
      </header>

      {/* Drawer overlay */}
      {drawerOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setDrawerOpen(false)}>
          <div className="absolute inset-0 bg-black/30" />
        </div>
      )}

      {/* Drawer */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-white shadow-xl transition-transform duration-200 ${
          drawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between h-12 px-4 border-b border-gray-200">
          <span className="text-lg font-semibold text-gray-900">菜单</span>
          <button
            onClick={() => setDrawerOpen(false)}
            className="p-2 -mr-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="py-2">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setDrawerOpen(false)}
              className={`flex items-center justify-between px-4 py-3 text-sm transition-colors ${
                location.pathname === item.to ||
                (item.to !== '/' && location.pathname.startsWith(item.to))
                  ? 'bg-orange-50 text-orange-600 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span>
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </span>
              {item.count !== undefined && (
                <span className="text-xs text-gray-400">{item.count}</span>
              )}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="pt-12 pb-6">
        <Outlet />
      </main>
    </div>
  );
}
