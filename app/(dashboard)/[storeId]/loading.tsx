import ClipLoader from "react-spinners/ClipLoader";

const LoaderProvider = () => {
    {/* loader for default loading fallback during  */ }

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
                <ClipLoader
                    className="text-black "
                    size={50}
                />
            </div>
        </> 
    );
}

export default LoaderProvider;
