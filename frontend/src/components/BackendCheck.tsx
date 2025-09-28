import { useEffect } from "react";
import { toast } from "react-hot-toast";

const BackendCheck = () => {
  useEffect(() => {
    let mounted = true;
    const toastId = "backend-starting";

    const checkBackend = async () => {
      const apiUrl =
        import.meta.env.VITE_API_URL || "http://localhost:8080/api";

      try {
        const res = await fetch(`${apiUrl.split("api")[0]}actuator/health`, {
          cache: "no-store",
        });
        if (!mounted) return;

        if (!res.ok || (res.ok && (await res.json()).status !== "UP")) {
          toast.error("Backend not ready — showing dummy data", {
            id: toastId,
            duration: Infinity,
          });
        } else {
          toast.dismiss(toastId);
          toast.success("Backend is available — live data enabled", {
            id: toastId,
            duration: 3000,
          });
        }
      } catch {
        if (!mounted) return;
        toast.error("Backend unreachable — showing dummy data", {
          id: toastId,
          duration: Infinity,
        });
      }
    };

    checkBackend();

    return () => {
      mounted = false;
    };
  }, []);
  return null;
};

export default BackendCheck;
