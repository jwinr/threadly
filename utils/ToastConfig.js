const ToastConfig = {
  className: "",
  style: {
    width: "320px",
    height: "85px",
    background: "var(--sc-color-white)",
    padding: "10px 20px",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    borderRadius: "3px",
    boxShadow: "rgba(0, 0, 0, 0.15) 0px 5px 15px 0px",
  },
  success: {
    style: {
      borderLeft: "5px solid #61d345",
    },
  },
  error: {
    style: {
      borderLeft: "5px solid #ff4b4b",
    },
  },
}

export default ToastConfig
