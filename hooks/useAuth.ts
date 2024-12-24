// hooks/useAuth.ts
import { useEffect } from "react";
import { useRouter } from "next/router";

const useAuth = () => {
    const router = useRouter();

    useEffect(() => {
        const isAuthenticated = false; // Replace with your authentication logic

        if (!isAuthenticated) {
            router.push("/auth");
        }
    }, [router]);
};

export default useAuth;
