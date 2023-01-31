import React from 'react';
import ReactDom from 'react-dom';

const styles = {
    position: "fixed",
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    padding: '50px',
    zIndex: 1000
};

const backdrop = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0, 0.7)',
    zIndex: 1000
};

const Modal = ({open, children, onClose}) => {
    if (!open) return null;

    return ReactDom.createPortal(
        <React.Fragment>
            <div style={backdrop} onClick={onClose}> </div>
            <div style={styles}>
                <div className="modal-content">{children}</div>
            </div>
        </React.Fragment>, document.getElementById('portal')
    )
};

export default Modal;