import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import QrScanner from 'react-qr-scanner'
import { museumApi } from '../services/api'
import { useToast } from '../hooks/useToast'
import { 
  Camera, 
  CameraOff, 
  Search, 
  AlertCircle,
  Loader,
  QrCode 
} from 'lucide-react'

const QRScanner = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { showToast } = useToast()
  
  const [isScanning, setIsScanning] = useState(false)
  const [hasPermission, setHasPermission] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [manualInput, setManualInput] = useState('')
  const [scannedData, setScannedData] = useState(null)
  const [showManualInput, setShowManualInput] = useState(false)

  useEffect(() => {
    checkCameraPermission()
  }, [])

  const checkCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      })
      stream.getTracks().forEach(track => track.stop())
      setHasPermission(true)
    } catch (err) {
      console.log('Camera permission denied:', err)
      setHasPermission(false)
    }
  }

  const handleScan = async (data) => {
    if (data && !isLoading) {
      setIsLoading(true)
      setScannedData(data)
      
      try {
        // Try to scan the QR code
        const result = await museumApi.scanQRCode(data)
        
        if (result && result.id) {
          showToast(t('qr.success'), 'success')
          navigate(`/artifact/${result.id}`)
        } else {
          showToast(t('qr.not_found'), 'error')
        }
      } catch (error) {
        console.error('QR scan error:', error)
        showToast(t('qr.error'), 'error')
      } finally {
        setIsLoading(false)
        setScannedData(null)
      }
    }
  }

  const handleError = (error) => {
    console.error('QR scanner error:', error)
    showToast(t('qr.error'), 'error')
    setHasPermission(false)
  }

  const handleManualSearch = async (e) => {
    e.preventDefault()
    if (!manualInput.trim()) return

    setIsLoading(true)
    
    try {
      // Try to find artifact by inventory number or ID
      const result = await museumApi.scanQRCode(manualInput.trim())
      
      if (result && result.id) {
        showToast(t('qr.success'), 'success')
        navigate(`/artifact/${result.id}`)
      } else {
        showToast(t('qr.not_found'), 'error')
      }
    } catch (error) {
      console.error('Manual search error:', error)
      showToast(t('qr.error'), 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const toggleCamera = () => {
    if (hasPermission) {
      setIsScanning(!isScanning)
    } else {
      checkCameraPermission()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('qr.title')}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('qr.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* QR Scanner */}
          <motion.div 
            className="bg-white rounded-2xl shadow-xl p-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <QrCode className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                Scanner QR
              </h2>
            </div>

            {/* Camera Permission */}
            {hasPermission === false && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                  <p className="text-red-700">{t('qr.permission')}</p>
                </div>
              </div>
            )}

            {/* Scanner */}
            <div className="relative">
              {hasPermission === null && (
                <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                  <Loader className="w-8 h-8 text-gray-400 animate-spin" />
                </div>
              )}

              {hasPermission === true && (
                <div className="relative">
                  {!isScanning ? (
                    <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                      <button
                        onClick={toggleCamera}
                        className="flex flex-col items-center space-y-2 text-gray-600 hover:text-gray-900 transition-colors"
                      >
                        <Camera className="w-12 h-12" />
                        <span className="font-medium">{t('common.play')}</span>
                      </button>
                    </div>
                  ) : (
                    <div className="relative">
                      {hasPermission && isScanning ? (
                            <QrScanner
                              delay={300}
                              onError={handleError}
                              onScan={handleScan}
                              style={{ width: '100%' }}
                              videoConstraints={{ facingMode: { exact: "environment" } }}
                            />
                          ) : (
                            <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                              <p>Caméra indisponible</p>
                            </div>
                          )}


                      {/* Scanning Overlay */}
                      <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute inset-4 border-2 border-amber-500 rounded-lg">
                          <div className="absolute inset-0">
                            <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-amber-500"></div>
                            <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-amber-500"></div>
                            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-amber-500"></div>
                            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-amber-500"></div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Loading Overlay */}
                      {isLoading && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                          <div className="bg-white rounded-lg p-4 flex items-center space-x-3">
                            <Loader className="w-5 h-5 text-amber-600 animate-spin" />
                            <span className="font-medium">{t('qr.scanning')}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {isScanning && (
                    <button
                      onClick={toggleCamera}
                      className="absolute top-2 right-2 p-2 bg-white/80 backdrop-blur-sm rounded-full text-gray-700 hover:bg-white transition-colors"
                    >
                      <CameraOff className="w-5 h-5" />
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Manual Input Toggle */}
            <div className="mt-6 text-center">
              <button
                onClick={() => setShowManualInput(!showManualInput)}
                className="text-amber-600 hover:text-amber-700 font-medium transition-colors"
              >
                {showManualInput ? t('common.close') : t('qr.manual')}
              </button>
            </div>
          </motion.div>

          {/* Manual Input */}
          <motion.div 
            className="bg-white rounded-2xl shadow-xl p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                {t('qr.manual')}
              </h2>
            </div>

            <form onSubmit={handleManualSearch} className="space-y-4">
              <div>
                <label htmlFor="manual-input" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('qr.manual_placeholder')}
                </label>
                <input
                  id="manual-input"
                  type="text"
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  placeholder={t('qr.manual_placeholder')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-colors"
                  disabled={isLoading}
                />
              </div>
              
              <button
                type="submit"
                disabled={isLoading || !manualInput.trim()}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-amber-600 hover:to-orange-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <Loader className="w-5 h-5 mr-2 animate-spin" />
                    {t('qr.scanning')}
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5 mr-2" />
                    {t('common.search')}
                  </>
                )}
              </button>
            </form>

            {/* Instructions */}
            <div className="mt-6 p-4 bg-amber-50 rounded-lg">
              <h3 className="font-semibold text-amber-900 mb-2">
                Comment utiliser le scanner :
              </h3>
              <ul className="text-sm text-amber-800 space-y-1">
                <li>• Autorisez l'accès à la caméra</li>
                <li>• Positionnez le code QR dans le cadre</li>
                <li>• L'application détectera automatiquement le code</li>
                <li>• Vous serez redirigé vers la fiche de l'œuvre</li>
              </ul>
            </div>
          </motion.div>
        </div>

        {/* Recent Scans */}
        <motion.div 
          className="mt-12 bg-white rounded-2xl shadow-xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Scans Récents
          </h3>
          <div className="text-center text-gray-500 py-8">
            <QrCode className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Aucun scan récent</p>
            <p className="text-sm">Commencez à scanner des codes QR pour voir votre historique</p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default QRScanner