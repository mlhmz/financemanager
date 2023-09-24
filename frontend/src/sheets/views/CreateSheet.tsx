import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { MutateSheet, Sheet } from "../Sheet";
import { SheetEditor } from "../components/SheetEditor";

async function createSheet(
  input: MutateSheet,
  token?: string
): Promise<Sheet> {
  const response = await fetch("/api/v1/sheets", {
    headers: {
      Authorization: `Bearer ${token ?? ""}`,
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(input),
  });
  if (response.status === 401) {
    throw new Error("Invalid session, please reload the window.");
  } else if (!response.ok) {
    const error = await response.json();
    if (error.message) throw new Error(error.message);
    throw new Error("Problem fetching data");
  }

  const data = await response.json();
  return data as Sheet;
}

export const CreateSheet = () => {
  const queryClient = useQueryClient();
  const auth = useAuth();
  const navigate = useNavigate();
  const { mutate } = useMutation({
    mutationFn: (data: MutateSheet) => {
      return createSheet(data, auth.user?.access_token);
    },
    onSettled: () => queryClient.invalidateQueries(["sheets"]),
  });

  const onSubmit = (formData: MutateSheet) => {
    mutate(
      { ...formData },
      {
        onSuccess: (data) => {
          toast.success(
            `The sheet named '${data.title}' was successfully created.`
          );
          navigate("/app/sheets");
        },
        onError: (error) =>
          error instanceof Error && toast.error(error.message),
      }
    );
  };

  return <SheetEditor onSubmit={onSubmit} />;
};
