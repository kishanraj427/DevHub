import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { login } from "@/generated/client/backend";
import { setToken } from "@/lib/auth";

export function useLogin() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (body: { email: string; password: string }) => {
      const result = await login({ body });
      if (result.error) throw result.error;
      return result.data!;
    },
    onSuccess: (data) => {
      setToken(data.data.token);
      navigate({ to: "/" });
    },
  });
}
