import { zodResolver } from "@hookform/resolvers/zod";
import type { Profile } from "@prisma/client";
import type { UseFormProps } from "react-hook-form";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import create from "zustand";

export function useZodForm<TSchema extends z.ZodType>(
	props: Omit<UseFormProps<TSchema["_input"]>, "resolver"> & {
		schema: TSchema;
	}
) {
	const form = useForm<TSchema["_input"]>({
		...props,
		resolver: zodResolver(props.schema, undefined),
	});

	return form;
}

type ProfileCreationState = {
	profile: Partial<Profile>;
	update: (newProfile: Partial<Profile>) => void;
};

export const useProfileStore = create<ProfileCreationState>((set) => ({
	profile: {},
	update: (newProfile) =>
		set((state) => ({ profile: { ...state.profile, ...newProfile } })),
}));
