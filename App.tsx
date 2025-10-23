import React, { useState, useCallback, useEffect } from 'react';
import { processImageWithGemini } from './services/geminiService';

// --- Helper Icon and UI Components ---

const UploadIcon: React.FC = () => (
  <svg className="w-12 h-12 mx-auto text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const TextIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 11-2 0V4H6v12a1 1 0 11-2 0V4zm4 4a1 1 0 100 2h4a1 1 0 100-2H8zm0 4a1 1 0 100 2h4a1 1 0 100-2H8z" clipRule="evenodd" />
    </svg>
);

const CaptionIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
        <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
    </svg>
);

const Spinner: React.FC<{className?: string}> = ({className = "h-5 w-5 text-white"}) => (
  <svg className={`animate-spin ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

const LoadingIndicator: React.FC = () => (
    <div className="flex items-center justify-center space-x-2 py-8">
        <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
        <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
    </div>
);

interface ResultCardProps {
    title: string;
    content: string | null;
    isLoading: boolean;
}

const ResultCard: React.FC<ResultCardProps> = ({ title, content, isLoading }) => (
    <div className="bg-gray-50 rounded-lg p-4 w-full shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
        <div className="bg-white p-4 rounded-md min-h-[120px] text-gray-700 whitespace-pre-wrap font-mono text-sm shadow-inner overflow-y-auto max-h-64">
            {isLoading ? <LoadingIndicator /> : (content || <span className="text-gray-400">Result will appear here...</span>)}
        </div>
    </div>
);

const ModeSelectionCard: React.FC<{
    icon: React.ReactNode;
    title: string;
    description: string;
    onClick: () => void;
    className?: string;
}> = ({ icon, title, description, onClick, className }) => (
    <button
        onClick={onClick}
        className={`w-full text-center p-8 border rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300 ${className}`}
    >
        {icon}
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        <p className="mt-2 text-gray-600">{description}</p>
    </button>
);

type AppMode = 'text' | 'caption';

const App: React.FC = () => {
  const [appMode, setAppMode] = useState<AppMode | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const newPreviewUrl = URL.createObjectURL(file);
      setPreviewUrl(newPreviewUrl);
      setResult(null);
      setError(null);
    }
  };
  
  const resetImage = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setImageFile(null);
    setPreviewUrl(null);
    setResult(null);
    setError(null);
  };
  
  const resetApp = () => {
    resetImage();
    setAppMode(null);
  }

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);
  
  const handleProcessImage = useCallback(async () => {
    if (!imageFile || !appMode) return;
    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
      const prompt = appMode === 'text'
        ? "Extract all text from this image. Respond with only the text content. If no text is found, state that clearly."
        : "Generate a short, engaging, and descriptive caption for this image.";
      const apiResult = await processImageWithGemini(imageFile, prompt);
      setResult(apiResult);
    } catch (e: any) {
      setError(e.message || 'Failed to process image.');
    } finally {
      setIsLoading(false);
    }
  }, [imageFile, appMode]);
  
  const appTitle = appMode === 'text' ? 'Text Extractor' : 'Caption Generator';

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-2xl p-6 sm:p-10 transition-all duration-500">
          <header className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
              AI Image Analyzer
            </h1>
            <p className="mt-2 text-lg text-gray-600 max-w-2xl mx-auto">
              {!appMode ? "Choose a tool to get started." : `Upload an image to ${appMode === 'text' ? 'extract its text' : 'generate a caption'}.`}
            </p>
          </header>

          <main>
            {!appMode && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6 animate-fade-in">
                <ModeSelectionCard
                  onClick={() => setAppMode('text')}
                  title="Text Extractor"
                  description="Extract printed and handwritten text from any image."
                  icon={<TextIcon className="h-12 w-12 mx-auto text-indigo-500 mb-4" />}
                  className="bg-indigo-50 border-indigo-200 focus:ring-indigo-500"
                />
                <ModeSelectionCard
                  onClick={() => setAppMode('caption')}
                  title="Caption Generator"
                  description="Create a creative and fitting caption for your image."
                  icon={<CaptionIcon className="h-12 w-12 mx-auto text-purple-500 mb-4" />}
                  className="bg-purple-50 border-purple-200 focus:ring-purple-500"
                />
              </div>
            )}
            
            {appMode && (
              <div className="animate-fade-in">
                 <div className="mb-6">
                  <button onClick={resetApp} className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                    &larr; Choose a different tool
                  </button>
                </div>

                {!previewUrl && (
                  <div className="mt-6">
                    <label
                      htmlFor="file-upload"
                      className="relative flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <UploadIcon />
                      <span className="mt-2 block text-sm font-medium text-gray-900">
                        Click to upload an image for the {appTitle}
                      </span>
                      <span className="block text-xs text-gray-500">
                        PNG, JPG, GIF up to 10MB
                      </span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        accept="image/png, image/jpeg, image/gif, image/webp"
                        onChange={handleImageChange}
                      />
                    </label>
                  </div>
                )}

                {error && (
                  <div className="mt-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">
                    <p className="font-bold">Error</p>
                    <p>{error}</p>
                  </div>
                )}

                {previewUrl && (
                  <div className="flex flex-col items-center gap-6 mt-6">
                    <div className="relative w-full max-w-xl aspect-video rounded-lg overflow-hidden shadow-lg border border-gray-200 bg-gray-100">
                      <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
                    </div>
                    
                    <button onClick={resetImage} className="text-sm text-gray-500 hover:text-gray-800">
                      Change image
                    </button>
                  
                    <button
                      onClick={handleProcessImage}
                      disabled={isLoading}
                      className="w-full max-w-xs flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-colors"
                    >
                      {isLoading ? <Spinner /> : <TextIcon className="h-5 w-5" />}
                      <span className="ml-2">{isLoading ? 'Processing...' : appTitle}</span>
                    </button>

                    <div className="w-full max-w-xl">
                      <ResultCard 
                        title={appTitle}
                        content={result} 
                        isLoading={isLoading}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default App;
