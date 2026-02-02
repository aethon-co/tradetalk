import React from 'react';

interface VideoModalProps {
    isOpen: boolean;
    videoUrl: string | null;
    onClose: () => void;
}

const VideoModal: React.FC<VideoModalProps> = ({ isOpen, videoUrl, onClose }) => {
    if (!isOpen || !videoUrl) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
        }} onClick={onClose}>
            <div style={{
                position: 'relative',
                width: '80%',
                maxWidth: '800px',
                backgroundColor: '#000',
                borderRadius: '8px',
                overflow: 'hidden'
            }} onClick={e => e.stopPropagation()}>
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        background: 'rgba(255, 255, 255, 0.2)',
                        border: 'none',
                        color: 'white',
                        fontSize: '20px',
                        cursor: 'pointer',
                        borderRadius: '50%',
                        width: '30px',
                        height: '30px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 10
                    }}
                >
                    &times;
                </button>
                <video
                    src={videoUrl}
                    controls
                    autoPlay
                    style={{ width: '100%', display: 'block' }}
                />
            </div>
        </div>
    );
};

export default VideoModal;
