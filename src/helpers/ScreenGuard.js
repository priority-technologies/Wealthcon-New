import { useEffect } from 'react';

const ScreenGuard = () => {

  // Function to copy a message to clipboard
  const copyToClipboard = () => {
    const aux = document.createElement("input");
    aux.setAttribute("value", "Você não pode mais dar printscreen. Isto faz parte da nova medida de segurança do sistema.");
    document.body.appendChild(aux);
    aux.select();
    document.execCommand("copy");
    document.body.removeChild(aux);
    alert("Print screen desabilitado.");
  };

  // Keyup event handler
  const handleKeyUp = (e) => {
    if (e.keyCode === 44) {  // KeyCode for PrintScreen
      copyToClipboard();
    }
  };

  // Handle focus/blur of the window
  const handleWindowFocus = () => {
    document.body.style.display = 'block';
  };

  const handleWindowBlur = () => {
    document.body.style.display = 'none';
  };

  useEffect(() => {
    // Add keyup listener for detecting PrintScreen key
    window.addEventListener('keyup', handleKeyUp);

    // Add listeners for window focus/blur
    window.addEventListener('focus', handleWindowFocus);
    window.addEventListener('blur', handleWindowBlur);

    // Cleanup event listeners on unmount
    return () => {
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('focus', handleWindowFocus);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, []);

  return null;  // This component doesn't render anything
};

export default ScreenGuard;
