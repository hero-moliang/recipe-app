import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import RecipeNewPage from './pages/RecipeNewPage';
import RecipeDetailPage from './pages/RecipeDetailPage';
import RecipeEditPage from './pages/RecipeEditPage';
import CollectionsPage from './pages/CollectionsPage';
import CollectionDetailPage from './pages/CollectionDetailPage';
import SettingsPage from './pages/SettingsPage';

export default function App() {
  return (
    <BrowserRouter basename="/recipe-app">
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/collections" element={<CollectionsPage />} />
          <Route path="/collections/:id" element={<CollectionDetailPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
        <Route path="/recipes/new" element={<RecipeNewPage />} />
        <Route path="/recipes/:id" element={<RecipeDetailPage />} />
        <Route path="/recipes/:id/edit" element={<RecipeEditPage />} />
      </Routes>
    </BrowserRouter>
  );
}
