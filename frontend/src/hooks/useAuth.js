import { useAuth as useAuthContext } from "../components/contexts/AuthContext";

export default function useAuth() {
   return useAuthContext();
}
