import { useState, useEffect, useRef } from "react";
import "./App.css";

const App = () => {
  const canvasRef = useRef(null);
  const ballRef = useRef(null);
  const instructionsRef = useRef(null);
  const [ballState, setBallState] = useState({
    x: 300,
    y: 300,
    vx: 0,
    vy: 0,
    launched: false,
  });

  const initialSpeed = 30;
  const friction = 0.005;
  const minSpeed = 0.5;

  const handleCanvasClick = (e) => {
    if (!ballState.launched) {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const targetX = e.clientX - rect.left;
      const targetY = e.clientY - rect.top;
      const angle = Math.atan2(targetY - ballState.y, targetX - ballState.x);

      setBallState({
        ...ballState,
        vx: initialSpeed * Math.cos(angle),
        vy: initialSpeed * Math.sin(angle),
        launched: true,
      });
      instructionsRef.current.style.display = "none";
    }
  };

  const updateBall = () => {
    if (ballState.launched) {
      setBallState((prevState) => {
        let newVx = prevState.vx - friction * prevState.vx;
        let newVy = prevState.vy - friction * prevState.vy;

        let newX = prevState.x + newVx;
        let newY = prevState.y + newVy;

        if (newX >= canvasRef.current.width || newX <= 0) {
          newVx = -newVx; // Bounce horizontally
        }

        if (newY >= canvasRef.current.height || newY <= 0) {
          newVy = -newVy; // Bounce vertically
        }

        // Stop the ball when the speed is below the threshold
        if (Math.abs(newVx) < minSpeed && Math.abs(newVy) < minSpeed) {
          instructionsRef.current.style.display = "block";
          return { ...prevState, launched: false }; // Ball stopped
        }

        return {
          x: newX,
          y: newY,
          vx: newVx,
          vy: newVy,
          launched: prevState.launched,
        };
      });
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const ball = ballRef.current;
    ball.style.position = "absolute";
    ball.style.width = "30px";
    ball.style.height = "30px";
    ball.style.borderRadius = "50%";
    ball.style.backgroundColor = "red";

    const animate = () => {
      updateBall();
      ball.style.left = ballState.x + "px";
      ball.style.top = ballState.y + "px";
      requestAnimationFrame(animate);
    };
    animate();
  }, [ballState]);

  return (
    <div
      id="canvas"
      ref={canvasRef}
      onClick={handleCanvasClick}
      style={{
        position: "relative",
        background: "#f0f0f0",
        overflow: "hidden",
      }}
    >
      <div id="ball" ref={ballRef}></div>
      <div
        id="instructions"
        ref={instructionsRef}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontSize: "20px",
          fontFamily: "Arial, sans-serif",
          color: "#333",
          display: ballState.launched ? "none" : "block",
        }}
      >
        Click to launch the ball!
      </div>
    </div>
  );
};

export default App;
