import { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Layout from './components/Layout'
import LoadingSpinner from './components/LoadingSpinner'
import { LanguageProvider } from './context/LanguageContext'
import { MuseumProvider } from './context/MuseumContext'

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home'))
const ArtifactDetail = lazy(() => import('./pages/ArtifactDetail'))
const Collections = lazy(() => import('./pages/Collections'))
const CollectionDetail = lazy(() => import('./pages/CollectionDetail'))
const Search = lazy(() => import('./pages/Search'))
const QRScanner = lazy(() => import('./pages/QRScanner'))
const VirtualTour = lazy(() => import('./pages/VirtualTour'))
const About = lazy(() => import('./pages/About'))




function App() {
  return (
    <MuseumProvider>
      <LanguageProvider>
        <Layout>
          <Suspense fallback={<LoadingSpinner />}>
            <AnimatePresence mode="wait">
              <Routes>
                <Route 
                  path="/" 
                  element={
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Home />
                    </motion.div>
                  } 
                />
                <Route 
                  path="/artifact/:id" 
                  element={
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ArtifactDetail />
                    </motion.div>
                  } 
                />
                <Route 
                  path="/collections" 
                  element={
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Collections />
                    </motion.div>
                  } 
                />
                <Route 
                  path="/collection/:id" 
                  element={
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <CollectionDetail />
                    </motion.div>
                  } 
                />
                <Route 
                  path="/search" 
                  element={
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Search />
                    </motion.div>
                  } 
                />
                <Route 
                  path="/qr-scanner" 
                  element={
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <QRScanner />
                    </motion.div>
                  } 
                />
                <Route 
                  path="/virtual-tour" 
                  element={
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <VirtualTour />
                    </motion.div>
                  } 
                />
                <Route 
                  path="/about" 
                  element={
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <About />
                    </motion.div>
                  } 
                />
              </Routes>
            </AnimatePresence>
          </Suspense>
        </Layout>
      </LanguageProvider>
    </MuseumProvider>
  )
}

export default App