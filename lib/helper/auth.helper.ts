import { providers } from "@/lib/auth";

export const providerMap = providers
  .map((provider) => {
    if (typeof provider === "function") {
      const providerData = provider();
      return {
        id: providerData.id,
        name: providerData.name,
      };
    } else {
      return {
        id: provider.id,
        name: provider.name,
      };
    }
  })
  .filter((provider) => provider.id !== "credentials");
