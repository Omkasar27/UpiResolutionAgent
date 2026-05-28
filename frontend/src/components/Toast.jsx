import { useEffect } from "react"

function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [])

  const colors = {
    success: "#27ae60",
    error:   "#e74c3c",
    info:    "#3498db"
  }

  return (
    <div style={{
      ...styles.toast,
      backgroundColor: colors[type] || colors.info
    }}>
      {message}
    </div>
  )
}

const styles = {
  toast: {
    position:     "fixed",
    bottom:       "24px",
    right:        "24px",
    padding:      "14px 24px",
    borderRadius: "10px",
    color:        "#fff",
    fontSize:     "14px",
    fontWeight:   "600",
    boxShadow:    "0 4px 16px rgba(0,0,0,0.15)",
    zIndex:       1000,
    animation:    "fadeIn 0.3s ease"
  }
}

export default Toast