import PropagateLoader from "react-spinners/ClipLoader";

const LoaderProvider = () => {
    
    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
                <PropagateLoader
                    className="text-black "
                    size={50}

                />
            </div>
        </>
    );
}

export default LoaderProvider;
