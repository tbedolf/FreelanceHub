import React, { createContext, useContext, useEffect, useRef, useState } from "react";

const FeedbackContext = createContext(null);

export function FeedbackProvider({ children }) {
  const [notice, setNotice] = useState(null);
  const [confirmation, setConfirmation] = useState(null);
  const timeoutRef = useRef(null);

  useEffect(() => () => window.clearTimeout(timeoutRef.current), []);

  useEffect(() => {
    if (!confirmation) return undefined;
    function handleKeyDown(event) {
      if (event.key === "Escape") closeConfirmation(false);
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [confirmation]);

  function notify(message, type = "success") {
    window.clearTimeout(timeoutRef.current);
    setNotice({ message, type });
    timeoutRef.current = window.setTimeout(() => setNotice(null), 4000);
  }

  function confirmAction({ title, message, confirmLabel = "Confirm" }) {
    return new Promise((resolve) => {
      setConfirmation({ title, message, confirmLabel, resolve });
    });
  }

  function closeConfirmation(result) {
    confirmation?.resolve(result);
    setConfirmation(null);
  }

  return (
    <FeedbackContext.Provider value={{ notify, confirmAction }}>
      {children}

      {notice && (
        <div className={`toast toast-${notice.type}`} role="status" aria-live="polite">
          <span>{notice.message}</span>
          <button type="button" className="toast-close" onClick={() => setNotice(null)} aria-label="Dismiss notification">
            ×
          </button>
        </div>
      )}

      {confirmation && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => closeConfirmation(false)}>
          <section
            className="confirm-dialog"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-title"
            aria-describedby="confirm-description"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <h2 id="confirm-title">{confirmation.title}</h2>
            <p id="confirm-description">{confirmation.message}</p>
            <div className="dialog-actions">
              <button type="button" className="secondary-button" onClick={() => closeConfirmation(false)}>Cancel</button>
              <button type="button" className="danger-button" autoFocus onClick={() => closeConfirmation(true)}>
                {confirmation.confirmLabel}
              </button>
            </div>
          </section>
        </div>
      )}
    </FeedbackContext.Provider>
  );
}

export function useFeedback() {
  const value = useContext(FeedbackContext);
  if (!value) throw new Error("useFeedback must be used inside FeedbackProvider");
  return value;
}
