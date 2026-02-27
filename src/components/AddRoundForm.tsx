import { createSignal, Show } from "solid-js";
import pb from "../data/pb";
import { RoundStatusOptions } from "../models/pocketbase-types";

interface AddRoundFormProps {
    leagueId: string;
    onSuccess?: () => void;
}

export const AddRoundForm = (props: AddRoundFormProps) => {
    const [title, setTitle] = createSignal("");
    const [description, setDescription] = createSignal("");
    const [loading, setLoading] = createSignal(false);
    const [error, setError] = createSignal<string | null>(null);

    const onSubmit = async (e: Event) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await pb.collection('round').create({
                title: title(),
                description: description(),
                league: props.leagueId,
                status: RoundStatusOptions.not_started,
                // createdBy and order will be handled by the PocketBase hook
                order: 0, // Placeholder, hook will override
                createdBy: pb.authStore.record?.id || "" // Placeholder, hook will override
            });

            setTitle("");
            setDescription("");
            if (props.onSuccess) {
                props.onSuccess();
            }
        } catch (err: any) {
            setError(err.message || "Failed to add round.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div class="card bg-base-100 shadow-md">
            <div class="card-body">
                <h3 class="card-title text-xl mb-2">Add New Round</h3>
                <form onSubmit={onSubmit} class="space-y-4">
                    <div class="form-control w-full">
                        <label class="label"><span class="label-text font-semibold">Title</span></label>
                        <input
                            type="text"
                            placeholder="Round Title (e.g., Week 1, Finals)"
                            class="input input-bordered w-full"
                            value={title()}
                            onInput={(e) => setTitle(e.currentTarget.value)}
                            required
                        />
                    </div>

                    <div class="form-control w-full">
                        <label class="label"><span class="label-text font-semibold">Description (optional)</span></label>
                        <textarea
                            class="textarea textarea-bordered h-20"
                            placeholder="What's this round about?"
                            value={description()}
                            onInput={(e) => setDescription(e.currentTarget.value)}
                        ></textarea>
                    </div>

                    <Show when={error()}>
                        <div class="alert alert-error text-sm py-2">
                            <span>{error()}</span>
                        </div>
                    </Show>

                    <div class="card-actions justify-end mt-2">
                        <button 
                            type="submit" 
                            class="btn btn-primary btn-sm" 
                            disabled={loading()}
                        >
                            <Show when={loading()} fallback={"Add Round"}>
                                <span class="loading loading-spinner loading-xs"></span> Adding...
                            </Show>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
